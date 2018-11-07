const express = require('express')
const productsController = require('../controllers/products')
const filterKey = '/admin'
const router = express.Router()

router.get('/add-product', productsController.getAddProduct)

// sister functions to .use : .get, .post, .put, .patch, and .delete
router.post('/add-product', productsController.postAddProduct)

exports.routes = router
exports.filterKey = filterKey
