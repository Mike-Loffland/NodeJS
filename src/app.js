const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./utils/path')

const app = express()

// // ###### EjS
// tell express the name of the view engine
app.set('view engine', 'ejs')
app.set('views', path.join(rootDir, 'views'))

// add middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))
app.use(adminData.filterKey, adminData.routes)
app.use(shopRoutes)
app.use((req, res, next) => {
  let statusCode = 404
  console.log('in 404')
  console.log(req.url)
  res.status(statusCode).render('./ejs/404', { docTitle: '404 - Page Not Found', path: req.url })
})

app.listen(3000)
