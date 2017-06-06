'use strict';

const assert = require('assert');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');

const port = process.env.PORT || 4000;
const host = process.env.HOST || '0.0.0.0';
const baseDir = '../../dist';

const cfg = require('../../cfg.js');
const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const articlesRouter = require('./routes/articles.js');
const reviewRouter = require('./routes/review.js');

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
	.use(staticAsset(`${__dirname}/${baseDir}`))
	.use(express.static(`${__dirname}/${baseDir}`, {
		maxAge: 365 * 24 * 60 * 60
	}))
	.use(mongoMiddleware)
	.use(session(sessionConfig))
	.use(loginMiddleware)
	.use('/', indexRouter)
	.use('/users', usersRouter)
	.use('/articles', articlesRouter)
	.use('/review', reviewRouter)
	.listen(port, host, err => {
		err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
	});

function mongoMiddleware(req, res, next) {
	MongoClient.connect(cfg.db, (err, db) => {
		assert.equal(null, err);
		req.db = db;
		next();
	});
}

function loginMiddleware(req, res, next) {
	res.locals.user = req.session.user;
	next();
}