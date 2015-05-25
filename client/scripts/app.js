// YOUR CODE HERE:
$(document).ready(function(){


  var retrieve = function(){

    $('.messages p').remove();
    $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
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
        $('.messages').append('<p>'+ message.username + ': ' + message.text +'</p>');
      });
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
    });
  };


  $('.refreshBtn').on('click',retrieve);

});
