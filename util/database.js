const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback)=>{
    MongoClient.connect('mongodb://localhost:27017/nodeShop')
    .then(client =>{
        console.log('Connected!');
        callback(client);
    })
    .catch(err=>{
        console.log(err);
    });
};

module.exports = mongoConnect;