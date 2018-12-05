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
const session = require('express-session')
const MongoDbstore = require('connect-mongodb-session')(session) // pass in the express-session variable
const csurf = require('csurf') // https://github.com/expressjs/csurf
const flash = require('connect-flash')

// csurf
// new token is created for every page that is rendered
// protects against CSRF attacks
const csrfPrevention = csurf()
const app = express()

const sessionStore = new MongoDbstore({
  uri: dbConn.MONGODB_URI,
  collection: 'sessions',
})

// tell express the name of the view engine
// https://expressjs.com/en/4x/api.html#app.settings.table
// EjS auto-registers itself with Express when installed via NPM or Yarn
app.set('view engine', 'ejs')
// default location of the views folder is named views... but, Windows did not seem to recognize this... manually setting
app.set('views', path.join(rootDir, 'views'))

// add middleware

// app.use((req, res, next) => {
//   User.findById('5bee208c6b39bd3cec64124d').then(user => {
//     req.user = user
//     next()
//   }).catch(err => {
//     console.log(err)
//   })
// })

app.use(session({
  secret: 'somelongstringofsomesort',
  resave: false, // optimization
  saveUninitialized: false, // optimization
  store: sessionStore,
  // cookie: {
  //   configure some stuff about the cookie
  // }
}))
app.use(bodyParser.urlencoded({ extended: false }))


// AFTER we initialize the session
app.use(csrfPrevention) // IMPORTANT: the use statement for csurf NEEDS to be after the bodyParser use statements.. otherwise the body hasn't been parsed before the check occurs

// csurf will look for the existence of a csrf token for non get requests
// hence, you need to make available in your views... pass it into the views via Express' res.locals...


app.use(flash()) //https://github.com/jaredhanson/connect-flash

app.use((req, res, next) => {
  // res.locals is available via Express
  res.locals.isLoggedIn = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(express.static(path.join(rootDir, 'public')))

app.use(adminData.filterKey, adminData.routes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(fileNotFoundController.show404)

mongoose.connect(dbConn.MONGODB_URI)
  .then(result => {
    // User.findById('5bee208c6b39bd3cec64124d').then(user => {
    //   if(!user){
    //     const user = new User({
    //       name: 'Mike',
    //       email: 'mike@mike.com',
    //       cart: {
    //         items: []
    //       }
    //     })
    //     user.save()        
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
    app.listen(3000)
}).catch(err => {
  console.log(err)
})