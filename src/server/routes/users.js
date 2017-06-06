const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router()
	.get('/login', getLogin)
	.post('/login', postLogin)
	.get('/register', getRegister)
	.post('/register', postRegister)
	.get('/logout', getLogout)
	.use(redirectionMiddleware)
	.get('/edit', getEdit)
	.post('/edit', postEdit)
	.get('/remove', getRemove);

function getLogin(req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else {
		res.render('users/login', {
			error: false
		});
	}
}

// Afhandeling van login
function postLogin(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	req.db.collection('users').findOne({email}, (err, user) => {
		if (user) {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					req.session.user = user;
					res.redirect('/');
				} else {
					res.render('users/login', {
						error: `Password didn't match for ${email}`
					});
				}
			});
		} else {
			res.render('users/login', {
				error: `No user found with email ${email}`
			});
		}
	});
}

function redirectionMiddleware(req, res, next) {
	console.log(req.session);
	if (!req.session.user) {
		res.redirect('/users/login');
	}
	next();
}

// Aanvraag voor registreerpagina
function getRegister(req, res) {
	if (req.session.user) {
		res.redirect('/users');
	} else {
		res.locals.error = false;
		res.render('users/register');
	}
}

// Afhandeling van registreren
function postRegister(req, res) {
	const newUser = req.body;
	req.db.collection('users').findOne({email: newUser.email}, (err, user) => {
		if (!user) {
			bcrypt.hash(newUser.password, 10).then(hashedPassword => {
				req.db.collection('users').insert({
					name: {
						first: newUser.firstName,
						last: newUser.lastName
					},
					email: newUser.email,
					password: hashedPassword
				}).then(registeredUser => {
					req.session.user = registeredUser;
					res.redirect('/');
				});
			});
		} else {
			res.render('/users/register', {
				error: `Er is al een account geregisteerd op het emailadres ${newUser.email}`
			});
		}
	});
}

function getEdit(req, res) {
	if (!req.session.user) {
		res.redirect('/users');
	} else {
		const username = req.session.user;
		req.getConnection(function(err, connection) {
			connection.query('SELECT * FROM users WHERE name = ? ', [username], function(err, results) {
				res.locals.data = results[0];
				res.render('users/edit', {
					error: false
				});
			});
		});
	}
}

function postEdit(req, res) {
	if (req.body.name.trim() === '' || req.body.password.trim() === '' || req.body.email.trim() === '') {
		if (req.body.name.trim = '') {
			res.render('users/edit', {
				error: 'De ingevoerde gebruikersnaam is incorrect.'
			});
		} else if(req.body.password.trim() === '') {
			res.render('users/edit', {
				error: 'Het ingevoerde wachtwoord is incorrect.'
			});
		} else if(req.body.email.trim() === '') {
			res.render('users/edit', {
				error: 'Het ingevoerde emailadres is incorrect.'
			});
		}
	} else {
		// req.getConnection(function (err, connection) {
		// 	const data = {
		// 		name : req.body.name,
		// 		password : req.body.password,
		// 		email : req.body.email
		// 	};
		// 	connection.query('UPDATE users set ? WHERE id = ? ', [data, req.session.userid], function(err, results) {
		// 		res.redirect('/users');
		// 	});
		// });
	}
}

function getRemove(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		// req.getConnection(function (err, connection) {
		// 	connection.query('DELETE FROM users WHERE id = ? ', [req.session.userid], function(err, results) {
		// 		req.session.destroy();
		// 		res.redirect('/');
		// 	});
		// });
	}
}

// Afhandeling voor uitloggen
function getLogout(req, res) {
	req.session.destroy();
	res.redirect('/');
}

module.exports = router;