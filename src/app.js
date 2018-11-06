const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./utils/path')

// added 404 page
// added filters for routes
// added HTML page loading
// styled HTML pages
// added serving of static files

const app = express()

// add middleware
app.use(bodyParser.urlencoded({ extended: false }))
// express.static is a built-in middleware that ships with Express
// 'Public' is designated as the static assets folder... hence, all references to files in the 'public' folder should be as if they are being accessed from the 'root'... 'public' is never
// directly referenced... static asset references will be forwarded to the 'public' folder
// ** note, you can have multiple static folders. But, the referenced file will be resolved relative to the first folder where Express finds said file
app.use(express.static(path.join(__dirname, 'public')))
// .use can be prefaced with a filter that will only match the defined routes if the filter is matched as well (instead of having to repeat it in all the defined routes)
app.use(adminRoutes.filterKey, adminRoutes.paths)
app.use(shopRoutes)

// .use handles all http methods (versus sister methods like get and post)
// catch all route for routes that could not be matched (404 page)
app.use((req, res, next) => {
  let statusCode = 404
  res.status(statusCode).sendFile(path.join(rootDir, 'views', '404.html'))
})

app.listen(3000)
