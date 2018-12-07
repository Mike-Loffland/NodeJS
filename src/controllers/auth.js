const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const nodemailerSendgridTransport = require('nodemailer-sendgrid-transport')
const secretFile = require('../utils/mysqlconnection.js')
const crypto = require('crypto') // internal node library -> https://nodejs.org/api/crypto.html
console.log(secretFile.sendGridKey)
const transporter = nodemailer.createTransport(nodemailerSendgridTransport({
  auth: {
    api_user: secretFile.sendGridKey
  }
}))

exports.getLogin = (req, res, next) => {

  // *** EXTRACT MANUAL COOKIE LOGIC
  // let isLoggedIn = false

  // if(req.get('Cookie')){
  //   let [,loggedInValue] = req.get('Cookie')
  //   .split(';')
  //   .find(c => c.trim().toUpperCase().includes('ISLOGGEDIN='))
  
  //   if(loggedInValue){
  //     [,value] = loggedInValue.split('=')
  //     isLoggedIn = value.toUpperCase() === 'TRUE'
  //   }    
  // }
  // *** END EXTRACT MANUAL COOKIE LOGIC  
  res.render('./ejs/auth/login', {
    docTitle: 'Shop | Login',
    path: '/login',
    errorMessage: req.flash('error')
  })
}

exports.postLogin = (req, res, next) => {
  // below will not work... it's lost after we send a response.. bring in the cookies!
  // req.isLoggedIn = true 

  // **** MANUAL COOKIE
  // // Set-Cookie: https://tools.ietf.org/html/rfc6265
  // res.setHeader('Set-Cookie', 'isLoggedIn=true')

  // // example of setting other properties on the cookie
  // // res.setHeader('Set-Cookie', 'isLoggedIn=true; Max-Age=10;')
  // res.setHeader('Set-Cookie', 'isLoggedIn=true; Max-Age=10; HttpOnly') // HttpOnly makes it so the cookie cannot be accessed via client-side script
  // // res.setHeader('Set-Cookie', 'isLoggedIn=true; Max-Age=10; Secure')
  // **** END MANUAL COOKIE

  // use a session-store (database... using connect-mongodb-session since we're already using mongodb)
  const { email, password } = req.body

  User.findOne({ email }).then(user => {
    if(!user){
      req.flash('error', 'Invalid email or password')
      return res.redirect('/login')
    }
    
    bcrypt.compare(password, user.password)
      .then( success => {
        if(success){
          req.session.user = user
          req.session.isLoggedIn = true // session cookie will expire when the browser is closed
          req.session.save(err => {
            console.log('user logged in', err)
            res.redirect('/')
          })
        } else {
          res.redirect('/login')
        }
      })
      .catch(err => {
        // this is only for true errors (not if the passwords do not match)
      })
  }).catch(err => {
    console.log(err)
  })  

}


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    // console.log(err) // err will only have something if there is a problem
    res.redirect('/')
  }) // via connect-mongodb-session

}

exports.getSignup = (req, res, next) => {
  res.render('./ejs/auth/signup', {
    docTitle: 'Shop | Signup',
    path: '/signup',
    isLoggedIn: false,
  })
}
exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body

  User.findOne({ email }).then(user => {
    if(user){
      return res.redirect('/signup')
    } 

    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const newUser = new User({
          email,
          password: hashedPassword,
          cart: {
            items: []
          }
        })
        return newUser.save()
      })
      .then(() => {
        console.log('attempting to send email')
        return transporter.sendMail({
          to: 'mike@moderngenealogist.com',
          from: 'shop@nodeshop.com',
          subject: 'Slow golf clap',
          html: '<h1>Super cool</h1>Thanks buddy!'
        })
      }).then(()=> {
        console.log('attempting to redirect')
        res.redirect('/login')
      })

  })
  .catch(err => {
    console.log(err)
  })
}

exports.getReset = (req, res, next) => {
  res.render('./ejs/auth/reset-password', {
    docTitle: 'Shop | Reset Password',
    path: '/reset',
    errorMessage: req.flash('error')
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err)
      return res.redirect('reset')
    }

    let { email } = req.body
    const token = buffer.toString('hex') // convert hext to ascii

    User.findOne({ email }).then(user => {
      if(!user){
        console.log('no user')
        req.flash('error', 'No go... buddy.')
        return res.redirect('/reset')
      }
      console.log('setting token')
      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3600000 // milliseconds
      return user.save()
    }).then( result => {
      console.log('getting ready to send email')

      res.redirect('/')

      console.log(`http://localhost:3000/reset/${token}"`)
      transporter.sendMail({
        to: email,
        from: 'shop@nodeshop.com',
        subject: 'Password reset',
        html: `<h1>Password Reset Information</h1>
        <p>Click <a href="http://localhost:3000/reset/${token}">this link</a> to set a new password.</p>`
      })   
    })
    .catch(err => {
      console.log(err)
    })
  })
}