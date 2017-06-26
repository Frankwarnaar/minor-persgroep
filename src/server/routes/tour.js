const {Router} = require('express');

const router = Router()
	.get('/writing', getWriting)
	.get('/review', getReview);

function getWriting(req, res) {
	res.render('tour/writing');
}

function getReview(req, res) {
	res.render('tour/review');
}

module.exports = router;
