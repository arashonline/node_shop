const express = require('express');

const authController = require('../controllers/auth');
// const expValidator = require('express-validator/check');
const { check } = require('express-validator/check');

const router = express.Router();


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', check('email')
.isEmail()
.withMessage('Please enter a valid Email!')
.custom((value, {req})=>{
    if(value === 'test@test.com'){
        throw new Error('This is not a valid email')
    }
    return true;
})
,authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;