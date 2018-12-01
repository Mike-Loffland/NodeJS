const express = require('express')
const adminController = require('../controllers/admin')
const filterKey = '/admin'
const router = express.Router()
const isAuth = require('../middleware/is-auth')

// requests handle middleware from left to right.. som, order IS important

router.get('/add-product', isAuth, adminController.getAddProduct)
router.get('/products', adminController.getProducts)
router.post('/add-product', isAuth, adminController.postAddProduct)
router.get('/edit-product/:id', isAuth, adminController.getEditProduct)
router.post('/edit-product', isAuth, adminController.postEditProduct)
router.get('/delete-product/:id', isAuth, adminController.getDeleteProduct)

exports.routes = router
exports.filterKey = filterKey
