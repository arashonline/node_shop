const port = 8020;

const express = require('express');


const app = express();

app.use('/add-product',(req, res, next)=>{
    res.send(`<h1>The "add product" page</h1>`)
});
app.use('/',(req, res, next)=>{
    res.send(`<h1>Hello</h1>`)
});

app.listen(port)