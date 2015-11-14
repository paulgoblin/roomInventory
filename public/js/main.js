'use strict';

$(document).ready(init);

function init() {
  $('.jumbotron.rooms').on('click','.room', editRoom);
  $('.addItem').click(addItem);
  $('.addRoom').click(addRoom);
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
  //drawitem
  })
  .fail(function(err){
    console.error(err);
    swal({
      title: "Error Posting!",
      text: "check console logs",
      type: "error",
      confirmButtonText: "Cool"
    });
  });

}

function editRoom(e){
  let roomId = $(e.target).closest('.room').data('mongoid')
}

function addItem(e){
  let $form = $(e.target).closest('.itemForm');
  console.log('form grouP: ', $form)
  let item = {};

  item.name = $form.find('.itemName').val();
  item.value = $form.find('.itemValue').val();
  item.description = $form.find('.itemDescrip').val();

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
      text: "check console logs",
      type: "error",
      confirmButtonText: "Cool"
    });
  });

}



