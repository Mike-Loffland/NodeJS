// CONTROLLER - connects model and view, should only make sure that the two can communicate (in both directions)
const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('./ejs/shop/index', {
      products,
      docTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('./ejs/shop/product-list', {
      products,
      docTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getProductById = (req, res, next) => {
  let { id } = req.params
  Product.getProduct(id, product => {
    res.render('./ejs/shop/product-detail', {
      product,
      docTitle: `Product Details: ${product.title}`,
      path: '/products',
    })
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []
      cart.products.forEach(cp => {
        let product = products.find(p => p.id === cp.id)
        if (product) {
          cartProducts.push({ productData: product, qty: cp.qty, linePrice: product.price * cp.qty })
        }
      })
      res.render('./ejs/shop/cart', {
        docTitle: 'Your Cart',
        path: '/cart',
        cart: { totalPrice: cart.totalPrice, cartProducts },
      })
    })
  })
}

exports.deleteCartItem = (req, res, next) => {
  let { id } = req.params
  Product.getProduct(id, product => {
    if (!product) {
      // throw error
      console.log(`Product was not found for id: ${id}`)
    } else {
      Cart.removeProduct(product)
      res.redirect('/cart')
    }
  })
}

exports.postCart = (req, res, next) => {
  let { id } = req.body
  Product.getProduct(id, prod => {
    Cart.addProduct(prod)
  })
  res.redirect('/cart')
}

exports.getOrders = (req, res, next) => {
  res.render('./ejs/shop/orders', {
    docTitle: 'Your Orders',
    path: '/orders',
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('./ejs/shop/checkout', {
    docTitle: 'Checkout',
    path: '/ccheckout',
  })
}
