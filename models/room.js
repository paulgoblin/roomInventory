'use strict';

let mongoose = require('mongoose');

let Room;

let roomSchema = mongoose.Schema({
  name: {type: String, required: true},
  createdAt: {type: Date, required: true, default: new Date()},
  items: [{  type: mongoose.Schema.Types.ObjectId , ref: 'Item', unique:true}]
});


Room = mongoose.model('Room', roomSchema);

module.exports = Room;