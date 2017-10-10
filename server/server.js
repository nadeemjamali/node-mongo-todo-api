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

app.post('/todos', authenticate, async (req, res) => {
    
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    try{
        const doc = await todo.save();
        res.send(doc);
    }catch(e){
        res.status(400).send(e);
    }

    // todo.save().then((doc)=> {
    //     res.send(doc);
    // }, (err)=>{
    //     res.status(400).send(err);
    // });
    
});

app.get('/todos', authenticate, async (req, res) => {
    try{
        const todos = await Todo.find({
            _creator: req.user._id
        });
        res.send({todos});  

    }catch(e){
        res.status(400).send(e);
    }

    // Todo.find({
    //     _creator: req.user._id
    // }).then((todos) => {    
    //     res.send({todos});   
    // }, (err) => {
    //     res.status(400).send(err);
    // });
});


app.get('/todos/:id', authenticate, async (req, res) =>{
    var id = req.params.id;
    if( id === undefined || id === null){
        return res.status(400).send('id is required.');
    }

    if(!ObjectId.isValid(id)){
        return res.status(400).send('Invalid id provided');
    }

    try{
        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        if(!todo){
            return res.status(404).send();
         }
         res.status(200).send({todo});         
    }catch(e){
        res.status(400).send(e);
    }

    // Todo.findOne({
    //     _id: id,
    //     _creator: req.user._id
    // }).then((todo) => {
    //     if(!todo){
    //        return res.status(404).send();
    //     }
    //     res.status(200).send({todo});

    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    if( id === undefined || id === null){
        return res.status(400).send('id is required.');
    }

    if(!ObjectId.isValid(id)){
        return res.status(400).send('Invalid id provided');
    }
    
    try{
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
    
        });
        if(!todo){
            return res.status(404).send();
         }
         res.status(200).send({todo});
    }
    catch(e){
        res.status(400).send(e);
    }

    // Todo.findOneAndRemove({
    //     _id: id,
    //     _creator: req.user._id

    // }).then((todo) => {
    //     if(!todo){
    //        return res.status(404).send();
    //     }
    //     res.status(200).send({todo});

    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});


app.patch('/todos/:id', authenticate, async (req, res) => {
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

    try{
        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {$set:body}, {new: true});

        if(!todo)
        {
            return res.status(404).send();
        }
        res.send({todo});
    }catch(e){
        res.status(400).send(e);
    }

    // Todo.findOneAndUpdate({
    //     _id: id,
    //     _creator: req.user._id
    // }, {$set:body}, {new: true}).then((todo) => {
    //     if(!todo)
    //         {
    //         return    res.status(404).send();
    //         }

    //         res.send({todo});

    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});


app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);

});

app.delete('/users/me/token', authenticate, async (req, res)=>{

    try{
        await req.user.removeToken(req.token);
        res.status(200).send();        
    }catch(e){
        res.status(400).send();
    }

    // req.user.removeToken(req.token).then(()=>{
    //     res.status(200).send();
    // }, ()=>{
    //     res.status(400).send();
    // });
    
});

app.post('/users/login', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    try{
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.status(200).header('x-auth', token).send(user);
    }catch(e){
        res.status(400).send();
    }

    // User.findByCredentials(email, password).then((user)=>{        
    //     return user.generateAuthToken().then((token)=>{
    //         res.status(200).header('x-auth', token).send(user);
    //     });
    // }).catch((e) => {
    //     res.status(400).send();
    // });
});

app.post('/users', async (req, res) => {
    
    try{
        const user = new User(_.pick(req.body,['email', 'password']));
        await user.save();
        const token = user.generateAuthToken();
        res.status(200).header('x-auth',token).send(user);        
    }
    catch(e){
        res.status(400).send(e);
    }

    // user.save().then((doc)=> {
    //     return user.generateAuthToken();                
    // }).then((token) => {
    //     res.status(200).header('x-auth',token).send(user);
    // }).catch((err)=>{
    //     res.status(400).send(err);
    //  }); 
    
});



app.listen(port, () => {
    console.log(`Started app on port ${port}`);
});



module.exports = {app};