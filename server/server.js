require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

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
        res.status(200).send({todo});

    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if( id === undefined || id === null){
        return res.status(400).send('id is required.');
    }

    if(!ObjectId.isValid(id)){
        return res.status(400).send('Invalid id provided');
    }
    
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
           return res.status(404).send();
        }
        res.status(200).send({todo});

    }).catch((e) => {
        res.status(400).send(e);
    });
});


app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    if( id === undefined || id === null){
        return res.status(400).send('id is required.');
    }

    if(!ObjectId.isValid(id)){
        return res.status(400).send('Invalid id provided');
    }

    var body = _.pick(req.body, ['text', 'completed']);
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => {
        if(!todo)
            {
            return    res.status(404).send();
            }

            res.send({todo});

    }).catch((e) => {
        res.status(400).send(e);
    });
});


app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);

});

app.post('/users', (req, res) => {
    
    var user = new User(_.pick(req.body,['email', 'password']));
    
    user.save().then((doc)=> {
        return user.generateAuthToken();        
        //res.status(200).send(doc);
    }, (err)=>{
        res.status(400).send(err);
    }).then((token) => {

        res.status(200).header('x-auth',token).send(user);
    });    
    
});



app.listen(port, () => {
    console.log(`Started app on port ${port}`);
});



module.exports = {app};