'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    rol: Number
});

module.exports = mongoose.model('UserModel', UserSchema);