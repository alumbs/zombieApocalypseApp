App = Ember.Application.create({LOG_TRANSITIONS: true});

App.IndexController = Ember.Controller.extend({
    init: function() {
        this.initializeSocket();
    },
    socket: '',
    adminMessage: '',
    initializeSocket: function(){
        console.log('setup controller called');
        var socket = io('http://localhost:8080');

        socket.on('news', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });

        socket.on('allClients', function (data) {
            console.log(data['news']);
            //console.log(data['news'] + " " + adminMessage);
            //controller.set('adminMessage', data);
        });

        //assign the socket created to this
        this.set('socket', socket);
    }
});