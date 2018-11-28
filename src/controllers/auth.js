const User = require('../models/user')

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
 
  let isLoggedIn = req.session.isLoggedIn

  res.render('./ejs/auth/login', {
    docTitle: 'Shop | Login',
    path: '/login',
    isLoggedIn,
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
  User.findById('5bee208c6b39bd3cec64124d').then(user => {
    req.session.user = user
    req.session.isLoggedIn = true // session cookie will expire when the browser is closed
    res.redirect('/')
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