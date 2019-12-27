const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// we can simply add mongoose to our project
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');

const User = require('./models/user');
const MONGODB_URI = 'mongodb://localhost:27017/nodeShop';
const app = express();
// we pass some options to the constructor 
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
// initialize a csrf protection
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'fklasdjflkasdhflaskdflkasdjflaskdjf',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrfProtection);


// // adding a new middleware to always having access to user
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
        User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err) });
})
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.get404);


// we can connect using mongoose
mongoose.connect(MONGODB_URI)
    .then(result => {
        // User.findOne().then(user => {
        //     if (!user) {
        //         // creating a user using mongoose
        //         const user = new User({
        //             name: "Arash",
        //             email: "a@arash.co",
        //             cart: {
        //                 items: []
        //             }
        //         })
        //         user.save();
        //     }
        // })

        app.listen(8021);
    })
    .catch(err => { console.log });