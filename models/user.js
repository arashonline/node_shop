const getDb = require('../util/database').getDb;
const objectId = require('../util/database').objectId;

class User {
  constructor(username, email, cart,id){
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save(){
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product){
    // const cartProduct = this.cart.items.findIndex(cp =>{
    //   return cp._id === product._id;
    // });
    // product.quantity = 1;
    const updatedCart = {items: [{...product,quantity:1}]};
    const db = getDb();
    return db.collection('users').updateOne({_id: new objectId(this._id)},
    {$set: {
      // only updating cart
      cart: updatedCart
    }})
  }

  static findById(userId){
    const db = getDb();
    // when using findOne there is no need to use next
    return db.collection('users')
      .findOne({ _id:new  objectId(userId) })
      .then(user=>{
        console.log(user)
        return user
      }
      )
      .catch(err => {console.log(err)});   
  }
}

module.exports = User;