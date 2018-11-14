// CONTROLLER - connects model and view, should only make sure that the two can communicate (in both directions)
const Product = require('../models/product')

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('./ejs/shop/index', {
        products,
        docTitle: 'Shop',
        path: '/',
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('./ejs/shop/product-list', {
        products,
        docTitle: 'All Products',
        path: '/products',
      })
    })
    .catch(err => {
      console.loog(err)
    })
}

exports.getProductById = (req, res, next) => {
  let { id } = req.params

  Product.getById(id)
    .then(product => {
      res.render('./ejs/shop/product-detail', {
        product,
        docTitle: `Product Details: ${product.title}`,
        path: '/products',
      })
    })
    .catch(err => {
      console.log(err)
    })

}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('./ejs/shop/cart', {
        docTitle: 'Your Cart',
        path: '/cart',
        cartProducts: products,
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteCartItem = (req, res, next) => {
  let { id } = req.params
  req.user.deleteCartItem(id).then(()=> {
    res.redirect('/cart')    
  })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  let { id } = req.body
  Product.getById(id).then(product => {
    return req.user.addToCart(product)
  }).then(result => {
    res.redirect('/cart')
  }).catch(err => {
    console.log(err)
  })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      console.log('orders=', orders)
      res.render('./ejs/shop/orders', {
        docTitle: 'Your Orders',
        path: '/orders',
        orders,
      })
    })
    .catch(err => {
      console.log(err)
    })
}

// exports.getCheckout = (req, res, next) => {
//   res.render('./ejs/shop/checkout', {
//     docTitle: 'Checkout',
//     path: '/ccheckout',
//   })
// }
