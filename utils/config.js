require('dotenv').config();

module.exports = {
	facebookAuth: {
		clientId: process.env.FACEBOOK_CLIENT_ID,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		callbackURL:
			'https://ba87-59-89-183-84.ngrok.io/api/auth/facebook/callback',
		profileURL:
			'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
	},
	googleAuth: {
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: 'http://localhost:3000/api/auth/google/callback',
	},
};
