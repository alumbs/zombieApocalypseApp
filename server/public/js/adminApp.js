/**
 * Created by chibs on 28/06/14.
 */
App = Ember.Application.create({LOG_TRANSITIONS: true});

App.IndexController = Ember.Controller.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    socket: '',
    clientMessage: '',
    chatBox: '',
    initializeSocket: function(context){
        var socket = io('http://localhost:8080');
        console.log('Admin socket connected');

        socket.on('news', function (data) {
            console.log(data['news']);
            alert('News received: ' + data['news']);
        });

        socket.on('chatMsg', function(data){
            var chatMsg = context.get('chatMessage');
            //context.set('chatMessage', chatMsg + '\n' + data['chatMsg']);
            var chatMsgBox = document.getElementById("chatMsgBox");
            chatMsgBox.innerHTML += data['chatMsg'] + "<br/>" ;
        });

        //assign the socket created to this
        context.set('socket', socket);
    },
    actions: {
        messageButtonClick: function()
        {
            var socket = this.get('socket');
            var message = this.get('clientMessage');
            console.log('Button got clicked ' + message);

            socket.emit('sendMessageToAllClients', {message: message});
        },
        chatButtonClick: function()
        {
            var socket = this.get('socket');
            var message = this.get('chatBox');

            if(message.length > 0)
            {
                console.log('Chat button got clicked ' + message);

                socket.emit('chatMsg', {chatMsg: message});

                var chatMsg = this.get('chatMessage');
                //this.set('chatMessage', chatMsg + '\n' + message);
                var chatMsgBox = document.getElementById("chatMsgBox");
                chatMsgBox.innerHTML += message + "<br/>";
            }
        }
    }
});