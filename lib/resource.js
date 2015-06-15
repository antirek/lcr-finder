'use strict';

var mongoose = require('mongoose');

var ResourceSchema = function (collection) {
    return new mongoose.Schema({
        name: {
          type: String,
          required: true
        },
        status: {
          type: Boolean,
          required: true,
          "default": true
        },
        directions: [
          {
            template: String,
            price: String
          }
        ]
    }, {
        collection: collection
    });

};
module.exports = ResourceSchema;