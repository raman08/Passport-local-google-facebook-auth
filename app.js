require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static('public'));
app.set('view engine', ejs);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'Thisismyssseeccrreett.',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/passportApp').then(() => {
	console.log('[App.js] Connected to database');
});

const UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	googleId: String,
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const User = new mongoose.model('User', UserSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/auth/google/secrets',
			userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile);
			console.log(accessToken);
			console.log(refreshToken);
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return cb(err, user);
			});
		}
	)
);

app.get('/', (req, res, next) => {
	res.render('home.ejs');
});

app.get('/login', (req, res, next) => {
	res.render('login.ejs');
});

app.get('/register', (req, res, next) => {
	res.render('register.ejs');
});

app.get('/secrets', (req, res, next) => {
	if (req.isAuthenticated()) {
		res.render('secrets.ejs');
	} else {
		res.redirect('login');
	}
});

app.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile'] })
);

app.get(
	'/auth/google/secrets',
	passport.authenticate('google', { failureRedirect: '/login' }),
	function (req, res) {
		res.redirect('/secrets');
	}
);

app.post('/register', async (req, res, next) => {
	try {
		const user = await User.register(
			{ username: req.body.username },
			req.body.password
		);

		console.log(user);

		console.log(req.user);

		// await User.authenticate(req.body.passport);
		passport.authenticate('local')(req, res, () => {
			res.redirect('/secrets');
		});
		console.log(req.user);
	} catch (err) {
		console.log(err);
		res.redirect('/register');
	}
});

app.post('/login', async (req, res, next) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});

	req.login(user, err => {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate('local')(req, res, () => {
				res.redirect('/secrets');
			});
		}
	});
});

app.get('/logout', async (req, res, next) => {
	req.logOut();
	res.redirect('/');
});

app.listen(3000, () =>
	console.log('[App.js] Server Started at http://localhost:3000')
);
