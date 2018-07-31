var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb'); 

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');

var app = express();

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
				return response.send(404).send();
			} else {
				response.status(200).send({todo});
			}
		})
		.catch((error) => {
			response.status(400).send();
		});
});


app.listen(3000, () => {
	console.log('Express Server started listening on port 3000');
});

module.exports = {
	app
};