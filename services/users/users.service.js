var mongoose = require('mongoose');
var UserModel = require('./user.model');
var UserProfileModel = require('./user-profile.model');

class UsersService {

    login(user) {
        return new Promise((resolve, reject) => {
            UserModel.findOne(user, (error, response) => {
                if (!response || error) {
                    reject(error);
                }
                resolve(response);
            });
        });
    }

    refresh(token) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ _id: token }, (error, response) => {
                if (!response || error) {
                    reject(error);
                }
                resolve(response);
            });
        });
    }

    register(userRegister) {
        const userModel = new UserModel(userRegister);
        return new Promise(resolve => {
            userModel.save((error, response) => {
                if (error) resolve(error);
                resolve(response);
            });
        });
    }

    listAll() {
        return new Promise((resolve, reject) => {
            UserModel.find({}, (error, users) => {
                if (error) {
                    reject(error);
                }
                resolve(users);
            });
        });
    }

    listOne(token) {
        return new Promise((resolve, reject) => {
            UserProfileModel.findOne({ _id: token }, (error, user) => {
                if (error || !user) {
                    reject(error);
                }
                resolve({
                    name: user.name,
                    username: user.username
                });
            });
        });
    }
}

module.exports = UsersService;