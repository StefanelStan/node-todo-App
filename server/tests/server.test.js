const request = require('supertest');
const expect = require('chai').expect;

const app = require('./../server.js').app;
const {Todo} = require('./../models/todo.js');

beforeEach((done) => {
	Todo.remove({}).then(() => done());
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
				expect(todos.length).to.equal(1);
				expect(todos[0].text).to.equal(text);
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
				expect(todos.length).to.equal(0);
				done();
			}).catch((error) => done(error));
	})
		
		
	});
	
});