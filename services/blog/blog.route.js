'use strict'

const mongoose = require('mongoose');
const express = require('express');

const BlogService = require('./blog.service');
const middleware = require('../middleware');

const router = express.Router();

const blogService = new BlogService();

router.get('/all', middleware, (req, res) => {
    blogService.getBlogs().then(blogs => res.send(blogs))
    .catch(error => res.status(400).send(error));
});

router.get('/categories/all', middleware, (req, res) => {

});

router.get('recentsAndPopulars/all', middleware, (req, res) => {

});

router.get('tags/all', middleware, (req, res) => {

});

module.exports = router;