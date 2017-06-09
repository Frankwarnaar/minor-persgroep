function getAll(db, cb) {
	db.collection('articles').find({}).toArray(cb);
}

module.exports = getAll;