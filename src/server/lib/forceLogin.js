function redirectionMiddleware(req, res, next) {
	if (!req.session.user) {
		req.session.redirectUrl = req.originalUrl;
		res.redirect('/users/login');
	}
	next();
}

module.exports = redirectionMiddleware;