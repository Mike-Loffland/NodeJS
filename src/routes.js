const fs = require('fs')

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html><head><title>Enter Some Message</title></head><body>')
    res.write(
      '<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>'
    )
    res.write('</body></html>')
    return res.end() // don't execute any other code... just return
  }

  if (url === '/message' && method === 'POST') {
    // fs.writeFile
    const body = []
    req.on('data', chunk => {
      console.log(chunk)
      body.push(chunk)
    })

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString() // because we know that the incoming data will be string
      // array destructure... get second value
      const [, value] = parsedBody.split('=')

      console.log(value)
      // synchronous call below.. will block until file is created
      // fs.writeFileSync('message.txt', message)
      // res.statusCode = 302
      // res.setHeader('Location', '/')
      // return res.end()

      // asynchronous call below... will NOT block.
      fs.writeFile('message.txt', value, err => {
        if (!err) {
          res.statusCode = 302
          res.setHeader('Location', '/')
        } else {
          console.log(err)
          res.statusCode = 500
        }
        return res.end()
      })
    })
  }

  res.setHeader('Content-Type', 'text/html')
  res.write(`<html><head><title>Your Request</title></head><body><b>LAME REQUEST</b></body></html>`)
  res.end() // essentially a return
}

// module.exports = requestHandler

// OR

// module.exports = { handler: requestHandler, someKey: 'Some hardcoded key' }

// OR

// module.exports.handler = requestHandler
// module.exports.someKey = 'Some hardcoded key'

// OR

// Node.js allows you to drop the "module." reference if you want
exports.handler = requestHandler
exports.someKey = 'Some hardcoded key again'
