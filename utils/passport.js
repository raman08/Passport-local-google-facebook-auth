const mongoose = require('mongoose');
const passport = require('passport');
const FaceBookTokenStrategy = require('passport-facebook').Strategy;
const GoogleTokenStrategy = require('passport-google-oauth20').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const JWTExtractor = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const config = require('./config');

require('dotenv').config();

module.exports = () => {
	// Passport Facebook Strategy Middleware
	passport.use(
		new FaceBookTokenStrategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: config.facebookAuth.clientSecret,
				callbackURL: config.facebookAuth.callbackURL,
				profileFields: [
					'id',
					'email',
					'gender',
					'link',
					'locale',
					'name',
					'updated_time',
					'displayName',
					'verified',
				],
			},
			async (accessToken, refreshToken, profile, done) => {
				console.log(profile);
				try {
					const user = await User.findOne({
						$or: [
							{ 'faceBookProvider.id': profile.id },
							{ email: profile.emails[0].value },
						],
					});

					if (!user) {
						const newUser = User({
							name: profile.displayName,
							email: profile.emails[0].value,
							facebookProvider: {
								id: profile.id,
								token: accessToken,
							},
						});

						await newUser.save();
						return done(null, newUser);
					} else if (user.email === profile.emails[0].value) {
						const faceBookProviderData = {
							id: profile.id,
							token: accessToken,
						};

						const updatedUser = await User.findByIdAndUpdate(
							user._id,
							{
								$set: {
									facebookProvider: faceBookProviderData,
								},
							},
							{ new: true }
						);

						return done(null, updatedUser);
					}

					return done(null, user);
				} catch (err) {
					done(err, false);
				}
			}
		)
	);

	// Passport Google Strategy Middleware
	passport.use(
		new GoogleTokenStrategy(
			{
				clientID: config.googleAuth.clientId,
				clientSecret: config.googleAuth.clientSecret,
				callbackURL: config.googleAuth.callbackURL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await User.findOne({
						$or: [
							{ 'googleProvider.id': profile.id },
							{ email: profile.emails[0].value },
						],
					});

					if (!user) {
						const newUser = User({
							name: profile.displayName,
							email: profile.emails[0].value,
							googleProvider: {
								id: profile.id,
								token: accessToken,
							},
						});

						await newUser.save();
						return done(null, newUser);
					} else if (user.email === profile.emails[0].value) {
						const googleProviderData = {
							id: profile.id,
							token: accessToken,
						};

						const updatedUser = await User.findByIdAndUpdate(
							user._id,
							{ $set: { googleProvider: googleProviderData } },
							{ new: true }
						);

						return done(null, updatedUser);
					}

					return done(null, user);
				} catch (err) {
					console.log(err);
					done(err, false);
				}
			}
		)
	);

	// Passport JWT Strategy Middleware
	passport.use(
		new JWTStrategy(
			{
				jwtFromRequest: JWTExtractor.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_SECRET,
			},
			async (jwt_payload, done) => {
				try {
					const user = await User.findOne({ _id: jwt_payload._id });
					if (!user) {
						return done(null, false);
					}
					return done(null, user);
				} catch (err) {
					return done(err, false);
				}
			}
		)
	);

	// Passport Local Strategy Middleware
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					console.log('Verifying');
					console.table({ username, password });

					const user = await User.findOne({ email: username });
					console.log(user);

					if (!user) {
						return done(null, false);
					}

					const isEqual = await bcrypt.compare(
						password,
						user.password
					);

					if (!isEqual) {
						return done(
							new Error('Invalid Email or password'),
							false
						);
					}

					return done(null, user);
				} catch (err) {
					console.log(err);
					return done(err, false);
				}
			}
		)
	);
};
