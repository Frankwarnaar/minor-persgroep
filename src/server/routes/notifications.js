const express = require('express');
const ObjectId = require('mongodb').ObjectID;

const forceLogin = require('../lib/forceLogin.js');

const router = express.Router()
	.use(forceLogin)
	.get('/', getNotifications);

function getNotifications(req, res) {
	req.db.collection('reviews').aggregate([
		{$match: {read: false}},
		{$lookup: {
			from: 'articles',
			localField: 'articleId',
			foreignField: '_id',
			as: 'article'
		}},
		{$match: {'article.authorId': ObjectId(req.session.user._id)}},
		{$unwind: {
			path: '$article',
			preserveNullAndEmptyArrays: true
		}},
		{$lookup: {
			from: 'users',
			localField: 'userId',
			foreignField: '_id',
			as: 'reviewer'
		}},
		{$unwind: {
			path: '$reviewer',
			preserveNullAndEmptyArrays: true
		}}
	], (err, reviews) => {
		if (err) {
			res.sendStatus(404);
		}
		reviews.forEach(review => {
			console.log(review._id);
			req.db.collection('reviews').update(
				{_id: ObjectId(review._id)},
				{
					$set: {
						read: true
					}
				}
			);
		});

		res.render('notifications/index', {reviews});
	});
}

module.exports = router;