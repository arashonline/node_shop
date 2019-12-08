// handles admin request

const express = require('express');


// this router is like a mini express which we can export
const router = express.Router();

// now we use the router to register things
router.get('/add-product',(req, res, next)=>{
    res.send(`
    <form method="POST" action="/product">
    <input type="text" name="product_name">
    <button type="submit">ADD</button>
    </form>`)
});

router.post('/product',(req,res)=>{
    console.log(req.body);
    
    res.redirect('/')

})

module.exports = router;