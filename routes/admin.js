const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { check, body } = require('express-validator/check');

const router = express.Router();

// we could add as many handler we want
// they run from left to right
router.get('/add-product', isAuth, adminController.getAddProduct); 

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product',[
    body('title')
    .isString()
    .isLength({min:3 })
    .trim(),
    body('imageUrl')
    .isURL(),
    body('price')
    .isFloat(),
    body('description')
    .isLength({min:5, max: 255 })
    .trim()    
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',[
    body('title')
    .isString()
    .isLength({min:3 })
    .trim(),
    body('imageUrl')
    .isURL(),
    body('price')
    .isFloat(),
    body('description')
    .isLength({min:5, max: 255 })
    .trim()    
], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
