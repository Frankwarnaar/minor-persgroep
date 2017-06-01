const express = require('express');

const router = express.Router()
	.get('/:_id', renderArticle)
	.get('/edit/:_id', editArticle)
	.post('/edit/:_id', saveArticleEdit);

function renderArticle(req, res) {
	req.db.collection('articles').findOne({_id: Number(req.params._id)}, (err, article) => {
		if (err) {
			res.sendStatus(404);
		}

		res.render('articles/single', {
			article
		});
	});
}

function editArticle(req, res) {
	req.db.collection('articles').findOne({_id: Number(req.params._id)}, (err, article) => {
		if (err) {
			res.sendStatus(404);
		}

		res.render('articles/edit', {
			article
		});
	});
}

function saveArticleEdit(req, res) {
	const id = req.params._id;
	req.db.collection('articles').update(
		{_id: Number(id)},
		{$set:
			{content: req.body.content[1]}
		}
	).then(() => {
		res.redirect(`/articles/${id}`);
	});
}

module.exports = router;