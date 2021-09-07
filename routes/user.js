const express = require('express');
const passport = require('passport');

const { getToken } = require('../controller/auth.controller');

require('../utils/passport')();

const router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));

router.get(
	'/facebook/callback',
	passport.authenticate('facebook', { session: false }),
	getToken
);

router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
	'/google/callback',
	passport.authenticate('google', { session: false }),
	getToken
);

module.exports = router;
