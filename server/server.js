
require('./config/config.js');

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb'); 
var _ = require('lodash');

var {authenticate} = require('./middleware/authenticate.js');
var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
	//console.log(request.body);
	var todo = new Todo({
		text: request.body.text
	});
	todo.save()
		.then((result) => {
			response.status(200).send(result);
		})
		.catch((error) => {
			response.status(400).send(error);
		});

});

app.get('/todos', (request, response) => {
	Todo.find()
		.then((todos) => {
			response.status(200).send({
				todos
			});
		})
		.catch((error) => {
			response.status(400).send(error);
		});
});

/** GET a TODO by ID : 
 *  /todos/12345 
 * 1. Validate ID
 * 	a. if invalid, send 404, empty body
 * 2. findByID
 * 	a. Success
 * 		- if noTodo, send 400, empty body
 * 		- else, send the todo, 200
 *  b. error
 * 		- send 400, empty body
 */
app.get('/todos/:id', (request, response) => {
	//response.send(request.params);
	let id = request.params.id;
	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}
	Todo.findById(id)
		.then((todo) => {
			if (!todo) {
				return response.status(404).send();
			}
			response.status(200).send({ todo });
		})
		.catch((error) => {
			response.status(400).send();
		});
});

app.delete('/todos/:id', (request, response) => {
	let id = request.params.id;
	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}
	Todo.findByIdAndRemove(id)
		.then((todo) => {
			if (!todo) {
				return response.status(404).send();
			} 
			response.status(200).send({ todo });
		})
		.catch((error) => {
			response.status(400).send();
		});
});

app.patch('/todos/:id', (request, response) => {
	let id = request.params.id;
	let todoBody = _.pick(request.body, ['text', 'completed']);
	if (!ObjectID.isValid(id)) {
		return response.status(404).send();
	}
	//if set completed true -> update the completedAt
	if (_.isBoolean(todoBody.completed) && todoBody.completed) {
		todoBody.completedAt = new Date().getTime();
	} else {
		todoBody.completed = false;
		todoBody.completedAt = null;
	}
	Todo.findByIdAndUpdate(id, {$set: todoBody}, {new: true})
		.then((todo)=> {
			if(!todo){
				return response.status(404).send();
			}
			return response.status(200).send({todo});
		})
		.catch((error)=>{
			return response.status(400).send();
		});
});

// POST /users ->create new user 
app.post('/users', (request, response) => {
	let userBody = _.pick(request.body, ['email', 'password']);
	let newUser = new User(userBody);
	newUser.save()
		.then((user) => {
			return user.generateAuthTokens()
				.then((token) => {
					return response.status(200)
						//.header('x-auth', user.tokens[0].token)
						.header('x-auth', token)
						.send(user);
				})
		})
		.catch((error) => {
			return response.status(400).send(error.message);
		});
});


/**
 * Private Route
 */
app.get('/users/me', authenticate, (request, response) => {
	 response.status(200).send(request.user);
});


app.listen(port, () => {
	console.log(`Express Server started listening on port ${port}`);
});

module.exports = {
	app
};