const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minLength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'  
		}
	},
	password: {
		type: String,
		required: true,
		minLength: 6,

	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthTokens = function() {
	let user = this;
	let access = 'auth';
	let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
	user.tokens.push({access, token});
	return user.save().then(() => {
		return token;
	});
};

var User = mongoose.model('User', UserSchema);

module.exports = {
	User	
};