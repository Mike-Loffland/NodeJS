const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
        res.redirect('/login')
      })

  })
  .catch(err => {
    console.log(err)
  })
}