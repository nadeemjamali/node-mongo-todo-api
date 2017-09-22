const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDb server.', err);
        
    }
    console.log('Successfully connected to MongoDb');

    // db.collection('Todos').insertOne({
    //     text: 'Some important task',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert the document.', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Nadeem Jamali',
        age: 34,
        location: 'Pakistan'
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert the document.', err);
        }

        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    });

    db.close();
});