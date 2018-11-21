// CONTROLLER - connects model and view, should only make sure that the two can communicate (in both directions)
const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('./ejs/shop/index', {
        products,
        docTitle: 'Shop',
        path: '/',
        isLoggedIn: req.isLoggedIn,
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('./ejs/shop/product-list', {
        products,
        docTitle: 'All Products',
        path: '/products',
        isLoggedIn: req.isLoggedIn,        
      })
    })
    .catch(err => {
      console.loog(err)
    })
}

exports.getProductById = (req, res, next) => {
  let { id } = req.params

  Product.findById(id)
    .then(product => {
      res.render('./ejs/shop/product-detail', {
        product,
        docTitle: `Product Details: ${product.title}`,
        path: '/products',
        isLoggedIn: req.isLoggedIn,
      })
    })
    .catch(err => {
      console.log(err)
    })

}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId') // does not return a promise
    .execPopulate() // returns a promise
    .then(user => {
      res.render('./ejs/shop/cart', {
        docTitle: 'Your Cart',
        path: '/cart',
        cartProducts: user.cart.items,
        isLoggedIn: req.isLoggedIn,
      })
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
  Product.findById(id).then(product => {
    return req.user.addToCart(product)
  }).then(result => {
    res.redirect('/cart')
  }).catch(err => {
    console.log(err)
  })
}

exports.postOrder = (req, res, next) => {
  let { name } = req.user
  req.user
    .populate('cart.items.productId') // does not return a promise
    .execPopulate() // returns a promise
    .then(user => { 
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          productData: { ...i.productId._doc } // _doc is from Mongoose... get the object document
        }
      })
      const order = new Order({
        user: {
          name,
          userId: req.user
        },
        products 
      })      
      order.save()
    })  
    .then(() => {
      return req.user.clearCart()
    })
    .then(()=> {
      res.redirect('/orders')      
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('./ejs/shop/orders', {
        docTitle: 'Your Orders',
        path: '/orders',
        orders,
        isLoggedIn: req.isLoggedIn,
    })
  })
}

// exports.getCheckout = (req, res, next) => {
//   res.render('./ejs/shop/checkout', {
//     docTitle: 'Checkout',
//     path: '/ccheckout',
//   })
// }
