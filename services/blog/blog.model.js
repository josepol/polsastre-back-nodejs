'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    picture: String,
    title: String,
    subtitle: String,
    message: [String],
    createdAt: Number,
    modifiedAt: Number,
    creator: String,
    creatorName: String,
    category: String,
    comments: Number
});

module.exports = mongoose.model('BlogModel', BlogSchema);