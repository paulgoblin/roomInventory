'use strict';

$(document).ready(init);

function init() {
  $('.addItem').click(addItem);
  $('.addRoom').click(addRoom);
  // $('.jumbotron').on('click','.roomTitle',showEditRoom);
  $('.jumbotron').on('click','.itemTitle',showEditItem);
  $('.jumbotron').on('click','.editItem',updateItem);
  $('.jumbotron').on('click','.roomSelect',changeRooms);
  $('.jumbotron').on('click','.delete',deleteItem)
}

function deleteItem(e){
  console.log('Clicked!')
  let $item = $(e.target).closest('.item');
  let itemId = $item.data('mongoid');
  console.log(itemId)

  let $copies = $("[data-mongoid='" + itemId + "']");
  if ($copies) $copies.remove();

  //update to db
  $.ajax({
    url:'/items/' + itemId,
    method: "DELETE"
  }).done(function(data){
    $item.remove();
  }).fail(function(err){
    console.error(err);
    swal({
      title: "Error Deleting!",
      text: "You should probably fill in the whole form",
      type: "error",
      confirmButtonText: "Ok"
    });
  });

}

function changeRooms(e){
  let $item = $(e.target).closest(".item");
  let itemId = $item.data("mongoid");
  let curRoomId = $(e.target).closest(".room").data("mongoid");
  let newRoomId = $(e.target).data("mongoid");

  $("[data-mongoid='" + newRoomId + "']").append($item);
  $item.remove();

  // add Item to room 
  $.ajax({
    url:`/rooms/${newRoomId}/addItem/${itemId}`,
    method: "PUT"
  }).done(function(data){
    console.log(data)

  }).fail(function(err){
    console.error(err);
    swal({
      title: "Error Changing Rooms!",
      text: "Refresh and try again",
      type: "error",
      confirmButtonText: "Ok"
    });
  });


  if (curRoomId!=0 || curRoomId == newRoomId){
    // take item out of room

    $.ajax({
      url:`/rooms/${curRoomId}/removeItem/${itemId}`,
      method: "delete"
    }).done(function(data){
      //remove from DOM
      $item.remove();

    }).fail(function(err){
      console.error(err);
      swal({
        title: "Error Changing Rooms!",
        text: "Refresh and try again",
        type: "error",
        confirmButtonText: "Ok"
      });
    });
  }
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
  $form.slideToggle()
}

function updateItem(e){
  let itemId = $(e.target).closest('.item').data('mongoid');
  let $form = $(e.target).closest('.itemForm');
  let item = makeItem($form);
  if (!item) return;

  //update to db
  $.ajax({
    url:'/items/' + itemId,
    method: "PUT",
    data: item
  }).done(function(data){
    $form.slideToggle();
    console.log(data)
    let items = $("[data-mongoid='" + itemId + "']")

    for(var i = 0; i < items.length ; i ++ ){      
      $(items[i]).data('mongoid',itemId);
      $(items[i]).find('.itemTitle').text(item.name);
      $(items[i]).find('.descrip').text("description: " + item.description);
      $(items[i]).find('.value').text("value: $" + item.value);
    }


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
  $(e.target).siblings('.form-inline').slideToggle();
  populateForm();

}

function addRoom(e) {
  let name = $(e.target).closest('.roomForm').find('.roomName').val();
  console.log(name)
  if (!name.match(/\w/)) {
    console.log("give it a name!")
    return;
  }
  let $form = $(e.target).closest('.roomForm')
  clearForm($form);

  let room = {};
  room.name = name;

  //post to db
  $.post('/rooms', room)
  .done(function(data){
    console.log(data)
    let $room = $('<div>').addClass('room').data('mongoid',data._id);
    let $title = $('<h3>').addClass('roomTitle').text(data.name)
    $room.append($title)
    $('.rooms').append($room)
    
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

    let $item = $('#sample').clone().removeAttr('id');
    $item.data('mongoid',data._id);
    $item.find('.itemTitle').text(data.name);
    $item.find('.descrip').text("description: " + data.description);
    $item.find('.value').text("value: $" + data.value);
    $('#looseItems').append($item);

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


