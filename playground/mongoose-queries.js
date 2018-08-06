const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

//var id = '5b60a1d90c0b8527f8203f56';
var wrongID = '6b60a1d90c0b8527f8203f56';
var invalidId = '6b60a1d90c0b8527f8203f561111'
// Todo.find().then((todos) => {
//     console.log('Todo.find', todos);
// });

// Todo.find({_id: id}).then((todos) => {
//     console.log('Todo.find by ID :', todos);
// });

// Todo.findOne({_id: id}).then((todos) => {
//     console.log('Todo.findOne by ID:', todos);
// });

// Todo.findById(id).then((todos) => {
//     console.log('Todo.findById:', todos);
// });

// Todo.findByIdAndUpdate(id, {completed: true}, {new: true})
//     .then((result) =>{
//         console.log('FindByIdAndUpdate:', result);
// });

// if (!ObjectID.isValid(invalidId)) {
//     console.log(`${invalidId} is not valid`);
// }


// Todo.findById(invalidId)
//     .then((todos) => {
//         if (!todos)
//             return console.log('Id not found');
//         console.log('Wrong Todo.findById:', todos);
//     })
//     .catch((error) => {
//         console.log('Fatal error when quering findById - invalidID', error.message);
//     });

//homework: query user by ID Req: 1.If null results, display specific answer; 2.If rsult, display it; 3.if any errors (eg:invapidID) ->display it

// let validUserId = '5b5e06b49c0a1f344c9f376f';
// let invalidUserId = '5b5e06b49c0a1f344c9f376f1111111';

// var queryById = (id) => {
//     return new Promise((resolve, reject) => {
//         User.findById(id)
//             .then((results) => {
//                 if (!results) {
//                     return console.log(`User find by id for ID=${id} returned zero results`);
//                 }
//                 else {
//                     console.log('Found one user:\n', JSON.stringify(results, undefined, 2));
//                 }
//                 resolve();
//             })
//             .catch((exception) => {
//                 console.log(`Encountered an error while querying for User ID=${id}`, exception.message);
//                 resolve();
//             });
//     });
// };

// queryById(validUserId).then(() => {
//     return queryById(invalidUserId);
// });
let todoBody =  {
    completed: true
};
let id = '5b6224f79579b9c2b4454a19';
Todo.findByIdAndUpdate(id, {$set: todoBody}, {new: true})
		.then((todo)=> {
			if(!todo){
				console.log('Unable to update')
			}
			console.log(todo);
		})
		.catch((error)=>{
			console.log(error.message);
		});