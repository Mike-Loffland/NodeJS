const express = require('express')
const router = express.Router()
const adminData = require('./admin')

router.get('/', (req, res, next) => {
  const products = adminData.products
  res.render('./ejs/shop', {
    products,
    docTitle: 'Shop',
    path: '/',
  })
})

module.exports = router
