const {ObjectId} = require('mongodb');

function getArticle(db, id, cb) {
	db.collection('articles').aggregate([
		{$match: {_id: ObjectId(id)}},
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
	], cb);
}

module.exports = getArticle;