var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox/',
  defaults:{
    username: ''
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox/',

  loadMsgs: function(){
    this.fetch({data: { order: '-createdAt'}});
  },

  parse: function(response,options){
    var results = [];
    for( var i=response.results.length-1;i>=0;i--){
      results.push(response.results[i]);
    }
    return results;
  }
});


var MessageView = Backbone.View.extend({
  tagName: 'blink',
  template: _.template('<a class="username" href="#"><%- username %></a> : <%- text %><br>'),
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('sync',this.render,this);
  },
  render: function(){
    this.$el.find('blink').remove();
    this.collection.forEach(this.renderMessage,this);
  },
  renderMessage: function(message){
    var messageView = new MessageView({model:message});
    this.$el.prepend(messageView.render());
  }

});

var FormView = Backbone.View.extend({
  events: {
    'submit #sender' : 'handleSubmit'
  },

  handleSubmit: function(e){
    e.preventDefault();
    var $text = this.$('#formMsg').val();
    var $name = this.$('#formName').val();

    this.collection.create({
      username: $name,
      text: $text
    });

    this.$('#formMsg').val('');
    this.$('#formName').val('');
  }

});


var Room = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox/',
  defaults: {
    roomname: ''
  }
});


var Rooms = Backbone.Collection.extend({
  model: Room,
  url: 'https://api.parse.com/1/classes/chatterbox/',

  parse: function(response,options){

    return response.results;
  }
});

var RoomView = Backbone.View.extend({
  tagName: 'blink',
  template: _.template('<a class="roomID" href="#"><%- roomname %></a><br>'),
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});


var RoomsView = Backbone.View.extend({
  render: function(){

  }
});




$(document).ready(function(){
  var messages = new Messages();
  messages.loadMsgs();
  var messagesView = new MessagesView({el: $('#chats'), collection:messages});
  var formView = new FormView({el: $('#main'), collection:messages});
  setInterval(messages.loadMsgs.bind(messages),3000);

});
