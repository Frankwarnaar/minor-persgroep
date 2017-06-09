const ObjectId = require('mongodb').ObjectID;

function update(db, reviewId, open) {
	return db.collection('reviews').update(
		{_id: ObjectId(reviewId)},
		{
			$set: {
				handled: open,
				accepted: open
			}
		}
	);
}

module.exports = update;