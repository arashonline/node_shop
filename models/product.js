const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    // title: String,
    title:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
});


// mongoose also works with models
// you have to provide the name of the model and Schema 
module.exports = mongoose.model('Products',productSchema);
