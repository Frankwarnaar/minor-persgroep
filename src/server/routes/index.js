const express = require('express');

const router = express.Router()
	.get('/', renderIndex);

function renderIndex(req, res) {
	req.db.collection('articles').find({}).toArray((err, articles) => {
		if (err) {
			console.log(err);
		}

		res.render('articles/overview', {
			articles
		});
	});
}

module.exports = router;