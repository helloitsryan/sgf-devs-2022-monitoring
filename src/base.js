const express = require('express')
const Prometheus = require('prom-client')

const app = express()
app.disable('etag');

const port = 3000

app.get('/home', (req, res, next) => {
  res.status(200).send('Hello World!')
  
  next()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})