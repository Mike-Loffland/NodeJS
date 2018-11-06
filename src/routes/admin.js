const express = require('express')

const router = express.Router()

router.get('/add-product', (req, res, next) => {
  console.log('In /add-product path middleware')
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button stype="submit">Add Product</button></form>'
  )
})

// sister functions to .use : .get, .post, .put, .patch, and .delete
router.post('/product', (req, res, next) => {
  console.log('In /product path middleware')
  console.log(req.body)

  res.redirect('/')
})

module.exports = router
