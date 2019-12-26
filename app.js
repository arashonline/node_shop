const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// we can simply add mongoose to our project
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// adding a new middleware to always having access to user
app.use((req, res, next) => {
    User.findById("00d0fa000d0f0fa0df123120")
    .then(user=>{
        req.user = new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(err=>{console.log(err)});
})

app.use('/admin', adminRoutes);
app.use(shopRoutes); 

app.use(errorController.get404);
// mongodb 

// mongoConnect(() => {
    
//     app.listen(8021);
// })

// we can connect using mongoose
mongoose.connect('mongodb://localhost:27017/nodeShop')
.then(result =>{
    app.listen(8021);
})
.catch(err => {console.log});