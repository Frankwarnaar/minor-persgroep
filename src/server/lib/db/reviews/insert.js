const {ObjectId} = require('mongodb');

function insert(db, review, articleId, userId) {
	return db.collection('reviews').insert({
		element: review['review-element'],
		review: review.review,
		type: review.type,
		articleId: ObjectId(articleId),
		userId: ObjectId(userId),
		timestamp: new Date().getTime(),
		read: false,
		handled: false,
		accepted: false
	});
}

module.exports = insert;