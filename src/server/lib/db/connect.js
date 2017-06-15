require('dotenv').config();

const assert = require('assert');
const {MongoClient} = require('mongodb');

function connect(cb) {
	MongoClient.connect(process.env.DB_URL, (err, db) => {
		assert.equal(null, err);
		cb(db);
	});
}

module.exports = connect;