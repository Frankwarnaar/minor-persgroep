const ObjectId = require('mongodb').ObjectID;

function update(db, reviewId) {
	return db.collection('reviews').update(
		{_id: ObjectId(reviewId)},
		{
			$set: {
				handled: true,
				accepted: true
			}
		}
	);
}

module.exports = update;