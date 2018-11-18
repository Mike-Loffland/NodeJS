exports.getLogin = (req, res, next) => {
  res.render('./ejs/auth/login', {
    docTitle: 'Shop | Login',
    path: '/login',
  })
}