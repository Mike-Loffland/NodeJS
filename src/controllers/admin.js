const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('./ejs/admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    filterKey: '/admin',
    editing: false,
  })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit && req.query.edit.toUpperCase() === 'TRUE'
  if (editMode) {
    const { id } = req.params
    Product.getProduct(id, product => {
      if (!product) {
        // throw error
        console.log(`Product was not found for id: ${id}`)
      } else {
        res.render('./ejs/admin/edit-product', {
          docTitle: 'Edit Product',
          path: '/admin/edit-product',
          filterKey: '/admin',
          editing: editMode,
          product,
        })
      }
    })
  }
}

exports.getDeleteProduct = (req, res, next) => {
  const { id } = req.params
  Product.delete(id, () => {
    res.redirect('/admin/products')
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body)
  product.save()
  res.redirect('/')
}

exports.postEditProduct = (req, res, next) => {
  let updatedProduct = new Product(req.body)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('./ejs/admin/product-list-admin', {
      products,
      docTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
}
