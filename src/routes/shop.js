const express = require('express')
const router = express.Router()
const path = require('path')
const rootDir = require('../utils/path')
const adminData = require('./admin')

router.get('/', (req, res, next) => {
  // path.join builds the path in such a way that it will work in Linux and Windows (using the appropriate forward/back slash relative to each)
  // console.log('shop.js', adminData.products)
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
  const products = adminData.products
  // Handlebars philosophy is to push most if not ALL the configuration into the JavaScript file
  res.render('./handlebars/shop', {
    products,
    docTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  })
})

module.exports = router
