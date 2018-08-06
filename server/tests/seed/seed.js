const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

let userOneId = new ObjectID();
let userTwoId = new ObjectID();
var users = [
    {
        _id: userOneId,
        email: 'stefan@yahoo.com',
        password: 'unserOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'jen@example.com',
        password: 'userTwoPass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
        }]
    }
];

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save();
            let userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo]);
            //return User.insertMany(users);
        })
        .then(() => done());
};

var todos = [
    {   
        _id: new ObjectID(), 
        text: 'First test todo',
        _creator: userOneId
    },
	{ 
        _id: new ObjectID(), 
        text: 'Second text todo', 
        completed: true, 
        completedAt: 333,
        _creator: userTwoId
    }
];

const populateTodos = (done) =>{
    Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};


module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};