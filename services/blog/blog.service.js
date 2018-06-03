'use strict'

const moment = require('moment');

const BlogModel = require('./blog.model');
const CategoryModel = require('./category.model');

class BlogService {
    constructor() {}

    getBlogs() {
        return new Promise((resolve, reject) => {
            return BlogModel.find({}, (error, blogs) => {
                if (error) reject(error);
                resolve(blogs);
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

    addPostMapper(post) {
        return {
            ...post,
            createdAt: moment().unix(),
            modifiedAt: moment().unix(),
            creator: 'polsastre3@gmail.com',
            creatorName: 'Jose Pol',
            comments: 0
        }
    }
}

module.exports = BlogService;