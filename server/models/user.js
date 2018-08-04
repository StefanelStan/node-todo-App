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

UserSchema.statics.findByToken = function (token) {
	let User = this;
	try {
		let decoded = jwt.verify(token, 'abc123');
		return User.findOne({
			'_id': decoded._id,
			'tokens.token': token,
			'tokens.access': 'auth'
		});
	} catch(e){
		// return new Promise ((resolve, reject) =>{
		// 	reject();
		// });
		return Promise.reject();
	}
};

var User = mongoose.model('User', UserSchema);

module.exports = {
	User	
};