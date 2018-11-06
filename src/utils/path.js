const path = require('path')

// process.mainModule.filename refers to the file that was used to spawn the Node process (app.js in this instance)
module.exports = path.dirname(process.mainModule.filename)
