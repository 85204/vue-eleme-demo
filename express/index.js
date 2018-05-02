const express = require('express')
const app = express()
const apiRouter = express.Router()
const data = require('./data')

apiRouter.get('/seller', (req, res) => {
  res.json({
    errno: 0,
    data: data.seller
  })
})
apiRouter.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: data.goods
  })
})
apiRouter.get('/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: data.ratings
  })
})

app.use('/api', apiRouter)

app.listen(8081)
