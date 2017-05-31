const express = require('express');

const router = express.Router()
	.get('/', renderIndex);

function renderIndex(req, res) {
	req.db.collection('articles').find({}).toArray((err, [article]) => {
		res.render('articles/single', {
			article
		});
	});
}

module.exports = router;