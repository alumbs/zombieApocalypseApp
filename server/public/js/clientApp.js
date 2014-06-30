App = Ember.Application.create({LOG_TRANSITIONS: true});

App.IndexController = Ember.Controller.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    socket: '',
    adminMessage: '',
    chatBox: '',
    initializeSocket: function(context){
        console.log('setup controller called');
        var socket = io('http://localhost:8080');

        socket.on('news', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });

        socket.on('chatMsg', function(data){
            var chatMsg = context.get('chatMessage');
            //context.set('chatMessage', chatMsg + '\n' + data['chatMsg']);
            var chatMsgBox = document.getElementById("chatMsgBox");
            chatMsgBox.innerHTML += data['chatMsg'] + "<br/>" ;
        });

        socket.on('allClients', function (data) {

            context.set('adminMessage', data['news']);
            alert(data['news']);
        });

        context.set('adminMessage', "Messages from the admin get placed here");

        //assign the socket created to this
        context.set('socket', socket);
    },
    actions: {
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