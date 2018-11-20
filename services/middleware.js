'use strict'

const jwt = require('jsonwebtoken');
const moment = require('moment');

const APP_CONSTANTS = require('../app.constants');
const UserService = require('./users/users.service');

const userService = new UserService();

const middleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) res.status(403).send({ message: "No token" });

    const bearerToken = authorization.split(' ')[1];
    const payload = jwt.decode(bearerToken, APP_CONSTANTS.TOKEN_EXPIRATION_TIME);

    if (!payload || payload.exp <= moment().unix()) {
        res.status('401').send({ message: !payload ? "Invalid token" : "Token expired" });
        return;
    }

    userService.refresh(payload.id).then(user => {
        const userNext = user;
        userService.listOne(payload.id).then(userProfile => {
            userNext.name = userProfile.name;
            userNext.isAdmin = user.rol === 0;
            req.user = userNext;
            next();
        })
    })
    .catch(error => res.status('401').send(error));
}

module.exports = middleware;