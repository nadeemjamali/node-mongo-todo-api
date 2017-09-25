const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

// var id = '59c8d10fa8e4e15849d3f6de';

// if(!ObjectId.isValid(id)){
//     return console.log('Error: Invalid id...');
// }

const testTodosData = [{
    _id: new ObjectID(),
    text: "First dummy todo"
},
{
    _id: new ObjectID(),
    text: "second dummy todo"
},
{
    _id: new ObjectID(),
    text: "third dummy todo"
},
{
    _id: new ObjectID(),
    text: "fourth dummy todo"
}];

var insertDummy = () => {
Todo.insertMany(testTodosData).then((res) => {
    console.log('inserted many:');
    return console.log(JSON.stringify(res, undefined, 2));
    
});};

insertDummy();

Todo.findOneAndRemove({
    text : testTodosData[0].text}).then((todo) => {
    console.log('Removed: ', todo);
}, (err) => {
    console.log('Error in removing todo: ', err);
});

Todo.findByIdAndRemove(testTodosData[1]._id.toHexString()).then(
    (todo) => {
        console.log('Removed by Id: ', todo);
    }, (err) => {
        console.log('Error in removing by id: ', err);
    }
);

Todo.remove().then((result) => {
    console.log('Removed all: ', result);
}, (err) => {
    console.log('Error in removing all: ', err);
});