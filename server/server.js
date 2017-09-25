const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=> {
        res.send(doc);
    }, (err)=>{
        res.status(400).send(err);
    });
    
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {    
        res.send({todos});   
    }, (err) => {
        res.status(400).send(err);
    });
});


app.get('/todos/:id', (req, res) =>{
    var id = req.params.id;
    if( id === undefined || id === null){
        return res.status(400).send('id is required.');
    }

    if(!ObjectId.isValid(id)){
        return res.status(400).send('Invalid id provided');
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
           return res.status(404).send();
        }
        res.status(200).send(todo);

    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started app on port 3000');
})

module.exports = {app};