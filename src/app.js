const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./utils/path')
const fileNotFoundController = require('./controllers/file-not-found')
const sequelize = require('./utils/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express()
// tell express the name of the view engine
// https://expressjs.com/en/4x/api.html#app.settings.table
// EjS auto-registers itself with Express when installed via NPM or Yarn
app.set('view engine', 'ejs')
// default location of the views folder is named views... but, Windows did not seem to recognize this... manually setting
app.set('views', path.join(rootDir, 'views'))

// add middleware
// this won't be called until an actual request is made (as is the case with setting up all middleware)
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      // attach the user (sequelize user [all the utility methods.. etc..]) to the request object so it's there on all requests
      req.user = user
      // pass on to the next middleware
      next()
    })
    .catch(err => {
      console.log(err)
    })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))
app.use(adminData.filterKey, adminData.routes)
app.use(shopRoutes)
app.use(fileNotFoundController.show404)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

sequelize
  // force override (re-create the table... just for development)
  //.sync({ force: true })
  // make sure all the tables exist
  .sync()
  .then(() => {
    return User.findById(1)
  })
  .then(user => {
    // just code to ensure we always have our dev user
    if (!user) {
      User.create({ name: 'Mike', email: 'test@test.com' }).then(u => {
        u.createCart()
      })
    }
    // if you return a value in a "then" clause... it will be automatically wrapped into a new promise
    return user
    // return Promise.resolve(user)
  })
  .then(() => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
