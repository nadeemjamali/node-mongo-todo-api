const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDb server.', err);
        
    }
    console.log('Successfully connected to MongoDb');

    db.collection('Users').find({
        name: 'Naveed'
    }).count().then((count) => {
        console.log(`Users: ${count}`);        
    },(err) => {
        console.log('Unable to fetch the count of users. ', err);
    });

    

    db.close();
});