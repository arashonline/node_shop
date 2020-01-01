const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// we can simply add mongoose to our project
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

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

const { validationResult } = require('express-validator/check')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'fklasdjflkasdhflaskdflkasdjflaskdjf',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrfProtection);
// flash should be initialized after session
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    
    let errorMessage = req.flash('error');
    let successMessage = req.flash('success');
    
    if (errorMessage.length > 0) {
        res.locals.errorMessage = errorMessage
    } else {
        res.locals.errorMessage = null;
    }
    if (successMessage.length > 0) {
        res.locals.successMessage = successMessage
    } else {
        res.locals.successMessage = null;
    }
    
        res.locals.errorMessageSystem = [];
    
        res.locals.errorMessageValidator = [];
    
    next()
})

// // adding a new middleware to always having access to user
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user){
                return next()
            }
            req.user = user;
            next();
        })
        .catch(err => { 
            // throw new Error(err)
            next(new Error(err));
         });
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(authRoutes);

app.get('/500', errorController.get500)

app.use(errorController.get404);

app.use((error,req, res, next)=>{
    // res.redirect('/500')
    res.status(500).render(
        '500', {
        pageTitle: 'Error!',
        path: '/500'
      });
})


// we can connect using mongoose
mongoose.connect(MONGODB_URI,{ useNewUrlParser: true,useUnifiedTopology: true })
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