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

const wss = require('../app.js')
	.on('connection', onSocketConnection);

let sockets = [];

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

		sockets.forEach(socket => {
			if (socket.userId === req.body.authorId) {
				db.connect(database => {
					db.notifications.get(database, req.body.authorId, (err, results) => {
						socket.send(`{"notificationsCount": "${results.length}"}`);
					});
				});
			}
		});
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
			const userId = message.userId;
			console.log(`Client ${userId} connected`);

			socket.userId = userId;
			sockets.push(socket);
		}
	}

	function onSocketClose() {
		console.log('Client disconnected');
		sockets = sockets.filter(single => {
			return single.userId !== socket.userId;
		});
	}
}

module.exports = router;