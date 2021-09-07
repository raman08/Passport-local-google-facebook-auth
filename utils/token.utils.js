const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.createToken = user => {
	console.log(user);

	return jwt.sign(
		{ _id: user._id, email: user.email },
		process.env.JWT_SECRET
	);
};
