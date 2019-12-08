const port = 8020;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// adding a parser middleware
// adding {extended:false}
app.use(bodyParser.urlencoded({extended:false}))

app.use('/add-product',(req, res, next)=>{
    res.send(`
    <form method="POST" action="/product">
    <input type="text" name="product_name">
    <button type="submit">ADD</button>
    </form>`)
});
// you can omit next (or other argument) which you are not going to use
// using app.get to filter incoming gets
// using app.post to filter incoming posts
app.post('/product',(req,res)=>{
    console.log(req.body)

    // to redirect
    res.redirect('/')

})

app.use('/',(req, res, next)=>{
    res.send(`<h1>Hello</h1>`)
});

app.listen(port)