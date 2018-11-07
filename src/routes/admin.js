const express = require('express')
const router = express.Router()
const filterKey = '/admin'

const products = []

router.get('/add-product', (req, res, next) => {
  res.render('./handlebars/add-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
    filterKey,
  })
})

// sister functions to .use : .get, .post, .put, .patch, and .delete
router.post('/add-product', (req, res, next) => {
  let { title } = req.body
  products.push({ title })
  res.redirect('/')
})

exports.routes = router
exports.filterKey = filterKey
exports.products = products
