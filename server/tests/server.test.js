const request = require('supertest');
const expect = require('chai').expect;

const app = require('./../server.js').app;
const {Todo} = require('./../models/todo.js');

const todos = [
	{text: 'First test todo'},
	{text: 'Second text todo'}
];
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new to do', (done) => {
		var text = 'Test doto text';
		
		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res)=>{
				expect(res.body.text).to.equal(text);
			})
		.end((error, response) =>{
			if (error)
				return done(error);
			
			Todo.find().then((todos) =>{
				expect(todos.length).to.equal(3);
				expect(todos[2].text).to.equal(text);
				done();
			}).catch((error) => done(error));
		})
	});
		
	it('should_not_create_todo_with_invalid_data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			
		.end((error, response) =>{
			if (error)
				return done(error);
			
			Todo.find().then((todos) =>{
				expect(todos.length).to.equal(2);
				done();
			}).catch((error) => done(error));
		})
	});
	
	it('should_get_the_list_of_all_users', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((response) => {
				expect(response.body.todos.length).to.equal(2);
			})
			.end(done);

	});

});