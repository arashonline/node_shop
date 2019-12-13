// handles admin request

const express = require('express');
const path = require('path')


// this router is like a mini express which we can export
const router = express.Router();


const productsController = require('../controllers/products');

// now we use the router to register things
// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product',productsController.postAddProduct)

router.get('/products',productsController.getProductList)

module.exports = router;
