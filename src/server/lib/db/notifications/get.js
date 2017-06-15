const ObjectId = require('mongodb').ObjectID;

function getNotifications(db, userId, cb) {
	db.collection('reviews').aggregate([
		{$match: {read: false}},
		{$lookup: {
			from: 'articles',
			localField: 'articleId',
			foreignField: '_id',
			as: 'article'
		}},
		{$match: {'article.authorId': ObjectId(userId)}},
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
	], cb);
}

module.exports = getNotifications;