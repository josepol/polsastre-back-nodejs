'use strict'

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const UsersService = require('./users.service');
const USERS_CONSTANTS = require('./users.constants');
const APP_CONSTANTS = require('../../app.constants');
const Middleware = require('../middleware');

const router = express.Router();

const userService = new UsersService();

router.post('/login', (req, res, next) => {
	userService.login({ username: req.body.username })
	.then(user => {
		const passwordValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordValid) {
			res.status(401).send({ auth: false, token: null });
		}
		let token = jwt.sign({ id: user._id, rol: user.rol }, APP_CONSTANTS.SECRET_KEY, {
			expiresIn: APP_CONSTANTS.TOKEN_EXPIRATION_TIME
		});
		res.status('200').send({ token, isAdmin: user.rol === 0 ? true : false });
	})
	.catch(error => {
		res.status('401');
		res.send(error);
	});
});

router.get('/refresh', Middleware.middlewareUser, (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) {
		res.status(403).send({ message: "No token" });
	}
	const bearerToken = authorization.split(' ')[1];
	const payload = jwt.decode(bearerToken, APP_CONSTANTS.TOKEN_EXPIRATION_TIME);

	if (payload.exp <= moment().unix()) {
		res.status(401).send({ message: "Token expired" });
	}

	userService.refresh(payload.id)
	.then(user => {
		let token = jwt.sign({ id: user._id, rol: user.rol }, APP_CONSTANTS.SECRET_KEY, {
			expiresIn: APP_CONSTANTS.TOKEN_EXPIRATION_TIME
		});
		res.status('200').send({ token, isAdmin: user.rol === 0 ? true : false, testing: '123123' });
	})
	.catch(error => {
		res.status('401');
		res.send(error);
	});
});

router.post('/register', (req, res, next) => {
	const userParsed = {
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 8),
		rol: 1
	}
	const userProfileParsed = {
		name: req.body.name,
		username: req.body.username
	}
	userService.register(userParsed)
	.then(user => {
		userService.registerUserProfile(user.id, userProfileParsed);
		return user;
	})
	.then(user => {
		let token = jwt.sign({id: user._id}, APP_CONSTANTS.SECRET_KEY, {
			expiresIn: APP_CONSTANTS.TOKEN_EXPIRATION_TIME
		});
		res.status(200);
		res.send({ token });
	})
	.catch(error => {
		res.status('400');
		res.send({code: error.code});
	});
});

router.get('/', (req, res, next) => {
	userService.listAll()
	.then(users => {
		res.status(200);
		res.send(users);
	})
	.catch(error => {
		res.status(400);
		res.send(error);
	})
});

router.get('/profile', (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) {
		res.status(403).send({ message: "No token" });
	}
	const bearerToken = authorization.split(' ')[1];
	const payload = jwt.decode(bearerToken, APP_CONSTANTS.TOKEN_EXPIRATION_TIME);

	if (payload.exp <= moment().unix()) {
		res.status(401).send({ message: "Token expired" });
	}

	userService.listOne(payload.id)
	.then(user => {
		res.status('200').send({ ...user });
	})
	.catch(error => {
		res.status('401');
		res.send(error);
	});
});

router.get('/cancel-account', (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) {
		res.status(403).send({ message: "No token" });
	}
	const bearerToken = authorization.split(' ')[1];
	const payload = jwt.decode(bearerToken, APP_CONSTANTS.TOKEN_EXPIRATION_TIME);

	if (payload.exp <= moment().unix()) {
		res.status(401).send({ message: "Token expired" });
	}

	Promise.all([
		userService.deleteUser(payload.id), 
		userService.deleteUserProfile(payload.id)
	])
	.then(status => {
		res.status('200').send({ status: 'OK' });
	})
	.catch(error => {
		res.status('401');
		res.send(error);
	});
});

module.exports = router;
