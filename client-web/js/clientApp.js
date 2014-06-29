App = Ember.Application.create({LOG_TRANSITIONS: true});

App.IndexController = Ember.Controller.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    socket: '',
    adminMessage: '',
    initializeSocket: function(context){
        console.log('setup controller called');
        var socket = io('http://localhost:8080');

        socket.on('news', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });

        socket.on('allClients', function (data) {
            //console.log(data['news']);
            //adminMessage = data['news'];
            //console.log(data['news'] + " " + adminMessage);
            //controller.set('adminMessage', data);
            //var controller = this.get('controller');
            //cont.set('adminMessage', data['news']);
            //cont('Index').get('adminMessage');
            //this.set('adminMessage', data['news']);
            context.set('adminMessage', data['news']);
            alert(data['news']);
            //this.adminMsgBox.set(data['news']);
        });

        context.set('adminMessage', "Messages from the admin get placed here");

        //assign the socket created to this
        context.set('socket', socket);
    }
});