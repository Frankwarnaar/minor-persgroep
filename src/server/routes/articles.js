const express = require('express');

const router = express.Router()
	.get('/:_id', renderArticle)
	.get('/edit/:_id', editArticle);

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

module.exports = router;