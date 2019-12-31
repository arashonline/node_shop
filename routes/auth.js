const express = require('express');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth');
// const expValidator = require('express-validator/check');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const router = express.Router();


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.'),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .isAlphanumeric()
], authController.postLogin);

router.post('/signup', 
[
    check('email')
.isEmail()
.withMessage('Please enter a valid Email!')
.custom((value, {req})=>{
    // if(value === 'test@test.com'){
    //     throw new Error('This is not a valid email')
    // }
    // return true;
    return User.findOne({ email: value })
    .then(userDoc => {
      if (userDoc) {
        return Promise.reject('An account with requested email already exist!');
      }
    })
}),
body('password','Please enter a valid (6-15) Password')
.isLength({min:5 , max: 15}),
body('confirmPassword').custom((value,{req})=>{
    if(value !== req.body.password){
        throw new Error('Passwords should match');
    }
    return true;
})
]
,authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;