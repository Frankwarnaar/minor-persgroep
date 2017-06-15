const {ObjectId} = require('mongodb');

function update(db, reviewId, open, accepted) {
	return db.collection('reviews').update(
		{_id: ObjectId(reviewId)},
		{
			$set: {
				handled: open,
				accepted
			}
		}
	);
}

module.exports = update;