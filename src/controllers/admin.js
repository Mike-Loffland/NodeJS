const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('./ejs/admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    filterKey: '/admin',
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
  })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit && req.query.edit.toUpperCase() === 'TRUE'
  if (editMode) {
    const { id } = req.params
    Product.findById(id)
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
            isLoggedIn: req.session.isLoggedIn,
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
  Product.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, imageUrl } = req.body
  const { _id } = req.session.user //req.user
  const product = new Product({ 
    title, 
    price, 
    description, 
    imageUrl,
    userId: _id
  })

  product.save()
  .then(() => {
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err)
  })
}

exports.postEditProduct = (req, res, next) => {
  const { title, price, description, imageUrl, id } = req.body
  Product.findById(id)
    .then(product => {
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save()
    })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id') // define the fields you want.. exclude the _id field (_id is always included unless you say to exclude it)
    // .populate('userId', 'name') // just return the name field on the User
    // .populate('userId') // return the entire user object
    .then(products => {
      res.render('./ejs/admin/product-list-admin', {
        products,
        docTitle: 'Admin Products',
        path: '/admin/products',
        isLoggedIn: req.session.isLoggedIn,
      })
    })
    .catch(err => {
      console.log(err)
    })
}