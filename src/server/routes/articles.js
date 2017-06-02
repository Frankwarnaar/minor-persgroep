const express = require('express');
const ObjectId = require('mongodb').ObjectID;

const router = express.Router()
	.get('/new', getNewArticle)
	.post('/new', postNewArticle)
	.get('/:_id', getArticle)
	.get('/edit/:_id', getEdit)
	.post('/edit/:_id', postEdit);

function getNewArticle(req, res) {
	res.render('articles/new');
}

function postNewArticle(req, res) {
	const article = req.body;
	req.db.collection('reviews').insert({
		title: article.title,
		authorId: '592ebb4ce78a3e2a4f73aabb',
		content: article.content[1]
	}).then(data => {
		const [id] = data.insertedIds;
		res.redirect(`/articles/${id}`);
	});
}

function postEdit(req, res) {
	const id = req.params._id;
	req.db.collection('articles').update(
		{_id: Number(id)},
		{
			$set: {
				title: req.body.title,
				content: req.body.content[1]
			}
		}
	).then(() => {
		res.redirect(`/articles/${id}`);
	});
}

function getArticle(req, res) {
	req.db.collection('articles').findOne({_id: ObjectId(req.params._id)}, (err, article) => {
		if (err) {
			res.sendStatus(404);
		}

		console.log(article);
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
		{_id: Number(id)},
		{
			$set: {
				title: req.body.title,
				content: req.body.content[1]
			}
		}
	).then(() => {
		res.redirect(`/articles/${id}`);
	});
}

module.exports = router;