const express = require('express');
const ObjectId = require('mongodb').ObjectID;

const router = express.Router()
	.get('/:_id', getReview)
	.post('/:_id', postReview);

function getReview(req, res) {
	req.db.collection('articles').aggregate([
		{$match: {_id: ObjectId(req.params._id)}},
		{$lookup: {
			from: 'reviews',
			localField: '_id',
			foreignField: 'articleId',
			as: 'reviews'
		}},
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
		console.log(article);

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
		articleId,
		userId: 1
	}).then(() => {
		res.redirect(`/review/${articleId}?saved=true`);
	});
}

module.exports = router;