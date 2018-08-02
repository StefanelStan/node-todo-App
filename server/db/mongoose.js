var mongoose = require('mongoose');

//set mongoose to use the global Promise and not some 3rd party one
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });
mongoose.connect('mongodb://stef:stef1234@ds263571.mlab.com:63571/todoapp', { useNewUrlParser: true });

module.exports = {
	mongoose
}; 