const router = require('express').Router();
const fetch = require('node-fetch');
const passport = require('passport');

const { createToken } = require('../utils/token.utils');
const config = require('../utils/config');

router.get('/', (req, res, next) => {
	res.json({
		message: 'HELLO',
	});
});

module.exports = router;
