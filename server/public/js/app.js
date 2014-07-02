/**
 * Created by chibs on 01/07/14.
 */
App = Ember.Application.create({LOG_TRANSITIONS: true});

/**Global variables */
var socketPort = 10089;
var socket = createSocket(); //create socket

App.Router.map(function(){
    this.resource('admin');
    this.resource('referee');
});

/*
App.AdminRoute = Ember.Route.extend({

//});*/

App.AdminController = Ember.Controller.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    clientMessage: '',
    initializeSocket: function(context)
    {
        socket.on('news', function (data) {
            console.log(data['news']);
            alert('News received: ' + data['news']);
        });
    },
    actions: {
        messageButtonClick: function()
        {
            //var socket = this.get('socket');
            var message = this.get('clientMessage');
            console.log('Button got clicked ' + message);

            //console.log("socket contains " + socket);
            socket.emit('sendMessageToAllClients', {message: message});
        }
    }
});
/*
App.RefereeRoute = Ember.Route.extend({

});*/

App.RefereeController = Ember.ObjectController.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    adminMessage: '',
    initializeSocket: function(context)
    {
        socket.on('news', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });

        socket.on('allClients', function (data) {

            context.set('adminMessage', data['news']);
            alert(data['news']);
        });

        context.set('adminMessage', "Messages from the admin get placed here");
    }
});
/*
App.ChatRoute = Ember.Route.extend({

});*/

App.ChatController = Ember.Controller.extend({
    init: function() {
        var context = this;

        this.initializeSocket(context);
    },
    chatBox: '',
    updateChatBox: function(data){
        var chatMsgBox = document.getElementById("chatMsgBox");
        chatMsgBox.innerHTML += data + "<br/>" ;
        console.log('update chat box got called');
    },
    initializeSocket: function(context)
    {
        socket.on('chatMsg', function(data){
            context.updateChatBox(data['chatMsg']);
        });

        socket.on ('messageSuccess', function (data) {
            //do stuff here
            console.log('Message received from the server');
        });
    },
    actions: {
        chatButtonClick: function()
        {
            //var socket = this.get('socket');
            var message = this.get('chatBox');
            var context = this;

            if(message && message.length > 0)
            {
                console.log('Chat button got clicked ' + message);

                socket.emit('chatMsg', {chatMsg: message});

                context.updateChatBox(message);
            }
        }
    }
});

/*Global functions*/
function createSocket() {
    var sock = io('http://localhost:' + socketPort);

    if (!sock) {
        throw new error('Socket could not be created successfully');
    }

    console.log('Socket created');
    return sock;
}
