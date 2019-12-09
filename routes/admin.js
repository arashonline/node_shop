// handles admin request

const express = require('express');
const path = require('path')


// this router is like a mini express which we can export
const router = express.Router();

const rootDir = require('../util/path')

const products = [];


// now we use the router to register things
// /admin/add-product => GET
router.get('/add-product',(req, res, next)=>{
    res.sendFile(path.join(rootDir,'views','add-product.html'))
});
// /admin/add-product => POST
router.post('/add-product',(req,res)=>{
    console.log(req.body);
    products.push({title: req.body.title})
    
    res.redirect('/')

})

// module.exports = router;
exports.routes = router;
exports.products = products;