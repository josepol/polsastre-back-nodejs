'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    text: String,
    date: Date,
    userName: String,
    blogId: String,
    isAdmin: Boolean
});

module.exports = mongoose.model('CommentsModel', CommentsSchema);