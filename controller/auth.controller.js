const bcrypt = require('bcrypt');

const { createToken } = require('../utils/token.utils');
const User = require('../models/user.model');

exports.getToken = (req, res, next) => {
	const token = createToken(req.user);

	res.json({
		token: token,
		message: 'Authenticated Sucessfully',
	});
};

exports.localUserRegestration = async (req, res, next) => {
	const { email, password, name } = req.body;
	console.table(req.body);
	try {
		const user = await User.findOne({ email: email });
		console.log(user);

		if (user) {
			return res.json({
				message: 'User already registered with that email',
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			email: email,
			password: hashedPassword,
			name: name,
		});

		await newUser.save();

		return res.json({
			message: 'User registeration sucessfull',
			user: {
				_id: newUser._id,
				email: newUser.email,
				name: newUser.name,
			},
		});
	} catch (err) {
		next(err);
	}
};
