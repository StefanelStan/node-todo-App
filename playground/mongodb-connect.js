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
//	let collection = client.db('TodoApp').collection('Todos');
//	collection.insertOne({
//		text: 'Something to do',
//		completed: false
//	}, (error, result) => {
//		if(error)
//			return console.log('Unable to insert ToDo', err);
//		console.log(JSON.stringify(result.ops, undefined, 2));
//		
//	})
	
	/*insert new doc 'Users' a new document {name, age, location} 
	let collection = client.db('TodoApp').collection('Users');
	collection.insertOne({
		//_id: 123, better leave it as it is
		name: 'Stefannel3',
		age: 31,
		location : 'London'
	}, (error, result)=> {
		if(error)
			return console.log('Unable to insert into Collection [Users]');
		console.log (JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	});
	*/
	
	
	client.close();
	console.log('Disconnected from MongoDB server!');
});