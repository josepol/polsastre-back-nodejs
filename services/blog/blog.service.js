'use strict'

const BlogModel = require('./blog.model');

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
}

module.exports = blogService;