const path = require('path');
const {Router} = require('express');

const db = require('../lib/db/index');

const router = Router()
	.get('/', renderIndex)
	.get('/manifest.json', sendManifest)
	.get('/sw.js', sendServiceWorker);

function renderIndex(req, res) {
	db.articles.getAll(req.db, (err, articles) => {
		if (err) {
			res.sendStatus(502);
			return;
		}

		res.render('articles/overview', {
			articles
		});
	});
}

function sendManifest(req, res) {
	res.sendFile('manifest.json', {root: path.join(__dirname, '../../')});
}

function sendServiceWorker(req, res) {
	res.sendFile('client/js/sw.js', {root: path.join(__dirname, '../../')});
}

module.exports = router;