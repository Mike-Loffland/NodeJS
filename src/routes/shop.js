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
  res.render('./pug/shop', { products, docTitle: 'Shop', path: '/' })
})

module.exports = router
