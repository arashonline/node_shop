
exports.getLogin = (req, res, next) => {
  req.isAuthenticated = req.get('Cookie').split(';')[13].split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isAuthenticated
  });
};


exports.postLogin = (req, res, next) => {
  // we set a cookie simply by setting a header
  res.setHeader('Set-Cookie','LoggedIn=true')
  res.redirect('/');
};
