// CONTROLLER - connects model and view, should only make sure that the two can communicate (in both directions)
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('./ejs/add-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    filterKey: '/admin',
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('./ejs/shop', {
      products,
      docTitle: 'Shop',
      path: '/',
    })
  })
}
