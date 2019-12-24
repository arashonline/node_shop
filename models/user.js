const getDb = require('../util/database').getDb;
const objectId = require('../util/database').objectId;

class User {
  constructor(username, email){
    this.name = username;
    this.email = email;
  }

  save(){
    const db = getDb();
    
    return db.collection('users').insertOne(this);
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