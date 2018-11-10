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
      console.loog(err)
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
    .then(cart => {
      return cart.getProducts()
    })
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
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id } })
    })
    .then(([product]) => {
      return product.cartItem.destroy()
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
  // Product.getProduct(id, product => {
  //   if (!product) {
  //     // throw error
  //     console.log(`Product was not found for id: ${id}`)
  //   } else {
  //     Cart.removeProduct(product)
  //     res.redirect('/cart')
  //   }
  // })
}

exports.postCart = (req, res, next) => {
  let { id } = req.body
  let fetchedCart
  let newQuantity = 1

  req.user
    .getCart()
    .then(cart => {
      // see if the incoming product is already in the user's cart
      fetchedCart = cart
      return fetchedCart.getProducts({ where: { id } })
    })
    .then(([product]) => {
      if (product) {
        const oldQuantity = product.cartItem.quantity
        newQuantity = oldQuantity + 1
        return product
      }
      return Product.findByPk(id)
    })
    .then(product => {
      // addProduct will update if the record is already there... or add a new record if it doesn't
      // ... so, addProduct does more than just "add"
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return fetchedCart.getProducts()
    })
    .then(cartProducts => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            cartProducts.map(cp => {
              cp.orderItem = { quantity: cp.cartItem.quantity }
              return cp
            })
          )
        })
        .catch(err => {
          console.log(err)
        })
    })
    .then(orderProducts => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
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
