var express = require('express');
var bodyParser = require('body-parser');

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

app.listen(3000, () => {
	console.log('Express Server started listening on port 3000');
});

module.exports = {
	app
};