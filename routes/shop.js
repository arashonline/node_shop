// handles shop (front requests)

// handling paths
const path = require('path')

const express = require('express');

// this router is like a mini express which we can export
const router = express.Router();

const rootDir = require('../util/path')
const adminData = require('./admin');

// now we use the router to register things
router.get('/',(req, res, next)=>{
    console.log(adminData.products)
    res.sendFile(path.join(rootDir,'views','shop.html'))
});

module.exports = router;
