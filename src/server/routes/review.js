const express = require('express');

const db = require('../lib/db/index');
const forceLogin = require('../lib/forceLogin');

const router = express.Router()
	.use(forceLogin)
	.get('/:_id', getReview)
	.post('/:_id', postReview)
	.post('/reopen/:articleId/:authorId/:reviewId', reopenReview)
	.post('/close/:articleId/:authorId/:reviewId', closeReview);

function getReview(req, res) {
	db.articles.get(req.db, req.params._id, (err, [article]) => {
		if (err) {
			res.sendStatus(404);
		}

		res.render('review/single', {
			article
		});
	});
}

function postReview(req, res) {
	const articleId = req.params._id;
	db.reviews.insert(req.db, req.body, articleId, req.session.user._id).then(data => {
		const [review] = data.ops;
		res.redirect(`/review/${articleId}#${review._id}`);
	});
}

function reopenReview(req, res) {
	const articleId = req.params.articleId;
	if (req.params.authorId === req.session.user._id) {
		db.reviews.update(req.db, req.params.reviewId, false).then(() => {
			res.redirect(`/articles/${articleId}`);
		});
	}
}
function closeReview(req, res) {
	const articleId = req.params.articleId;
	if (req.params.authorId === req.session.user._id) {
		db.reviews.update(req.db, req.params.reviewId, true).then(() => {
			res.redirect(`/articles/${articleId}`);
		});
	}
}

module.exports = router;