const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('In / path middleware')
  res.send('<h1>Express!!!</h1>')
})

module.exports = router
