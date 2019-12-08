const http = require('http');

// adding express framework to project

const express = require('express');

// creating an express app

const app = express();

// we can use some middleware 
// most simple way is to use a function 
// req =>
// res =>
// next => allows the request to go to the next middleware
app.use((req, res, next)=>{
    console.log('in The middleware')
    next();
});
app.use((req, res, next)=>{
    console.log('In The Second Middleware')
});

// app is also a valid request handler so we can pass it to server

const server = http.createServer(app);
server.listen(8020);