const supertest = require('supertest');
const expect = require('chai').expect;
const {ObjectID} = require('mongodb');

const app = require('./../server.js').app;
const {Todo} = require('./../models/todo.js');

var todos = [
	{ _id: new ObjectID(), text: 'First test todo'},
	{ _id: new ObjectID(), text: 'Second text todo'}
];
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new to do', (done) => {
		var text = 'Test doto text';

		supertest(app)
			.post('/todos')
			.send({
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).to.equal(text);
			})
			.end((error, response) => {
				if (error)
					return done(error);

				Todo.find()
					.then((todos) => {
						expect(todos.length).to.equal(3);
						expect(todos[2].text).to.equal(text);
						done();
					})
					.catch((error) => done(error));
			})
	});

	it('should_not_create_todo_with_invalid_data', (done) => {
		supertest(app)
			.post('/todos')
			.send({})
			.expect(400)

			.end((error, response) => {
				if (error)
					return done(error);

				Todo.find().then((todos) => {
					expect(todos.length).to.equal(2);
					done();
				}).catch((error) => done(error));
			})
	});

	it('should_get_the_list_of_all_users', (done) => {
		supertest(app)
			.get('/todos')
			.expect(200)
			.expect((response) => {
				expect(response.body.todos.length).to.equal(2);
			})
			.end(done);

	});
	describe('GET /todos/id', () => {
		it('should_return_valid_todo_for_valid_id', (done) => {
			console.log(`/todos/${todos[0]._id.toHexString()}`);
			supertest(app)
				.get(`/todos/${todos[0]._id}`)
				.expect(200)
				.expect((response) => {
					expect(response.body.todo.text).to.equal(todos[0].text);
				})
				.end(done);
		});
		
		it('should_return_404_if_todo_not_found', (done) => {
			let newId = new ObjectID();
			supertest(app)
				.get(`/todos/${newId.toHexString()}`)
				.expect(404)
				.end(done);
		});
	
		it('should_return_404_if_id_is_invalid', (done) => {
			supertest(app)
				.get(`/todos/123abc`)
				.expect(404)
				.end(done);
		});
	
	
	});

});


describe('DELETE /todos/id', ()=>{
	it('should_delete_todo_by_id', (done) => {
		let hexId = todos[0]._id.toHexString();
		supertest(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((response) =>{
				expect(response.body.todo.text).to.equal(todos[0].text);
				expect(response.body.todo._id).to.equal(hexId);
			})
			.end((err, res) => {
				if(err)
					return done(err);
				Todo.findById(hexId)
					.then((todo) => {
						expect(todo).to.be.null;
						done();
					})
					.catch((error) => done(error));	
			});
	});

	it('should_return_404_if_invalidID_passed', (done) => {
		supertest(app)
			.delete('/todos/123abc')
			.expect(404)
			.end(done);
	});

	it('should_return_404_if_todo_not_found', (done) => {
		let newId = new ObjectID();
		supertest(app)
			.delete(`/todos/${newId.toHexString()}`)
			.expect(404)
			.end(done);
	});
});