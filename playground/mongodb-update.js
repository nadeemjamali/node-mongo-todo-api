const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDb server.', err);
        
    }
    console.log('Successfully connected to MongoDb');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectId('59c50e1e0f58e3236f630616')
    // }, {
    //     $set:{
    //         text: 'walk the dog in evening',
    //         completed: false
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log('Updated: ', result);
    // }, (err) => {
    //     console.log('Updated faild. ', err);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectId('59c330387588760fc9e0ad91')
    }, {
        $set:{
            text: 'walk the dog in evening',
            Name: 'Naveed Ali Jamali'            
        },
        $inc:{
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log('Updated: ', result);
    }, (err) => {
        console.log('Updated faild. ', err);
    });

    db.close();
});