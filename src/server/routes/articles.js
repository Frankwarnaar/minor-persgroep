const express = require('express');
const ObjectId = require('mongodb').ObjectID;

const db = require('../lib/db/index');

const router = express.Router()
	.get('/new', getNewArticle)
	.post('/new', postNewArticle)
	.get('/:_id', getArticle)
	.get('/edit/:_id', getEdit)
	.post('/edit/:_id', postEdit);

function getNewArticle(req, res) {
	if (req.session.user) {
		res.render('articles/new');
	} else {
		res.redirect('/users/login');
	}
}

function postNewArticle(req, res) {
	const article = req.body;
	db.articles.post(req.db, article, req.session.user._id).then(data => {
		const [id] = data.insertedIds;
		res.redirect(`/articles/${id}`);
	});
}

function getArticle(req, res) {
	db.articles.get(req.db, req.params._id, (err, [article]) => {
		if (err) {
			res.sendStatus(404);
		}

		res.render('articles/single', {
			article
		});
	});
}

function getEdit(req, res) {
	db.articles.get(req.db, req.params._id, (err, [article]) => {
		if (err) {
			res.sendStatus(404);
		}

		res.render('articles/edit', {
			article
		});
	});
}

function postEdit(req, res) {
	const id = req.params._id;
	db.articles.edit(req.db, req.body, id).then(() => {
		res.redirect(`/articles/${id}`);
	});
}

module.exports = router;