const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    cart:{
        // items will be an array
        // defining an embedded record
        // we can define what kind of array it is
        // in this case it is an array of documents 
        items: [{
            productId:{
                type: Schema.Types.ObjectId,
                ref: 'Product',
                // required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        }]
    }
});

module.exports = mongoose.model('User',userSchema);