const express = require('express');
const ObjectId = require('mongodb').ObjectID;

const db = require('../lib/db/index');
const forceLogin = require('../lib/forceLogin');

const router = express.Router()
	.use(forceLogin)
	.get('/:_id', getReview)
	.post('/:_id', postReview);

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
	const review = req.body;
	req.db.collection('reviews').insert({
		content: review.content,
		review: review.review,
		type: review.type,
		articleId: ObjectId(articleId),
		userId: ObjectId(req.session.user._id),
		timestamp: new Date().getTime(),
		read: false,
		handled: false,
		accepted: false
	}).then(() => {
		res.redirect(`/review/${articleId}?saved=true`);
	});
}

module.exports = router;