var mongoose = require('mongoose');

//set mongoose to use the global Promise and not some 3rd party one
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

module.exports = {
	mongoose
}; 