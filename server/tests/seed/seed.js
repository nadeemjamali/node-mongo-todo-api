const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const userThreeId = new ObjectId();
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
},
{
    _id: userThreeId,
    email: 'user.three@example.com',
    password: 'userThreePass',
    tokens: [
        { access: 'auth',
        token: jwt.sign({_id: userThreeId,access:'auth'},'abc123').toString()
    }
    ]
},];

const testTodosData = [{
    _id: new ObjectId(),
    text: "First dummy todo",
    _creator: userOneId

},
{
    _id: new ObjectId(),
    text: "second dummy todo",
    completed: true,
    completedAt: 12345,
    _creator: userTwoId
},{
    _id: new ObjectId(),
    text: "third dummy todo",        
    _creator: userThreeId
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        var userThree = new User(users[2]).save();

        //wait for all promises to be executed
        return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(testTodosData);
    }).then(() => {        
        done();
    }, (err) => {
        console.log('Error in adding test data: ', err);
        done(err);
    });
};


module.exports = {testTodosData, populateTodos, users, populateUsers};