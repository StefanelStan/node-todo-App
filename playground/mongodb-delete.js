const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {
	if(error)
		return console.log('Unable to connect to db server', error);
	console.log('Connected to MongoDB server!');
	let collection = client.db('TodoApp').collection('Users');
	
	//deleteMany
		//deleteMany(client, collection);
	//deleteOne
	//deleteOne(client, collection);
	//findOneAndDelete
	    //findOneAndDelete(client, collection);
	challenge(client, collection);
});

var deleteMany = (client, collection) => {
	collection.deleteMany({text:'Eat lunch'})
	.then((result) => {
		console.log('Todos deleted result');
		console.log(JSON.stringify(result, undefined, 2));
	})
	.catch((error) => {
		console.log('Unable to delete from Todos', error);
	})
	.then(() => {
		client.close();
		console.log('Disconnected from MongoDB server!');
	});
};

var deleteOne = (client, collection) => {
	collection.deleteOne({text:'Eat lunch2'})
	.then((result) => {
		console.log('Todos deleted result');
		console.log(JSON.stringify(result, undefined, 2));
	})
	.catch((error) => {
		console.log('Unable to delete from Todos', error);
	})
	.then(() => {
		client.close();
		console.log('Disconnected from MongoDB server!');
	});
};

var findOneAndDelete = (client, collection) => {
	collection.findOneAndDelete({completed: false})
	.then((result) => {
		console.log('Todos deleted result');
		console.log(JSON.stringify(result, undefined, 2));
	})
	.catch((error) => {
		console.log('Unable to delete from Todos', error);
	})
	.then(() => {
		client.close();
		console.log('Disconnected from MongoDB server!');
	});
};

var challenge = (client, collection) => {
	collection.deleteMany({
			name: 'Stefannel1'
		})
		.then((result) => {
			console.log(JSON.stringify(result, undefined, 2));
			return collection.findOneAndDelete({
				_id: new ObjectID('5b5d9f067782d167dcd68e9f')
			});
		})
		.catch((error) => {
			console.log('Unable to complete challenge', error);
		})
		.then(() => {
			client.close();
			console.log('Disconnected from MongoDB server!');
		});


};
