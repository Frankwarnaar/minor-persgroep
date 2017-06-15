const {Router} = require('express');

const db = require('../lib/db/index');
const forceLogin = require('../lib/forceLogin');

const router = Router()
	.use(forceLogin)
	.get('/:_id', getReview)
	.post('/:_id', postReview)
	.post('/reopen/:articleId/:authorId/:reviewId/:edit', reopenReview)
	.post('/close/:articleId/:authorId/:reviewId/:edit', closeReview)
	.post('/accept/:articleId/:authorId/:reviewId/', acceptReview);

function getReview(req, res) {
	db.articles.get(req.db, req.params._id, (err, [article]) => {
		if (err) {
			res.sendStatus(404);
		}

		res.render('review/single', {
			article
		});
	});
}

function postReview(req, res) {
	const articleId = req.params._id;
	db.reviews.insert(req.db, req.body, articleId, req.session.user._id).then(data => {
		const [review] = data.ops;
		res.redirect(`/review/${articleId}#${review._id}`);
	});
}

function reopenReview(req, res) {
	const articleId = req.params.articleId;
	if (req.params.authorId === req.session.user._id) {
		db.reviews.update(req.db, req.params.reviewId, false, false).then(() => {
			res.redirect(`/articles/single/${articleId}`);
		});
	}
}

function closeReview(req, res) {
	const articleId = req.params.articleId;
	if (req.params.authorId === req.session.user._id) {
		db.reviews.update(req.db, req.params.reviewId, true, false).then(() => {
			res.redirect(`/articles/${req.params.edit == true ? 'edit' : 'single'}/${articleId}`);
		});
	}
}

function acceptReview(req, res) {
	const articleId = req.params.articleId;
	if (req.params.authorId === req.session.user._id) {
		db.reviews.update(req.db, req.params.reviewId, true, true).then(() => {
			res.redirect(`/articles/edit/${articleId}`);
		});
	}
}

module.exports = router;