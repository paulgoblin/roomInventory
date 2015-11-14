'use strict';

$(document).ready(init);

function init() {
  $('.addItem').click(addItem);
  $('.addRoom').click(addRoom);
  $('.jumbotron').on('click','.roomTitle',editRoom);
  $('.jumbotron').on('click','.itemTitle',editItem);

}

function editItem(e){
  let itemId = $(e.target).closest('.item').data('mongoid')
  console.log("item id: ", itemId)
}

function editRoom(e){
  let roomId = $(e.target).closest('.room').data('mongoid')
  console.log("room id: ", roomId)
}

function addRoom() {
  let name = $('.roomName').val();
  if (!name.match(/\w/)) {
    console.log("give it a name!")
    return;
  }

  let room = {};
  room.name = name;

  //post to db
  $.post('/rooms', room)
  .done(function(data){
    console.log(data)
    
  })
  .fail(function(err){
    console.error(err);
    swal({
      title: "Error Posting!",
      text: "You should probably fill in the whole form",
      type: "error",
      confirmButtonText: "Ok"
    });
  });

}


function addItem(e){
  let $form = $(e.target).closest('.itemForm');
  console.log('form grouP: ', $form)
  let item = {};

  item.name = $form.find('.itemName').val();
  item.value = $form.find('.itemValue').val();
  item.description = $form.find('.itemDescrip').val();

  if (!item.name.match(/\w/)) {
    console.log("give it a name!")
    return;
  }

  item.value.replace(/\$/g,'')

  //post to db
  $.post('/items', item)
  .done(function(data){
    console.log(data)
    //drawitem
  })
  .fail(function(err){
    console.error(err);
    swal({
      title: "Error Posting!",
      text: "You should probably fill in the whole form",
      type: "error",
      confirmButtonText: "Ok"
    });
  });

}



