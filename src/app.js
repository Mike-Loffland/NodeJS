const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./utils/path')
const fileNotFoundController = require('./controllers/file-not-found')
const app = express()

// tell express the name of the view engine
// https://expressjs.com/en/4x/api.html#app.settings.table
// EjS auto-registers itself with Express when installed via NPM or Yarn
app.set('view engine', 'ejs')
// default location of the views folder is named views... but, Windows did not seem to recognize this... manually setting
app.set('views', path.join(rootDir, 'views'))

// add middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))
app.use(adminData.filterKey, adminData.routes)
app.use(shopRoutes)
app.use(fileNotFoundController.show404)

app.listen(3000)
