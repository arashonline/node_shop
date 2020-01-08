const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// we can simply add mongoose to our project
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');

const errorController = require('./controllers/error');

const User = require('./models/user');

const MONGODB_URI = `mongodb://${process.env.MONGODB_URI}/${process.env.DATABASE}`;
const ImageFolder = 'public/images';
const app = express();



// we pass some options to the constructor 
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
// initialize a csrf protection
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, ImageFolder);
    },
    filename: (req, file, cb) => {
        // console.log(new Date())
        // console.log(new Date().toTimeString())
        const prefix = Math.random();
    //   cb(null, new Date().toISOString()+ '-' + file.originalname);
      cb(null, prefix + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(helmet());
app.use(compression());

const { validationResult } = require('express-validator/check')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer(
    {
    // dest:'public/images' // to set destination of file
    storage: fileStorage,
    fileFilter: fileFilter
}
).single('image'));

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
    // console.log(path.join(__dirname, ImageFolder));
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
   console.log(error);
    res.status(500).render(
        '500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken:req.csrfToken()
      });
})

// we can connect using mongoose
mongoose.connect(MONGODB_URI,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(result => {
        app.listen(process.env.PORT || 8021);
    })
    .catch(err => { console.log(err) });