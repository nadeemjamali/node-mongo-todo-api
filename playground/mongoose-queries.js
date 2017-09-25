const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '59c8d10fa8e4e15849d3f6de1';

if(!ObjectId.isValid(id)){
    return console.log('Error: Invalid id...');
}

Todo.find({
    _id : id
    }).then((todos) => {
        if(todos.length){
         return console.log('todo not found.');
        }
        console.log('Todos: ', todos);

    }, (err) =>{
        console.log(err);
    });

Todo.findOne({
    _id: id
    }).then((todo) => {
        if(!todo){
            return console.log('todo not found.');
           }
        console.log('Todo: ', todo);
    }, (err) => {
        console.log(err);
    });

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('todo not found.');
       }
        console.log('Todo: ', todo);
    }, (err) => {
        console.log(err);
    });