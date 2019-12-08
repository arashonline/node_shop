const port = 8020;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended:false}))

// admin routes is a middleware
app.use(adminRoutes);
app.use(shopRoutes);

// handling 404 
app.use((req,res,next)=>{
    // chaining status to send
    res.status(404).send(`<h1>Page you'r looking not found</h1>`)
})

app.listen(port)