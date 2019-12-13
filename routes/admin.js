// handles admin request

const express = require('express');


// this router is like a mini express which we can export
const router = express.Router();


const adminController = require('../controllers/admin');

// now we use the router to register things
// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product',adminController.postAddProduct)

router.get('/products',adminController.getProductList)

module.exports = router;
