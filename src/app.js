const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./utils/path')
const expressHandlebars = require('express-handlebars')
//
const app = express()

// // ###### PUG
// app.set('view engine', 'pug')
// // default value for the property 'views' is process.cwd() + '/views' ... but, we're setting it here to be verbose and exemplify
// // **** NOTE: Had to use path.join(__dirname, 'views') instead of just 'views' (Windows issue??)
// app.set('views', path.join(__dirname, 'views'))

// ### Handlebars (express-handlebars)
// ** Handlebars does NOT auto-registers itself with express upon install via NPM... hence, you have to require it and let Express know that you wnat to use it via app.engine().
// **** you have to pass in some options to configure layout templates for Handlebars
// **** you also have to manually set the extension name for some reason (even though it's already defined)... ONLY applies to the layou
app.engine(
  'hbs',
  expressHandlebars({
    layoutsDir: path.join(rootDir, 'views/handlebars/layout/'),
    defaultLayout: 'main-layout',
    extname: 'hbs',
  })
)
// tell express the name of the view engine
app.set('view engine', 'hbs')
// default value for the property 'views' is process.cwd() + '/views' ... but, we're setting it here to be verbose and exemplify
// **** NOTE: Had to use path.join(__dirname, 'views') instead of just 'views' (Windows issue??)
app.set('views', path.join(rootDir, 'views'))

// add middleware
app.use(bodyParser.urlencoded({ extended: false }))
// express.static is a built-in middleware that ships with Express
// 'Public' is designated as the static assets folder... hence, all references to files in the 'public' folder should be as if they are being accessed from the 'root'... 'public' is never
// directly referenced... static asset references will be forwarded to the 'public' folder
// ** note, you can have multiple static folders. But, the referenced file will be resolved relative to the first folder where Express finds said file
app.use(express.static(path.join(rootDir, 'public')))
// .use can be prefaced with a filter that will only match the defined routes if the filter is matched as well (instead of having to repeat it in all the defined routes)
app.use(adminData.filterKey, adminData.routes)
app.use(shopRoutes)

// .use handles all http methods (versus sister methods like get and post)
// catch all route for routes that could not be matched (404 page)
app.use((req, res, next) => {
  let statusCode = 404
  console.log('in 404')
  res.status(statusCode).render('./handlebars/404', { docTitle: '404 - Page Not Found' })
})

app.listen(3000)
