const supertest = require('supertest');
const expect = require('chai').expect;
const {ObjectID} = require('mongodb');

const app = require('./../server.js').app;
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH todos/:id', () => {
	it('should update the to do', (done) => {
		//grabId firstItem, update the text and completed true
		//assert 200 back and 1 custom veryfy that response has text property == text I set & completed==true and completeAt is a number 
		todos[0].text = "mock test";
		todos[0].completed = true;
		supertest(app)
			.patch(`/todos/${todos[0]._id}`)
			.send(todos[0])
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).to.equal(todos[0].text);
				expect(response.body.todo.completed).to.be.true;
				expect(response.body.todo.completedAt).to.be.a('number');
			})
			.end((err, res)=>{
				if(err)
					return done(err);
				Todo.findById(todos[0]._id)
					.then((result) => {
						expect(result.text).to.equal(todos[0].text);
						done();
					})
					.catch((error) => done(error));	
			})
	});

	it('should clear completedAt when not completed', (done)=>{
		//grab id of 2nd todo Item, update the text and set completed=false
		//assert 200 & expect response body represent those changes and completedAt is null & completed is false
		todos[1].text = 'Changed for 2nd test';
		todos[1].completed = false;
		supertest(app)
			.patch(`/todos/${todos[1]._id}`)
			.send(todos[1])
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).to.equal(todos[1].text);
				expect(response.body.todo.completed).to.be.false;
				expect(response.body.todo.completedAt).to.be.null;
			})
			.end((err, res) => {
				if(err)
					return done(err);
				Todo.findById(todos[1]._id)
					.then((result) => {
						expect(result.text).to.equal(todos[1].text);
						expect(result.completed).to.be.false;
						expect(result.completedAt).to.be.null;
						done();
					})
					.catch((err) => done(err));	
			})
	});

});

describe('User Tests Section', () => {
	describe('GET /users/me', () =>{
		it('should return user if authenticated', (done)=>{
			supertest(app)
				.get('/users/me')
				.set('x-auth', users[0].tokens[0].token)
				.expect(200)
				.expect((response) => {
					expect(response.body._id).to.equal(users[0]._id.toHexString());
					expect(response.body.email).to.equal(users[0].email);
				})
				.end(done);
		});

		it('should return 401 if not authenticated', (done) => {
			supertest(app)
				.get('/users/me')
				.expect(401)
				.expect((response) => {
					expect(response.body).to.deep.equal({});
				})
				.end(done);
		});
	});

	describe('POST /users', ()=> {
		it('should create a user', (done) => {
			let email = 'example@exam.completed';
			let password = '123abc';
			supertest(app)
				.post('/users')
				.send({email, password})
				.expect(200)
				.expect((response) => {
					expect(response.headers['x-auth']).to.exist;
					expect(response.body._id).to.exist;
					expect(response.body.email).to.equal(email)
				})
				.end((err) =>{
					if(err)
						return done(err);
					User.findOne({email})
						.then((user) => {
							expect(user).to.exist;
							expect(user.password).to.not.equal(password);
							done();
						})
						.catch((err) => done(err));	
				});
		});

		it('should return validation error if invalid request', (done) => {
			let email = 'aaa';
			let password = '123abc';
			supertest(app)
				.post('/users')
				.send({email, password})
				.expect(400)
				.end(done);
		});

		it('should not create user if email in use', (done) => {
			let password = '123abc';
			let email = users[0].email;
			supertest(app)
				.post('/users')
				.send({email, password})
				.expect(400)
				.end(done);
		});
	});

	describe(' POST /users/login', () =>{
		it('should login user and return token', (done) =>{
			//use 2nd user from db and check if db has token
			supertest(app)
				.post('/users/login')
				.send({email: users[1].email, password: users[1].password})
				.expect(200)
				.expect((result) =>{
					expect(result.body._id).to.equal(users[1]._id.toHexString());
					expect(result.body.email).to.equal(users[1].email);
					expect(result.headers['x-auth']).to.exist;
				})
				.end((err, result) =>{
					if(err)
						return done(err);
					User.findOne({email: users[1].email})
						.then((user) =>{
							expect(user.tokens).to.not.be.empty;
							expect(user.tokens[0]).to.include({
								access: 'auth',
								token: result.headers['x-auth']
							});
							done();
						})
						.catch((error) => done(error));	
				});
		});

		it('should reject invalid login', (done) =>{
			supertest(app)
				.post('/users/login')
				.send({email: users[1].email, password: 'abcde'})
				.expect(401)
				.expect((result) =>{
					expect(result.headers['x-auth']).to.not.exist;
				})
				.end((err, result) =>{
					if(err)
						return done(err);
					User.findOne({email: users[1].email})
						.then((user) =>{
							expect(user.tokens).to.be.empty;
							done();
						})
						.catch((error) => done(error));	
				});
		});
	});

});
