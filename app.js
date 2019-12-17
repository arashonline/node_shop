const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// adding a new middleware to always having access to user
app.use((req,res,next)=>{
    User.findOne({
        where:{id:1}
    })
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>{console.log(err)});
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// defining associations (Relations)

Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'});
User.hasMany(Product)

// sync method looks at all models
// It syncs models to the database
sequelize
// .sync({force:true})
.sync()
.then(result =>{
   return User.findOne({
       where:{id:1}
   })
})
.then(user =>{
    if(!user){
        return User.create({
            name:"Arash",
            email:"arash.rabiee.88@gmail.com",
            username:"Arash",
            lastName:"Rabiee",
            imageUrl:"test.img",
        });
    }
    return Promise.resolve(user);

})
.then(user=>{
    console.log(user);
    app.listen(8020);
})
.catch(err=>{
    console.log(err);
});

