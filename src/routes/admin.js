const express = require('express')
const router = express.Router()
const path = require('path')
const rootDir = require('../utils/path')

const filterKey = '/admin'

router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

// sister functions to .use : .get, .post, .put, .patch, and .delete
router.post('/add-product', (req, res, next) => {
  res.redirect('/')
})

module.exports = { paths: router, filterKey }
