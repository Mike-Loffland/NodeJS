const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const rootDir = require('./utils/path')
const fileNotFoundController = require('./controllers/file-not-found')
const User = require('./models/user')
const dbConn = require('./utils/mysqlconnection.js')
const mongoose = require('mongoose')

const app = express()
// tell express the name of the view engine
// https://expressjs.com/en/4x/api.html#app.settings.table
// EjS auto-registers itself with Express when installed via NPM or Yarn
app.set('view engine', 'ejs')
// default location of the views folder is named views... but, Windows did not seem to recognize this... manually setting
app.set('views', path.join(rootDir, 'views'))

// add middleware

app.use((req, res, next) => {
  User.findById('5bee208c6b39bd3cec64124d').then(user => {
    req.user = user
    next()
  }).catch(err => {
    console.log(err)
  })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))
app.use(adminData.filterKey, adminData.routes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(fileNotFoundController.show404)

mongoose.connect(dbConn.mongoDbConnectionString)
  .then(result => {

    User.findById('5bee208c6b39bd3cec64124d').then(user => {
      if(!user){
        const user = new User({
          name: 'Mike',
          email: 'mike@mike.com',
          cart: {
            items: []
          }
        })
        user.save()        
      }
    }).catch(err => {
      console.log(err)
    })

    app.listen(3000)
}).catch(err => {
  console.log(err)
})