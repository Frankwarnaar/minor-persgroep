const express = require('express');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;

const router = express.Router()
	.get('/login', getLogin)
	.post('/login', postLogin)
	.get('/register', getRegister)
	.post('/register', postRegister)
	.get('/logout', getLogout)
	.use(redirectionMiddleware)
	.get('/edit', getEdit)
	.post('/edit', postEdit);

function getLogin(req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else {
		res.render('users/login', {
			error: false
		});
	}
}

function postLogin(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	req.db.collection('users').findOne({email}, (err, user) => {
		if (user) {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					delete user.password;
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
					password: hashedPassword,
					admin: false,
					author: newUser.author
				}).then(registeredUser => {
					delete registeredUser.password;
					req.session.user = registeredUser;
					res.redirect('/');
				});
			});
		} else {
			res.render('users/register', {
				error: `Er is al een account geregisteerd op het emailadres ${newUser.email}`
			});
		}
	});
}

function getEdit(req, res) {
	if (!req.session.user) {
		res.redirect('/users');
	} else {
		res.render('users/edit');
	}
}

function postEdit(req, res) {
	const user = req.body;
	user.name = {
		first: user.firstName,
		last: user.lastName
	};
	delete user.firstName;
	delete user.lastName;

	if (user.password.trim() !== '') {
		bcrypt.hash(user.password, 10).then(hashedPassword => {
			user.password = hashedPassword;
			updateUser(user);
		});
	} else {
		delete user.password;
		updateUser(user);
	}

	function updateUser(newUser) {
		req.db.collection('users').update(
			{_id: ObjectId(req.session.user._id)},
			{$set: newUser}
		).then(() => {
			user._id = req.session.user._id;
			req.session.user = user;
			res.redirect('/users/edit');
		});
	}
}

function getLogout(req, res) {
	req.session.destroy();
	res.redirect('/');
}

module.exports = router;