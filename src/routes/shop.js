const express = require('express')
const shopController = require('../controllers/shop')
const router = express.Router()
const isAuth = require('../middleware/is-auth')

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/products/:id', shopController.getProductById)

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.get('/orders', isAuth, shopController.getOrders)

// // router.get('/checkout', shopController.getCheckout)

router.get('/delete-cart-item/:id', shopController.deleteCartItem)

router.post('/create-order', shopController.postOrder)

module.exports = router
