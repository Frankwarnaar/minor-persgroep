function getAll(db, cb) {
	db.collection('articles').aggregate([
		{$lookup: {
			from: 'users',
			localField: 'authorId',
			foreignField: '_id',
			as: 'author'
		}},
		{$unwind: {
			path: '$author',
			preserveNullAndEmptyArrays: true
		}}
	], cb);
}

module.exports = getAll;