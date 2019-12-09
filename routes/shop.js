// handles shop (front requests)

// handling paths
const path = require('path')

const express = require('express');

// this router is like a mini express which we can export
const router = express.Router();

const rootDir = require('../util/path')
const adminData = require('./admin');

// now we use the router to register things
router.get('/', (req, res, next) => {

    const products = adminData.products

    res.render('shop', { prods: products, 
        pageTitle: "SHOP",
     path: '/',
      hasProducts: products.length > 0,
       productCss: true,
        activeShop: true
     })
});

module.exports = router;
