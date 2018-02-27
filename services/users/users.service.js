var mongoose = require('mongoose');
var UserModel = require('./user.model');

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
}

module.exports = UsersService;