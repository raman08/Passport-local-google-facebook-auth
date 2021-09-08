const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
	res.json({
		message: 'HELLO',
	});
});

router.get(
	'/protected',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		res.json({
			message: 'This is a proceted route',
			user: req.user,
		});
	}
);
module.exports = router;
