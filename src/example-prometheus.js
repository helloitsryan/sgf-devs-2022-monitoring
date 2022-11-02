const express = require('express')
const Prometheus = require('prom-client')

const app = express()
app.disable('etag');

const port = 3000

const register = new Prometheus.Registry()
Prometheus.collectDefaultMetrics({ register })

const homeVisits = new Prometheus.Counter({
    name: 'visits_total',
    help: 'Total number of home visits'
})

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.10, 5, 15, 50, 100, 200, 500]  // buckets for response time from 0.1ms to 500ms
})

register.registerMetric(homeVisits)
register.registerMetric(httpRequestDurationMicroseconds)

// Runs before each requests
app.use((req, res, next) => {
    res.locals.startEpoch = Date.now()
    next()
})

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.get('/home', (req, res, next) => {
  homeVisits.inc()

  res.status(200).send('Hello World!')
  
  next()
})

app.get('/slow', (req, res, next) => {
  setTimeout(() => {
    res.status(200).send("Slow response...");
    next()
  }, 300);
})

// Runs after each requests
app.use((req, res, next) => {
    const responseTimeInMs = Date.now() - res.locals.startEpoch
    
    console.log(responseTimeInMs);

    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(responseTimeInMs)
  
    next()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})