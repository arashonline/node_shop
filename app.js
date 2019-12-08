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



app.listen(port)