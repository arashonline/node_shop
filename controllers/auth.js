const User = require('../models/user')
exports.getLogin = (req, res, next) => {
 
  console.log(req.session)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isAuthenticated
  });
};


exports.postLogin = (req, res, next) => {
  User.findOne()
  .then(user => {
      req.session.user = user;
      req.session.isAuthenticated = true;
      req.session.save(err =>{
        console.log(err)
        res.redirect('/');
      })  
  })
  .catch(err => { console.log(err) });
  
  
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/');
  });
  
};
