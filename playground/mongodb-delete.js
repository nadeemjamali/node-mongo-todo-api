const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDb server.', err);
        
    }
    console.log('Successfully connected to MongoDb');

    // var initialCount = -1;

    // db.collection('Todos').find().count().then((count) => {
    //     initialCount = count;
    //     console.log(`Todos: ${count}`);        
    // },(err) => {
    //     console.log('Unable to fetch the count of todos. ', err);
    // });

    // db.collection('Todos').deleteMany({
    //     text: 'Some important task' 
    // }).then((result) => {
    //     console.log(result);        
    // },(err) => {
    //     console.log('Unable to delete todos. ', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos: ${count}`);   
    //     console.log(`Deleted: ${initialCount - count}`); 
    // },(err) => {
    //     console.log('Unable to fetch the count of todos. ', err);
    // });

    db.collection('Todos').findOneAndDelete({"text" : "Walk the dog",
    "completed" : true}).then((result) => {
            console.log(result);   
    },(err) => {
        console.log('Error in deleting: ', err);
    });

    db.close();
});