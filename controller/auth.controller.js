const { createToken } = require('../utils/token.utils');

exports.getToken = (req, res, next) => {
	const token = createToken(req.user);

	res.json({
		token: token,
		message: 'Authenticated Sucessfully',
	});
};
