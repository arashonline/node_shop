const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;
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
        req.user = user;
        console.log(user);
        next();
    })
    .catch(err=>{console.log(err)});
})

app.use('/admin', adminRoutes);
app.use(shopRoutes); 

app.use(errorController.get404);
// mongodb 

mongoConnect(() => {
    
    app.listen(8021);
})