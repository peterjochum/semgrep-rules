const app = express()

// ruleid: express-check-exposed-metrics
app.get('/metrics', metrics.serveMetrics())

// ruleid: express-check-exposed-metrics
app.post('/metrics', metrics.serveMetrics())

// ok
app.get('/store', store.serveHome())
