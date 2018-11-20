'use strict'

const moment = require('moment');

const BlogModel = require('./blog.model');
const CategoryModel = require('./category.model');
const CommentsModel = require('./comments.model');

class BlogService {

    constructor() {}

    getBlogs() {
        return new Promise((resolve, reject) => {
            return BlogModel.find({}, (error, blogs) => {
                if (error) reject(error);
                resolve(blogs.sort(function(a, b){return b.createdAt-a.createdAt}));
            });
        });
    }

    getCategories() {
        return new Promise((resolve, reject) => {
            return CategoryModel.find({}, (error, categories) => {
                if (error) reject(error);
                resolve(categories);
            });
        });
    }

    addPost(post) {
        return new Promise((resolve, reject) => {
            const postMapped = this.addPostMapper(post);
            return BlogModel.insertMany(postMapped, (error, records) => {
                if (error) reject(error);
                resolve(records);
            });
        });
    }

    deletePosts(posts) {
        return new Promise((resolve, reject) => {
            return BlogModel.remove({'_id': {'$in': posts}}, (error, records) => {
                if (error) reject(error);
                resolve(records);
            });
        });
    }

    modifyPosts(post) {
        return new Promise((resolve, reject) => {
            return BlogModel.update({'_id': post.id}, {'_id': post.id, ...post.post}, (error, records) => {
                if (error) reject(error);
                resolve(records);
            });
        });
    }

    getComments(id) {
        return new Promise((resolve, reject) => {
            return CommentsModel.find({blogId: id}, (error, comments) => {
                if (error) reject(error);
                resolve(comments.sort(function(a, b){return a.date-b.date}));
            });
        });
    }

    addComments(comment, blogId, username, isAdmin) {
        return new Promise((resolve, reject) => {
            const commentMapped = this.addCommentMapper(comment, username, blogId, isAdmin);
            return CommentsModel.insertMany(commentMapped, (error, records) => {
                if (error) reject(error);
                resolve(records);
            });
        });
    }

    addPostMapper(post) {
        const today = moment().valueOf();
        return {
            ...post,
            createdAt: today,
            modifiedAt: today,
            creator: 'polsastre3@gmail.com',
            creatorName: 'Jose Pol',
            comments: 0
        }
    }
    
    addCommentMapper(text, userName, blogId, isAdmin) {
        const date = moment().valueOf();
        return {
            text,
            date,
            userName,
            blogId,
            isAdmin
        }
    }
}

module.exports = BlogService;
