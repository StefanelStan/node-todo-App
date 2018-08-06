const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {
	if(error)
		return console.log('Unable to connect to db server', error);
	console.log('Connected to MongoDB server!');
	let collection = client.db('TodoApp').collection('Users');
	
	/*
	collection.findOneAndUpdate({_id: new ObjectID('5b5de5f035cd240ee4e9e7a1')}, 
								{ $set: {completed: true }}, 
								{returnOriginal: false})
	*/	
	collection.findOneAndUpdate({_id: new ObjectID('5b5ded613308e40ee4bdef4b')}, 
			{ $set: {name: 'Stefan'},
			  $inc: {age: 6}}, 
			{returnOriginal: false})
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

