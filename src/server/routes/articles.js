const {Router} = require('express');

const forceLogin = require('../lib/forceLogin');
const db = require('../lib/db/index');

const router = Router()
	.get('/single/:_id', getArticle)
	.use(forceLogin)
	.get('/new', getNewArticle)
	.post('/new', postNewArticle)
	.get('/edit/:_id', getEdit)
	.post('/edit/:_id', postEdit);

function getNewArticle(req, res) {
	if (req.session.user) {
		res.render('articles/new');
	} else {
		res.redirect('/users/login');
	}
}

function postNewArticle(req, res) {
	const article = req.body;
	db.articles.post(req.db, article, req.session.user._id).then(data => {
		const [id] = data.insertedIds;
		res.redirect(`/articles/single/${id}`);
	});
}

function getArticle(req, res) {
	db.articles.get(req.db, req.params._id, (err, [article]) => {
		if (err) {
			res.sendStatus(502);
			return;
		}

		res.render('articles/single', {
			article
		});
	});
}

function getEdit(req, res) {
	const articleId = req.params._id;
	db.articles.get(req.db, articleId, (err, [article]) => {
		if (err) {
			res.sendStatus(502);
			return;
		}

		if (req.session.user) {
			if (article.authorId == req.session.user._id) {
				res.render('articles/edit', {
					article,
					edit: true
				});
			} else {
				res.redirect(`/articles/single/${articleId}`);
			}
		}
	});
}

function postEdit(req, res) {
	const id = req.params._id;
	db.articles.edit(req.db, req.body, id).then(() => {
		res.redirect(`/articles/single/${id}`);
	});
}

module.exports = router;