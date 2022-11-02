This is the coresponding repository for the talk regarding Prometheus/Grafana at the Springfield Developers meetup for November 2022.

Running our example microservice:
```
node src/example-prometheus.js
```

Starting Prometheus:
```
docker run -p 9090:9090 -v /Users/ryandelap/projects/sgf-devs-2022-monitoring/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

Starting Grafana:
```
docker run -d -p 3000:4000 grafana/grafana-enterprise
```

Metric dashboards are already created.
