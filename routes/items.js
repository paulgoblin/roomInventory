'use strict';

var express = require('express');
var router = express.Router();

var Item = require('../models/item');
// console.log("ITEMS",Item.find())

router.get('/', function( req, res ) {
  Item.find({}, function(err, items){
    res.status(err ? 400 : 200).send(err ? "item get failed" : items);
  }).sort('value');
});

router.get('/:id', function(req,res){
  console.log('id: ', req.params.id)
  Item.Update(req.params.id, function(err, item){
    res.status(err ? 400 : 200).send(err ? "item get failed" : item);
  })
})

router.put('/:id', function(req,res){
  // req.body  {value: 1000} || {name: "new name"}
  console.log('id: ', req.params.id)
  console.log('req: ', req.body)
  Item.findByIdAndUpdate(req.params.id, {$set: req.body}, function(err, item) {

    res.status(err ? 400 : 200).send(err ? "item update failed" : item);
  });
});

router.delete('/:id', function(req,res){
  console.log('id: ', req.params.id)
  Item.remove({ _id: req.params.id }, function(err) {
    res.status(err ? 400 : 200).send(err ? "item remove failed" : "item deleted");
  });
});

router.post('/', function(req,res){
  Item.create(req.body, function(err,item){
    console.log(item)
    res.status(err ? 400 : 200).send(err || item);
  });
  // Item.addItem(req.body, function(err){
  //   res.satus(err ? 400 : 200).send(err || 'item saved');
  // });
})

module.exports = router;

