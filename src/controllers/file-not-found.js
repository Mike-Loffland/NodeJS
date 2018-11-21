exports.show404 = (req, res, next) => {
  let statusCode = 404
  res.status(statusCode).render('./ejs/404', { docTitle: '404 - Page Not Found', path: req.url, isLoggedIn: req.isLoggedIn, })
}
