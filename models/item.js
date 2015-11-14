'use strict';

var mongoose = require('mongoose');

let Item;

let itemSchema = mongoose.Schema({
  name: {type: String, required: true},
  value: {type: Number, required: true},
  description: String,
  createdAt: {type: Date, required: true, default: new Date()}
});


Item = mongoose.model('Item', itemSchema);

module.exports = Item;
