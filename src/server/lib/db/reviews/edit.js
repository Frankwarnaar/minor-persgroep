const {ObjectId} = require('mongodb');

function postArticle(db, review, id) {
	return db.collection('reviews').update(
		{_id: ObjectId(id)},
		{
			$set: {
				type: review.type,
				review: review.review
			}
		}
	);
}

module.exports = postArticle;