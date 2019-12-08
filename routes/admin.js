// handles admin request

const express = require('express');


// this router is like a mini express which we can export
const router = express.Router();

// now we use the router to register things
// /admin/add-product => GET
router.get('/add-product',(req, res, next)=>{
    res.send(`
    <form method="POST" action="/admin/add-product">
    <input type="text" name="product_name">
    <button type="submit">ADD</button>
    </form>`)
});
// /admin/add-product => POST
router.post('/add-product',(req,res)=>{
    console.log(req.body);
    
    res.redirect('/')

})

module.exports = router;