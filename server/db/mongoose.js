var mongoose = require('mongoose');

//set mongoose to use the global Promise and not some 3rd party one
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOBD_URI, { useNewUrlParser: true });

module.exports = {
	mongoose
}; 