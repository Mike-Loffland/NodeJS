const express = require('express')
const router = express.Router()
const path = require('path')
const rootDir = require('../utils/path')

router.get('/', (req, res, next) => {
  // __dirname is a global Node.js variable that holds the abosolute path on said operating system to the folder where your file resides
  // path.join builds the path in such a way that it will work in Linux and Windows (using the appropriate forward/back slash relative to each)
  res.sendFile(path.join(rootDir, 'views', 'shop.html'))
})

module.exports = router
