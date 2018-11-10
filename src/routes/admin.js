const express = require('express')
const adminController = require('../controllers/admin')
const filterKey = '/admin'
const router = express.Router()

router.get('/add-product', adminController.getAddProduct)

router.get('/products', adminController.getProducts)

router.post('/add-product', adminController.postAddProduct)

router.get('/edit-product/:id', adminController.getEditProduct)
router.post('/edit-product', adminController.postEditProduct)
router.get('/delete-product/:id', adminController.getDeleteProduct)

exports.routes = router
exports.filterKey = filterKey
