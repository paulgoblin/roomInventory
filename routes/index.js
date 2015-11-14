'use strict';

var express = require('express');
var router = express.Router();

var Item = require('../models/item');
var Room = require('../models/room');

router.get('/', function(req, res) {
  Item.find({}, function (err, items){
    if (err) return res.send('you\'re fucked')
    Room.find({}).populate('items').exec(function (err, rooms) {
      if (err) return res.send('you\'re fucked')
      res.render("index",{title: "Items in rooms", items: items, rooms: rooms});
    }); 
  });
});

module.exports = router;
