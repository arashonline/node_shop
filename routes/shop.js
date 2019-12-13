// handles shop (front requests)

// handling paths
const path = require('path')

const express = require('express');

// this router is like a mini express which we can export
const router = express.Router();

const productsController = require('../controllers/products');
const pageController = require('../controllers/page');

// now we use the router to register things
router.get('/',pageController.home);
router.get('/products',productsController.getProducts);
router.get('/cart',productsController.getCart);
router.get('/checkout',productsController.getCheckout);

module.exports = router;
