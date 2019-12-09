const port = 8020;

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path')

app.use(bodyParser.urlencoded({extended:false}))
// serve file statically 
// grant read access to public folder
app.use(express.static(path.join(rootDir,'public')))

// admin routes is a middleware
// add a segment as filter for all routes
app.use('/admin',adminData.routes);
app.use(shopRoutes);

// handling 404 
app.use((req,res,next)=>{
    // chaining status to send
    res.status(404).sendFile(path.join(rootDir,'views','404.html'))
})

app.listen(port)