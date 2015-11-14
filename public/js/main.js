'use strict';

$(document).ready(init);

function init() {
  $('.item')
  $('.addItem').click(addItem);
  $('.addRoom').click(addRoom);
  $('.jumbotron').on('click','.roomTitle',showEditRoom);
  $('.jumbotron').on('click','.itemTitle',showEditItem);
  $('.jumbotron').on('click','.editItem',updateItem);
  $('.jumbotron').on('click','.roomSelect',changeRooms);
}

function changeRooms(e){
  let $item = $(e.target).closest(".item");
  let itemId = $item.data("mongoid");
  let curRoomId = $(e.target).closest(".room").data("mongoid");
  let newRoomId = $(e.target).data("mongoid");

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
  //draw item in new room
  if (curRoomId!=0){
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
  $form.fadeToggle()
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
    // let itemId = data._id;
    // let looseItemsId = '5646cc3b3c7c1611e5ae1452';
    //add item to 'loose items' room

    let $item = $('#sample').clone().removeAttr('id');
    $item.data('mongoid',data._id);
    $item.find('.itemTitle').text(data.name);
    $item.find('.descrip').text(data.description);
    $item.find('.value').text(data.value);
    $('#looseItems').append($item);


    // $.ajax({
    //   url:`/rooms/${looseItemsId}/addItem/${itemId}`,
    //   method: "PUT"
    // }).done(function(data){
    //   console.log(data)

    // }).fail(function(err){
    //   console.error(err);
    //   swal({
    //     title: "Error Changing Rooms!",
    //     text: "Refresh and try again",
    //     type: "error",
    //     confirmButtonText: "Ok"
    //   });
    // });

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


