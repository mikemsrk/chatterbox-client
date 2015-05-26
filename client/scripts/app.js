// YOUR CODE HERE:
window.alert = function(){};

var app = {

  rooms: [],
  friends: [],
  currentRoom: '',

  init: function(){


    $('.username').on('click',function(e){
          app.addFriend();
    });

    $('#send').submit(app.handleSubmit);

    // Get Messages
    $('.refreshBtn').on('click',function(e){
      e.preventDefault();
      app.fetch('https://api.parse.com/1/classes/chatterbox');
    });

    // Send Messages
    $('#sender').submit(function(e){
      e.preventDefault();
      var name = $(this).serializeArray()[0].value;
      var msg = $(this).serializeArray()[1].value;
      var data = {
        username: name,
        text: msg,
        roomname: app.currentRoom
      };
      app.send(data);
      $(this).closest('form').find("input[type=text]").val("");
    });

    // Create a room
    $('#chatroom').submit(function(e){
      e.preventDefault();
      var chatroom = $(this).serializeArray()[0].value;
      app.addRoom(chatroom);
      $(this).closest('form').find("input[type=text]").val("");
      //entered new chatroom
      //update our global variable to specific chatroom

      //retrieve and filter messages with new GET ajax call
    });

    // Leave current room
    $('#leave').on('click',function(e){
      e.preventDefault();
      $('#room').text("Room: Public");
      $(this).closest('form').find("input[type=text]").val("");
      app.currentRoom = '';
      app.fetch('https://api.parse.com/1/classes/chatterbox');
    });

    //Entering a room
    $('#roomSelect').on('click','.roomID',function(e){
      e.preventDefault();
      //enter room, select by class

      //set currentRoom to currentRoom
      app.currentRoom = $(this).text();
      //remove message body
      app.clearMessages();
      //load only messages with specific roomname
      app.fetch('https://api.parse.com/1/classes/chatterbox');
      //update the room: #room
      $('#room').text('Room: ' + app.currentRoom);

      //when sending message, automatically append w/ that roomname
    });

    //clicking on a friend
    $('#chats').on('click','.username',function(e){
      e.preventDefault();
      var name = $(this).text();
      app.addFriend(name);
      //bold
      app.fetch('https://api.parse.com/1/classes/chatterbox');

    });
  },

  send: function(data){
    $('#chats').prepend('<blink>'+ '<a class="username" href="#">' + data.username + '</a>' + ': ' + data.text +'</blink><br>');

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(url){
    app.clearMessages();

    $.ajax({
      // always use this url
      url: url,
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
        // console.log(data.results);

        if(app.currentRoom !== ''){ // If it's not default.
          // filter the results with only the matching room name.
          data.results = _.filter(data.results,function(obj){
            if(obj.roomname === app.currentRoom) return obj;
          });
        }

        _.each(data.results,function(message){
          //  Escaping the text to be safe
          if(message.username === undefined) message.username = 'none';
          if(message.text === undefined) message.text = 'none';
          message.username = escapeHtml(message.username);
          message.text = escapeHtml(message.text);

          // Push all room names to app.rooms
          if(message.roomname && _.indexOf(app.rooms,message.roomname) === -1){
            app.rooms.push(message.roomname);
          }
          // Add each message to the 'chats' div.
          if(_.contains(app.friends, message.username)){
            $('#chats').append('<blink><a class="username" href="#">' + message.username + '</a>' + ': ' + '<b>'+message.text+'</b>' +'</blink><br>');
          } else {
            $('#chats').append('<blink><a class="username" href="#">' + message.username + '</a>' + ': ' + message.text +'</blink><br>');
          }

        });
        // Add all the rooms to the room list 'roomSelect'.
        _.each(app.rooms,function(room){
          $('#roomSelect').append('<blink>' +'<a class="roomID" href="#">' +room +'</a></blink><br>');
        })

      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  clearMessages: function(){
    $('#chats blink').remove();
    $('#chats br').remove();
    $('#roomSelect blink').remove();
    $('#roomSelect br').remove();
  },

  addMessage: function(obj){
    this.send(obj);
  },

  addRoom: function(room){
    $('#roomSelect').append('<blink>' +'<a class="roomID" href="#">' +room +'</a></blink><br>');
    var msg = {
      username: 'John Dough',
      text: 'Apples',
      roomname: room
    };
    app.send(msg);
  },

  addFriend: function(name){
    $('#friends span').remove();
    if(!_.contains(app.friends,name)){
        app.friends.push(name);
      }
    _.each(app.friends,function(x){
      $('#friends').prepend('<span>'+x+' </span>')
    });
  },

  handleSubmit: function(){

  }

};


$(document).ready(function(){

  window.prompt = function(){};
  window.alert = function(){};
  app.init();

});


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
