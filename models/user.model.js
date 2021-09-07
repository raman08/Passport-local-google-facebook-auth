const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		default: 'Anonymous',
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	facebookProvider: {
		type: {
			id: String,
			token: String,
		},
		select: false,
	},
	googleProvider: {
		type: {
			id: String,
			token: String,
		},
		select: false,
	},
	instaProvider: {
		type: {
			id: String,
			token: String,
		},
		select: false,
	},
});

module.exports = mongoose.model('User', UserSchema);
