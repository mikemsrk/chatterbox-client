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
        text: msg
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
    });

    //Entering a room
    $('#roomSelect').on('click','.roomID',function(e){
      e.preventDefault();
      //enter room, select by class
      console.log($(this).text());
      //set currentRoom to currentRoom

      //remove message body
      //load only messages with specific roomname
      //when sending message, automatically append w/ that roomname
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
        _.each(data.results,function(message){
          window.alert = function(){};
          if(message.username === undefined || message.username === '' || _.indexOf(message.username,'$') !== -1){
            message.username = 'J. Doe';
          }
          if(message.text === undefined || message.text === '' || _.indexOf(message.text,'$') !== -1){
            message.text = 'Bad Message';
          }
          if(message.roomname && _.indexOf(app.rooms,message.roomname) === -1){
            app.rooms.push(message.roomname);
          }
          $('#chats').append('<blink><a class="username" href="#">' + message.username + '</a>' + ': ' + message.text +'</blink><br>');
        });

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

  addFriend: function(){

  },

  handleSubmit: function(){

  }

};


$(document).ready(function(){

  window.prompt = function(){};
  window.alert = function(){};
  app.init();

});
