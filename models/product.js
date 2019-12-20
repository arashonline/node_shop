const getDb = require('../util/database').getDb;
const objectId = require('../util/database').objectId;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    // insertOne get an object to insert to db
    return db.collection('products').insertOne(this)
      .then(result =>{
        console.log(result);
      })
      .catch(err => { console.log(err) })
  }

  static fetchAll(){
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products =>{
      console.log(products);
      return products;
    })
    .catch(err => {console.log(err)});
  }

  static fetchOne(prodId){
    const db = getDb();
    return db.collection('products')
    .find({_id:  objectId(prodId)})
    .toArray()
    .then(products =>{
      console.log(prodId);
      console.log(products);
      return products[0];
      
    }
    ).catch(err=>{console.log(err)})
  }

  static findById(prodId){
    const db = getDb();
    return db.collection('products')
    .find({_id: objectId(prodId)})
    .next()
    .then(product =>{
      console.log(product);
      return product;
      
    }
    ).catch(err=>{console.log(err)})
  }
}


module.exports = Product;
