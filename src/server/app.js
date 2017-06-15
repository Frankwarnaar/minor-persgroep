'use strict';

require('dotenv').config();

const assert = require('assert');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');
const {MongoClient} = require('mongodb');
const session = require('express-session');

const port = process.env.PORT || 4000;
const host = process.env.HOST || '0.0.0.0';
const baseDir = '../../dist';

const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const articlesRouter = require('./routes/articles.js');
const reviewRouter = require('./routes/review.js');
const notificationsRouter = require('./routes/notifications.js');
const db = require('./lib/db/index.js');

const sessionConfig = {
	secret: 'fhdsbafjayw4fsdalw74ilufsdwi',
	resave: false,
	saveUninitialized: true
};

express()
	.engine('ejs', require('express-ejs-extend'))
	.set('views', path.join(`${__dirname}/views`))
	.set('view engine', 'ejs')
	.use(compression())
	.use(bodyParser())
	.use(staticAsset(path.join(__dirname, baseDir)))
	.use(express.static(path.join(__dirname, baseDir), {
		maxAge: 365 * 24 * 60 * 60
	}))
	.use(session(sessionConfig))
	.use(mongoMiddleware)
	.use(loginMiddleware)
	.use(notifcationsMiddleware)
	.use('/', indexRouter)
	.use('/users', usersRouter)
	.use('/articles', articlesRouter)
	.use('/review', reviewRouter)
	.use('/notifications', notificationsRouter)
	.listen(port, host, err => {
		err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
	});

function mongoMiddleware(req, res, next) {
	MongoClient.connect(process.env.DB_URL, (err, db) => {
		assert.equal(null, err);
		req.db = db;
		next();
	});
}

function loginMiddleware(req, res, next) {
	res.locals.user = req.session.user;
	next();
}

function notifcationsMiddleware(req, res, next) {
	if (req.session.user) {
		db.notifications.get(req.db, req.session.user._id, (err, results) => {
			res.locals.notifications = results.length;
		});
	} else {
		res.locals.notifications = 0;
	}

	next();
}