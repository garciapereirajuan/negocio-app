const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const { API_VERSION } = require('./config')

//Load routings
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const mainProductRoutes = require('./routes/mainProduct')
const categoryRoutes = require('./routes/category')
const bonusProductRoutes = require('./routes/bonusProduct')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Configure Header HTTP
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

//Routes basic
app.use(`/api/${API_VERSION}`, userRoutes)
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, mainProductRoutes)
app.use(`/api/${API_VERSION}`, categoryRoutes)
app.use(`/api/${API_VERSION}`, bonusProductRoutes)

module.exports = app