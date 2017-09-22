const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDb server.', err);
        
    }
    console.log('Successfully connected to MongoDb');

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos: ${count}`);        
    },(err) => {
        console.log('Unable to fetch the count of todos. ', err);
    });

    db.collection('Todos').find({
        _id: new ObjectId('59c4fca20f58e3236f630603')
    }).toArray().then((docs) => {
        console.log('Todos:');
        console.log(JSON.stringify(docs, undefined, 2));
    },(err) => {
        console.log('Unable to fetch todos. ', err);
    });

    db.close();
});