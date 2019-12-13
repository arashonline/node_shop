// handles shop (front requests)

// handling paths
const path = require('path')

const express = require('express');

// this router is like a mini express which we can export
const router = express.Router();

const shopController = require('../controllers/shop');
const pageController = require('../controllers/page');

// now we use the router to register things
router.get('/',pageController.index);
router.get('/products',shopController.getProducts);
router.get('/cart',shopController.getCart);
router.get('/orders',shopController.getOrders);
router.get('/checkout',shopController.getCheckout);

module.exports = router;
