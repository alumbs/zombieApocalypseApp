/**
 * Created by chibs on 28/06/14.
 */
App = Ember.Application.create({LOG_TRANSITIONS: true});

App.IndexController = Ember.Controller.extend({
    init: function() {
        this.initializeSocket();
    },
    socket: '',
    clientMessage: '',
    initializeSocket: function(){

        var socket = io('http://localhost:8080');
        console.log('Admin socket connected');

        socket.on('news', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });

        //assign the socket created to this
        this.set('socket', socket);
    },
    actions: {
        messageButtonClick: function()
        {
            var socket = this.get('socket');
            var message = this.get('clientMessage');
            console.log('Button got clicked ' + message);

            socket.emit('sendMessageToAllClients', {message: message});
        }
    }
});