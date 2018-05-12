'use strict'

const BlogModel = require('./blog.model');
const CategoryModel = require('./category.model');

class blogService {
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
}

module.exports = blogService;