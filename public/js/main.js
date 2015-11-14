'use strict';

$(document).ready(init);

function init() {
  $('.addItem').click(addItem);
  $('.addRoom').click(addRoom);
  $('.jumbotron').on('click','.roomTitle',showEditRoom);
  $('.jumbotron').on('click','.itemTitle',showEditItem);
  $('.jumbotron').on('click','.editItem',updateItem);
  // $('.jumbotron').on('click','.editRoom',editItem);


}

function clearForm($form){
  let $inputs = $form.find('input')
  for (var i = 0; i < $inputs.length; i++){ 
    $($inputs[i]).val("")
  }
}

function showEditItem(e){
  let $form = $(e.target).siblings('.form-inline');
  clearForm($form);
  $form.fadeToggle()
}

function updateItem(e){
  let itemId = $(e.target).closest('.item').data('mongoid');
  let $form = $(e.target).closest('.itemForm');
  let item = makeItem($form);
  if (!item) return;
  console.log("item to send: ", item);


  //update to db
  $.ajax({
    url:'/items/' + itemId,
    method: "PUT",
    data: item
  }).done(function(data){
    $form.fadeToggle();
    console.log(data)
    //drawitem
  }).fail(function(err){
    console.error(err);
    swal({
      title: "Error Posting!",
      text: "You should probably fill in the whole form",
      type: "error",
      confirmButtonText: "Ok"
    });
  });

}

function showEditRoom(e){
  let roomId = $(e.target).closest('.room').data('mongoid')
  console.log("room id: ", roomId)
  $(e.target).siblings('.form-inline').fadeToggle();
  populateForm();

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

function makeItem($form){
  let item = {};

  item.name = $form.find('.itemName').val();
  item.value = $form.find('.itemValue').val();
  item.value = item.value.replace(/\$/g,'')
  item.description = $form.find('.itemDescrip').val();

  if (!item.name.match(/\w/)) {
    console.log("give it a name!")
    return;
  }

  return item;
}


function addItem(e){
  let $form = $(e.target).closest('.itemForm');
  let item = makeItem($form);
  if (!item) return;

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



