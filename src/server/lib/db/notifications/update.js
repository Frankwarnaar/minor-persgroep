const {ObjectId} = require('mongodb');

function updateNotifications(db, reviews) {
	reviews.forEach(review => {
		db.collection('reviews').update(
			{_id: ObjectId(review._id)},
			{
				$set: {
					read: true
				}
			}
		);
	});
}

module.exports = updateNotifications;