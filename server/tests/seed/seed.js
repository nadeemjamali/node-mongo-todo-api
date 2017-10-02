const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'user.one@example.com',
    password: 'userOnePass',
    tokens: [
        { access: 'auth',
        token: jwt.sign({_id: userOneId,access:'auth'},'abc123').toString()
    }
    ]
}, {
    _id: userTwoId,
    email: 'user.two@example.com',
    password: 'userTwoPass'
}];

const testTodosData = [{
    _id: new ObjectID(),
    text: "First dummy todo"
},
{
    _id: new ObjectID(),
    text: "second dummy todo",
    completed: true,
    completedAt: 12345
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(testTodosData);
    }).then(() => {        
        done();
    }, (err) => {
        console.log('Error in adding test data: ', err);
        done();
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        //wait for all promises to be executed
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {testTodosData, populateTodos, users, populateUsers};