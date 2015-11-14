'use strict';

var express = require('express');
var router = express.Router();

var Room = require('../models/room');
var Item = require('../models/item');

router.get('/', function( req, res ) {
  Room.find({}).populate('items').exec(function(err,rooms){
    res.status(err ? 400 : 200).send(err ? "room get failed" : rooms);
  });

  // Room.find({}, function(err,rooms){
  //   res.status(err ? 400 : 200).send(err? err.message : rooms);
  // }).populate('items');

  // Room.find({}, function(err,rooms){
  //   res.status(err ? 400 : 200).send(err? err.message : rooms);
  // }).sort(value: 1);
  

})  

router.get('/:id', function(req,res){
  Room.Update(req.params.id, function(err, room){
    res.status(err ? 400 : 200).send(err ? "room get failed" : room);
  })
})

router.put('/:roomId/addItem/:itemId', function(req, res) {
  Room.findById(req.params.roomId, function(err, room){
    if (err) return res.status(400).send(err.message);
    Item.findById(req.params.itemId, function(err, item){
      if (err) return res.status(400).send(err.message);

      if (room.items.indexOf(item._id) !== -1){
        res.status(200).send('item already in room');
      } else {
        room.items.push(item._id);
        room.save(function(err){
          res.status(err ? 400 : 200).send(err ? 'Item add failed' : 'Item added');
        });
      }
      
    })
  })
})

router.delete('/:roomId/removeItem/:itemId', function(req, res) {
  console.log('params', req.params.roomId, req.params.roomId)
  Room.findById(req.params.roomId, function(err, room){
    if (err) return res.status(400).send(err.message);
    Item.findById(req.params.itemId, function(err, item){
      if (err) return res.status(400).send(err.message);
      let itemIndex = room.items.indexOf(item._id);
      if (itemIndex === -1){
        res.status(200).send('item not in room');
      } else {
        room.items.splice(itemIndex,1);
        console.log (room.items)
        room.save(function(err){
          res.status(err ? 400 : 200).send(err ? 'Item add failed' : 'Item added');
        });
      }

    })
  })
})

router.put('/:id', function(req,res){
  // req.body  {value: 1000} || {name: "new name"}
  Room.findByIdAndUpdate(req.params.id, {$set: req.body}, function(err, room) {
    res.status(err ? 400 : 200).send(err ? "room update failed" : room);
  });
});

router.put('/:id', function(req,res){
  Room.remove(req.params.id, function(err) {
    res.status(err ? 400 : 200).send(err ? "room remove failed" : "room deleted");
  });
});

router.post('/', function(req,res){
  console.log('shit worked')
  console.log(req.body)
  Room.create(req.body, function(err, room){
    res.status(err ? 400 : 200).send(err || room);
  });
})

module.exports = router;






