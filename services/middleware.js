'use strict'

const jwt = require('jsonwebtoken');
const moment = require('moment');

const APP_CONSTANTS = require('../app.constants');
const UserService = require('./users/users.service');

const userService = new UserService();

const middlewareUser = (req, res, next) => {
    authentication(req, res).then(({userNext, userProfile}) => {
        userNext.name = userProfile.name;
        userNext.isAdmin = userNext.rol === 0;
        req.user = userNext;
        next();
    });
}

const middlewareAdmin = (req, res, next) => {
    authentication(req, res).then(({userNext, userProfile}) => {
        userNext.name = userProfile.name;
        userNext.isAdmin = userNext.rol === 0;
        req.user = userNext;
        if (userNext.isAdmin) {
            next();
            return;
        }
        res.status('403').send({message: "Not ADMIN"});
    });
}

const authentication = (req, res) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        res.status(403).send({ message: "No token" });
        return;
    };

    const bearerToken = authorization.split(' ')[1];
    const payload = jwt.decode(bearerToken, APP_CONSTANTS.TOKEN_EXPIRATION_TIME);

    if (!payload || payload.exp <= moment().unix()) {
        res.status('401').send({ message: !payload ? "Invalid token" : "Token expired" });
        return;
    }

    return new Promise((resolve, reject) => {
        userService.refresh(payload.id).then(user => {
            const userNext = user;
            userService.listOne(payload.id).then(userProfile => {
                userNext.name = userProfile.name;
                userNext.isAdmin = userNext.rol === 0;
                req.user = userNext;
                resolve({
                    userNext,
                    userProfile
                });
            })
        })
        .catch(error => {
            res.status('401').send(error);
            reject();
        });
    });
}

module.exports = {
    middlewareUser,
    middlewareAdmin
};