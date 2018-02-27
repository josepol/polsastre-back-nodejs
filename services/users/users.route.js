const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const UsersService = require('./users.service');
const debug = require('debug')('app');
const USERS_CONSTANTS = require('./users.constants');
const APP_CONSTANTS = require('../../app.constants');

const userService = new UsersService();

router.post('/login', (req, res, next) => {
  userService.login({username: req.body.username})
  .then(user => {
    const passwordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordValid) {
      res.status(401).send({auth: false, token: null});
    }
    let token = jwt.sign({ id: user._id }, APP_CONSTANTS.SECRET_KEY, {
      expiresIn: APP_CONSTANTS.TOKEN_EXPIRATION_TIME
    });
    res.status('200').send({ auth: true, token: token });
  })
  .catch(error => {
    res.status('401');
    res.send(error);
  });
});

router.post('/register', (req, res, next) => {
  const userParsed = {
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 8)
  }
  userService.register(userParsed)
  .then(user => {
    let token = jwt.sign({ id: user._id }, APP_CONSTANTS.SECRET_KEY, {
      expiresIn: APP_CONSTANTS.TOKEN_EXPIRATION_TIME
    });
    res.status(200);
    res.send({auth: true, token: token});
  })
  .catch(error => {
    res.status('400');
    res.send(error);
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

router.get('/test', (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).send({auth: false, message: 'No token'});
  }
  jwt.verify(token, APP_CONSTANTS.SECRET_KEY, (error, decoded) => {
    if (error) {
      res.status(500).send({auth: false, message: 'Invalid token'});
    }
    res.status(200).send(decoded);
  });
});

module.exports = router;
