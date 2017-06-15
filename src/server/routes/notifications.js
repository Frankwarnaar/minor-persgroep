const {Router} = require('express');

const db = require('../lib/db/index.js');
const forceLogin = require('../lib/forceLogin.js');

const router = Router()
	.use(forceLogin)
	.get('/', getNotifications);

function getNotifications(req, res) {
	db.notifications.get(req.db, req.session.user._id, (err, reviews) => {
		if (err) {
			res.sendStatus(404);
		}

		db.notifications.update(req.db, reviews);

		res.render('notifications/index', {
			reviews,
			notifications: 0
		});
	});
}

module.exports = router;