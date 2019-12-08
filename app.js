const port = 8020;

// const http = require('http');
// we don't need http any more the express app.listen(port) does the necessary things for us

// adding express framework to project

const express = require('express');

// creating an express app

const app = express();

// we can use some middleware 
// most simple way is to use a function 
// req =>
// res =>
// next => allows the request to go to the next middleware
app.use('/add-product',(req, res, next)=>{
    // use this one before because of the way middleware works
    res.send(`<h1>The "add product" page</h1>`)
});
app.use('/',(req, res, next)=>{
    // now that we don't have any more middleware then we can send a response
    // send allows us to send a response 
    // also we can attach a body
    res.send(`<h1>Hello</h1>`)
});

// app is also a valid request handler so we can pass it to server

// const server = http.createServer(app);
// server.listen(8020);

// we can do app.listen(8020) which do both above commands for us

app.listen(port)