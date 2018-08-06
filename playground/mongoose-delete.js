const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');
/*
Remove all the docs
Todo.remove({})
    .then((result) => {
        console.log('Deleted ALL the todos', result);
    })
    .catch((error) => {
        console.log('Error while deleting ALL TODOS', error.message);
    }); 
*/
//Todo.findOneAndRemove({})     return the deleted doc

//return the deleted doc
// Todo.findByIdAndRemove('5b621a1e74c85621b866d9f1')
//     .then((result) => {
//         if (!result)
//             return console.log('Did not remove any item');
//         return console.log('Removed 1 item:', JSON.stringify(result, undefined, 2));
//     })
//     .catch((exception) => {
//         console.log('Error while deleting by id', exception.message);
//     });

Todo.remove({"completed": true})
    .then((result) => {
        if(!result)
           return console.log('Could not find any completed=true to delete');
        console.log('Deleted the completed todos', result);
    })
    .catch((error) => {
        console.log('Error while deleting ALL TODOS', error.message);
    }); 