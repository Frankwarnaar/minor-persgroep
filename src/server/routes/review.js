const {Router} = require('express');

const db = require('../lib/db/index');
const forceLogin = require('../lib/forceLogin');

const router = Router()
	.use(forceLogin)
	.get('/:_id', getReview)
	.post('/:_id', postReview)
	.post('/edit/:articleId/:reviewId', editReview)
	.post('/reopen/:articleId/:authorId/:reviewId/:edit', reopenReview)
	.post('/close/:articleId/:authorId/:reviewId/:edit', closeReview)
	.post('/accept/:articleId/:authorId/:reviewId/', acceptReview);

const wss = require('../app.js')
	.on('connection', onSocketConnection);

let sockets = [];
let reviews = [];

/*	==================================================
	Routes handlers
	================================================== */

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
		review.date = new Date().getTime();

		let reviewIndex = -1;
		reviews.forEach((single, i) => {
			if (single.userId === review.userId && single.articleId === review.articleId) {
				reviewIndex = i;
			}
		});

		if (reviewIndex >= 0) {
			reviews.splice(reviewIndex, 1);
			updateReviews();
		}

		sockets.forEach(socket => {
			if (socket.userId === req.body.authorId) {
				db.connect(database => {
					db.notifications.get(database, req.body.authorId, (err, results) => {
						socket.send(JSON.stringify({
							count: results.length,
							review
						}));
					});
				});
			} else if (socket.articleId === articleId) {
				socket.send(JSON.stringify({
					finishedReview: review
				}));
			}
		});
		res.redirect(`/review/${articleId}#${review._id}`);
	});
}

function editReview(req, res) {
	const {articleId, reviewId} = req.params;
	db.reviews.edit(req.db, req.body, reviewId).then(() => {
		res.redirect(`/review/${articleId}`);
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

/*	==================================================
	Websocket handlers
	================================================== */

function onSocketConnection(socket) {
	socket
		.on('message', handleMessage)
		.on('close', onSocketClose);

	function handleMessage(message) {
		message = JSON.parse(message);

		if (message.userId) {
			const id = message.userId;
			setValue('userId', id);
			console.log(`Client ${id} connected`);
			sockets.push(socket);
		}

		if (message.articleId) {
			setValue('articleId', message.articleId);

			const activeReviews = reviews.filter(single => single.articleId === socket.articleId);
			socket.send(JSON.stringify({reviews: activeReviews}));
		}

		if (message.review) {
			onReviewEdit(message.review);
		}
	}

	function setValue(key, value) {
		socket[key] = value;
	}

	function onReviewEdit(review) {
		let matchingIndex = -1;
		reviews.forEach((single, i) => {
			if (review.articleId === single.articleId && review.element === single.element) {
				matchingIndex = i;
			}
		});

		if (matchingIndex >= 0) {
			reviews[matchingIndex] = review;
		} else {
			reviews.push(review);
		}

		updateReviews();
	}

	function onSocketClose() {
		console.log('Client disconnected');
		sockets = sockets.filter(single => {
			return single.userId !== socket.userId;
		});
		reviews = reviews.filter(single => {
			return single.userId !== socket.userId;
		});

		updateReviews();
	}
}

function updateReviews() {
	sockets.forEach(socket => {
		const activeReviews = reviews.filter(review => {
			return review.articleId === socket.articleId && review.userId !== socket.userId;
		});
		socket.send(JSON.stringify({reviews: activeReviews}));
	});
}

module.exports = router;