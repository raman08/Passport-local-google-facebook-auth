const mongoose = require('mongoose');
const FaceBookTokenStrategy = require('passport-facebook').Strategy;
const GoogleTokenStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

require('dotenv').config();

const User = require('../models/user.model');
const config = require('./config');

module.exports = () => {
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
};
