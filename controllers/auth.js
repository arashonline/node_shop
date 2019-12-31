const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check')

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
    pageTitle: 'Login',
    oldInput:{
      email:'',
      password:'',
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    oldInput:{
      email:'',
      password:'',
      confirmPassword:'',
    }
   
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors= validationResult(req);
  console.log(errors);
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessageValidator: errors.array(),
      oldInput: {
         email:email,
         password:password
      }
    });
  }
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
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessageValidator: errors.array(),
      oldInput: { email:email,password:password,confirmPassword:req.body.confirmPassword}
    });
  }

  
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

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer)=>{
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }
    const email = req.body.email;
    const token = buffer.toString('hex');
    User.findOne({email:email})
    .then(user=>{
      if(!user){
        req.flash('error','An account with requested email does not exist!');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + (3600*1000);
      return user.save().then(result =>{
        res.redirect('/')
         transporter.sendMail({
          to: email,
          from: 'teat@arash.co',
          subject: 'Password Reset',
          html: `
          <h1>Password Reset</h1>
          <p>You requested a password reset.</p>
          <p>Click <a href="http://localhost:8021/reset/${token}">This Link</a> to reset your password</p>
          `,
        })
         .catch(err => console.log(err));;
      });
    })
    .catch(err => console.log(err));
  })
};

exports.getNewPassword = (req,res,next)=>{
  const token = req.params.token;
  User.findOne({resetToken:token, resetTokenExpiration:{$gt: Date.now()}})
  .then(user=>{
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Update Password',
      userId: user._id.toString(),
      passwordToken: token,
    });
  })
  .catch(err => console.log(err));
  
}

exports.postNewPassword = (req,res,next)=>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken:passwordToken, resetTokenExpiration:{$gt: Date.now()},_id:userId})
  .then(user=>{
    resetUser = user;
    return bcrypt.hash(newPassword,12)
  }).then(hashedPassword =>{
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save()
  })
  .then(result =>{
    res.redirect('/login')
  })
  .catch(err => console.log(err));
}