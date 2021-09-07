const path = require('path');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const indexRoutes = require('./routes/index');

require('dotenv').config();

const app = express();

const corsOptions = {
	origin: true,
	methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
	credentials: true,
	exposedHeaders: ['Authorization'],
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/', indexRoutes);

mongoose
	.connect('mongodb://localhost:27017/passport-social-auth')
	.then(() => console.log('[App.js] Connected To DataBase'))
	.catch(err => console.log(err));

app.listen(3000, () =>
	console.log('[App.js] Server Started At http://localhost:3000')
);
