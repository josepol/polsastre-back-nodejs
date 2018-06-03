'use strict'

const mongoose = require('mongoose');
const express = require('express');

const BlogService = require('./blog.service');
const middleware = require('../middleware');

const router = express.Router();

const blogService = new BlogService();

router.get('/all', (req, res) => {
    blogService.getBlogs().then(blogs => res.send(blogs))
    .catch(error => res.status(400).send(error));
});

router.get('/categories/all', (req, res) => {
    blogService.getCategories().then(categories => res.send(categories))
    .catch(error => res.status(400).send(error));
});

router.post('/add-post', (req, res) => {
    blogService.addPost(req.body).then(addPostStatus => res.send(addPostStatus))
    .catch(error => res.status(400).send(error));
});

router.get('recentsAndPopulars/all', (req, res) => {

});

router.get('tags/all', (req, res) => {

});

module.exports = router;