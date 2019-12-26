
exports.getLogin = (req, res, next) => {
  req.isAuthenticated = req.session.isAuthenticated;
  console.log(req.session)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isAuthenticated
  });
};


exports.postLogin = (req, res, next) => {
  req.session.isAuthenticated = true;
  res.redirect('/');
};
