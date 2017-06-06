const express = require('express');
const ObjectId = require('mongodb').ObjectID;

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
	req.db.collection('articles').insert({
		title: article.title,
		authorId: ObjectId(req.session.user._id),
		content: article.content,
		timestamp: new Date().getTime()
	}).then(data => {
		const [id] = data.insertedIds;
		res.redirect(`/articles/${id}`);
	});
}

function getArticle(req, res) {
	req.db.collection('articles').aggregate([
		{$match: {_id: ObjectId(req.params._id)}},
		{$lookup: {
			from: 'users',
			localField: 'authorId',
			foreignField: '_id',
			as: 'author'
		}}
	], (err, [article]) => {
		if (err) {
			res.sendStatus(404);
		}
		res.render('articles/single', {
			article
		});
	});
}

function getEdit(req, res) {
	req.db.collection('articles').findOne({_id: ObjectId(req.params._id)}, (err, article) => {
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
	req.db.collection('articles').update(
		{_id: ObjectId(id)},
		{
			$set: {
				title: req.body.title,
				content: req.body.content
			}
		}
	).then(() => {
		res.redirect(`/articles/${id}`);
	});
}

module.exports = router;