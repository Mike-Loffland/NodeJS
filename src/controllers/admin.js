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
    // getting the product to edit based on the user... not sure why he is doing this (wouldn't you want admins to be able to edit ALL products?? not just the ones they created?)
    Product.getById(id)
      .then(product => {
        if (!product) {
          // throw error
          console.log(`Product was not found for id: ${id}`)
          return res.redirect('/')
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
      .catch(err => {
        console.log(err)
      })
  }
}

exports.getDeleteProduct = (req, res, next) => {
  const { id } = req.params
  Product.deleteById(id)
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body)

    product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  const product = new Product(req.body)
  product.save()
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('./ejs/admin/product-list-admin', {
        products,
        docTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => {
      console.loog(err)
    })
}
