const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
ObjectID = require('mongodb').ObjectID

// to have one connection which is possible to connect from all over of our application 
// we use _db 
let _db;

const mongoConnect = (callback)=>{
    MongoClient.connect('mongodb://localhost:27017/nodeShop',{useUnifiedTopology: true})
    .then(client =>{
        console.log('Connected!');
        // nodeShop below overwrite the db_name we used above 
        // don't need to create db before hand, it will created on the fly
        _db = client.db('nodeShop');
        callback(client);
    })
    .catch(err=>{
        console.log(err);
        throw err;
    });
};

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found!';
}


// for connecting to the database
exports.mongoConnect = mongoConnect;
// for using the connection
exports.getDb = getDb;
exports.objectId = ObjectID;