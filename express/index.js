const express = require('express')
const app = express()
const apiRouter = express.Router()
const data = require("./data")

apiRouter.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: data
  })
})

app.use('/api', apiRouter)

app.listen(8081)
