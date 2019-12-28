const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

// initializing some options
const transporter = nodemailer.createTransport(sendGridTransport({
  auth:{
    // api_user:"",
    api_key:""
  }
}))

exports.getLogin = (req, res, next) => {
  
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'

  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // flash get type like error and message
        req.flash('error','Invalid Email or Password');
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
      .then(validPassword => {
        if (!validPassword) {
          req.flash('error','Invalid Email or Password');
          return res.redirect('/login')          
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      })
      .catch(
        err => {
          console.log(err)
          res.redirect('/');
        }
      );
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error','An account with requested email already exist!');
        return res.redirect('/signup')
      }
      return bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        })
        return user.save()
      });

    })
    .then(result => {
      req.flash('success','Thank you for registering');
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'teat@arash.co',
        subject: 'Sign up success',
        html: `<h1>Welcome</h1>`,
      })
       .catch(err => console.log(err));;
      
    }
    )
    .catch(err => console.log(err));
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
