/**
 * Created by chibs on 01/07/14.
 */
App = Ember.Application.create({LOG_TRANSITIONS: true});

/**Global variables */
var socketPort = 10089;
var socket = createSocket(); //create socket

showEmergencyDialog();

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

        socket.on('emergencyMessage', function (data) {
            console.log("Data is: " + data);

            var messageFromServer = data['emergency'];

            // Declare this variable in the same scope as the ajax complete function
            overlay =
                $('<div> ' +
                    '<div id="emergencyMessageBox">EMERGENCY!! STOP THE GAME!! ' +
                        '<br/> ' +
                        messageFromServer +
                    '</div> ' +
                    '<button id="btnEmergencyResolved" onclick="">' +
                        'Emergency Resolved' +
                    '</button> ' +
                '</div>').prependTo('body').attr('id', 'overlay');

            $("#container").css("display", "none");
        });
    },
    clearMessageBox: function(){
        this.set('clientMessage', '');
    },
    actions: {
        messageButtonClick: function()
        {
            //var socket = this.get('socket');
            var message = this.get('clientMessage');
            console.log('Button got clicked ' + message);

            socket.emit('sendMessageToAllClients', {message: message});

            this.clearMessageBox();
        },
        resolveEmergencyButtonClicked: function(){
            console.log("Resolve emergency button clicked");
            socket.emit('emergencyResolved', {});
        }
    }
});
/*
App.RefereeRoute = Ember.Route.extend({

});*/

App.RefereeController = Ember.Controller.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    adminMessage: '',
    initializeSocket: function(context)
    {
        socket.on('emergencyMessage', function (data) {
            console.log(data);

            // Declare this variable in the same scope as the ajax complete function
            overlay = $('<div> <div id="emergencyMessageBox">EMERGENCY!! STOP THE GAME!! <br/> ' +
                data['emergency'] +
                '</div> </div>').prependTo('body').attr('id', 'overlay');

            $("#container").css("display", "none");
        });

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

App.EmergencyController = Ember.ObjectController.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    emergencyMessage: '',
    initializeSocket: function(context)
    {
        //*****remember to remove the overlay div when the admin disables the emergency thing****
        socket.on('disableEmergencyMessage', function (data) {
            $("#overlay").remove();
            $("#container").css("display", "block");
        });
    },
    actions: {
        sendEmergencyMessage: function()
        {
            var message = this.get('emergencyMessage');
            console.log('Button got clicked ' + message);

            socket.emit('emergencyMessage', {emergency: message});
        }
    }
});

App.ChatController = Ember.ObjectController.extend({
    init: function() {
        var context = this;

        this.initializeSocket(context);
    },
    chatBox: '',
    username: '',
    updateChatBox: function(data){
        var chatMsgBox = document.getElementById("chatMsgBox");
        chatMsgBox.innerHTML += data + "<br/>" ;
        console.log('update chat box got called');
    },
    clearChatBox: function(){
        this.set('chatBox', '');
    },
    initializeSocket: function(context)
    {
        socket.on('chatMsg', function(data){
            context.updateChatBox(data['chatMsg']);
        });
    },
    actions: {
        chatButtonClick: function()
        {
            var message = this.get('chatBox');

            console.log('Chat button got clicked ' + message);

            //validate the username and message
            var valid;
            valid = valid = validateAndThrowErr(this.get('username'), "No username specified. Please enter a username");

            if(valid){
                valid = validateAndThrowErr(message, "The chat message entered is invalid. Please enter a valid message");
            }

            if(valid){
                message = this.get('username') + " said: " + message;

                socket.emit('chatMsg', {chatMsg: message});

                this.clearChatBox();

                this.updateChatBox(message);
            }

        }
    }
});

/*Global functions*/
function showEmergencyDialog(){
    $(document).ready(function(){
        $( "#dialog" ).dialog({
            autoOpen: false
        })
    });

}

function closeEmergencyOverlay()
{

}

function createSocket() {
    var sock = io('http://localhost:' + socketPort);

    if (!sock) {
        throw new error('Socket could not be created successfully');
    }

    console.log('Socket created');
    return sock;
}

function validate(data)
{
    if(!data || data == '' || data.length < 1)
    {
        throw new Error('Invalid data passed ' + data);
    }
}

function validateAndThrowErr(data, errMsg)
{
    try{
        validate(data);
    }catch(ioe)
    {
        alert(errMsg + "\n" + ioe);
        return false;
    }
    return true;
}
