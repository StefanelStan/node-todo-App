//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

/*
let obj = new ObjectID();
console.log(obj);
*/

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {
	if(error)
		return console.log('Unable to connect to db server', error);
	console.log('Connected to MongoDB server!');
	let collection = client.db('TodoApp').collection('Users');
	//collection.find().toArray()
	//collection.find({completed: false}).toArray()
	//collection.find({_id: new ObjectID('5b5a355082f28536383dba78')}).toArray()
	collection.find({name: 'Stefannel1', age: 31}).toArray()
		.then((result) => {
			console.log('Todos');
			console.log(JSON.stringify(result, undefined, 2));
		})
		.catch((error) => {
			console.log('Unable to find the Todos', error);
		})
		.then(() => {
			client.close();
			console.log('Disconnected from MongoDB server!');
		});
});

