const express = require('express');
const ObjectId = require('mongodb').ObjectID;

const router = express.Router()
	.get('/:_id', getReview)
	.post('/:_id', postReview);

function getReview(req, res) {
	req.db.collection('articles').aggregate([
		{$match: {_id: ObjectId(req.params._id)}},
		{$lookup: {
			from: 'users',
			localField: 'authorId',
			foreignField: '_id',
			as: 'author'
		}},
		{$lookup: {
			from: 'reviews',
			localField: '_id',
			foreignField: 'articleId',
			as: 'reviews'
		}}
		// {$unwind: '$reviews'},
		// {$lookyp: {
		// 	from: 'users',
		// 	localField: 'reviews.userId',
		// 	foreignField: '_id',
		// 	as: 'reviewer'
		// }},
		// {$match: {reviewers: {$ne: []}}}
	], (err, [article]) => {
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
		timestamp: new Date().getTime()
	}).then(() => {
		res.redirect(`/review/${articleId}?saved=true`);
	});
}

module.exports = router;