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
		{$unwind: {
			path: '$author',
			preserveNullAndEmptyArrays: true
		}},
		{$lookup: {
			from: 'reviews',
			localField: '_id',
			foreignField: 'articleId',
			as: 'reviews'
		// }},
		// {$unwind: {
		// 	path: '$reviews',
		// 	preserveNullAndEmptyArrays: true
		// }},
		// {$lookup: {
		// 	from: 'users',
		// 	localField: 'reviews.userId',
		// 	foreignField: '_id',
		// 	as: 'reviews.reviewer'
		// }},
		// {$project: {
		//
		// }}
		// {$group: {
		// 	_id: '$_id',
		// 	reviews: {$push: '$reviews'}
		// }},
		// {$project: {
		// 	_id: '$_id',
		// 	title: '$title',
		// 	content: '$content',
		// 	reviews: '$reviews',
		// 	author: '$author'
		}}
		// {$lookup: {
		// 	from: 'users',
		// 	localField: 'reviews.userId',
		// 	foreignField: '_id',
		// 	as: 'reviews.reviewer'
		// }}
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
		timestamp: new Date().getTime(),
		read: false,
		handled: false,
		accepted: false
	}).then(() => {
		res.redirect(`/review/${articleId}?saved=true`);
	});
}

module.exports = router;