'use strict'

const mongoose = require('mongoose');
const express = require('express');

const BlogService = require('./blog.service');

const router = express.Router();

const blogService = new BlogService();

router.get('/all', (req, res, next) => {
    blogService.getBlogs().then(blogs => res.send(blogs))
    .catch(error => res.status(400).send(error));
});

module.exports = router;