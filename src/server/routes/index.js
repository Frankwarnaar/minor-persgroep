const express = require('express');

const db = require('../lib/db/index');

const router = express.Router()
	.get('/', renderIndex);

function renderIndex(req, res) {
	db.articles.getAll(req.db, (err, articles) => {
		if (err) {
			console.log(err);
		}

		res.render('articles/overview', {
			articles
		});
	});
}

module.exports = router;