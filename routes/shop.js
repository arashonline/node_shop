// handles shop (front requests)

// handling paths
const path = require('path')

const express = require('express');

// this router is like a mini express which we can export
const router = express.Router();

const productsController = require('../controllers/products');

// now we use the router to register things
router.get('/',productsController.getProducts);

module.exports = router;
