/**
 * Created by chibs on 01/07/14.
 */
App = Ember.Application.create({LOG_TRANSITIONS: true});

/**Global variables */
var socketPort = 10089;
var socket = createSocket(); //create socket

//showEmergencyDialog();

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
            console.log("Data is: " + data['emergency']);

            var messageFromServer = data['emergency'];

            // Declare this variable in the same scope as the ajax complete function
            overlay =
                $('<div> ' +
                    '<div id="emergencyMessageBox">EMERGENCY!! STOP THE GAME!! ' +
                        '<br/> ' +
                        messageFromServer + '<br/>' +
                        '<button id="btnEmergencyResolved" onclick="emergencyResolved()">' +
                            'Emergency Resolved' +
                        '</button> ' +
                    '</div> ' +
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
        }
    }
});

App.RefereeController = Ember.Controller.extend({
    init: function() {
        var context = this;
        this.initializeSocket(context);
    },
    updateMessageBox: function(data){
        var chatMsgBox = document.getElementById("messageBox");

        if(chatMsgBox.innerText == "Messages from the admin get placed here")
        {
            chatMsgBox.innerText = "";
        }

        chatMsgBox.innerHTML += data + "<br/>" ;
        console.log('update message box got called');
    },
    initializeSocket: function(context)
    {
        socket.on('emergencyMessage', function (data) {
            console.log(data['emergency']);

            // Declare this variable in the same scope as the ajax complete function
            overlay = $('<div> <div id="emergencyMessageBox">EMERGENCY!! STOP THE GAME!! <br/> ' +
                data['emergency'] +
                '</div> </div>').prependTo('body').attr('id', 'overlay');

            $("#container").css("display", "none");
            //$("#EmergencyResolvedButton").css("display", "block");
        });

        socket.on('news', function (data) {
            console.log(data);
            alert('News received: ' + data['news']);
        });

        socket.on('allClients', function (data) {
            context.updateMessageBox(data['news']);

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
            alert("EMERGENCY RESOLVED");
            $("#overlay").remove();
            $("#container").css("display", "block");
        });
    },
    actions: {
        sendEmergencyMessage: function()
        {
            var message = this.get('emergencyMessage');
            var valid = validateAndThrowErrMessage(message, "ENTER A VALID ERROR MESSAGE!! DO NOT PLAY WITH THIS BUTTON");

            if(valid)
            {
                console.log('Emergency Button got clicked ' + message);

                socket.emit('emergencyMessage', {emergency: message});
            }
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
            valid = validateAndThrowErrMessage(this.get('username'), "No username specified. Please enter a username");

            if(valid){
                valid = validateAndThrowErrMessage(message, "The chat message entered is invalid. Please enter a valid message");
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

function emergencyResolved()
{
    $(document).ready(function(){
        console.log("Resolve emergency button clicked");
        socket.emit('emergencyResolved', {msg: ""});
    });
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

function validateAndThrowErrMessage(data, errMsg)
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
