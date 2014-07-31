//var http = require('http');
var restify = require('restify');
var ecstatic = require('ecstatic');

var port = 8080;
var socketPort = 10089;

var server = restify.createServer();
var io = require('socket.io').listen(socketPort);

server.pre(ecstatic({ root: __dirname + '/public'}));
server.use(restify.queryParser());

server.listen(port, function(){
	console.log('Server started and listening at port ' + port);
});

//whenever a socket connects...
io.sockets.on('connection', function(sock){
	console.log('socket connected');
	if(sock)
	{
		sock.emit('news', { news: 'hello world' });
		
		sock.on('sendMessageToAllClients', function(data)
		{
			console.log('received message for all clients');
			io.sockets.emit('allClients', { news: data['message'] });
		});

        sock.on('chatMsg', function(data){
            console.log('chat message received ' + data['chatMsg']);
            sock.broadcast.emit('chatMsg', data);
        });

        sock.on('emergencyMessage', function(data){
            console.log('emergency message received ' + data['emergency']);
            io.sockets.emit('emergencyMessage', data);
        });

        sock.on('emergencyResolved', function(data){
            console.log('emergency resolved message received ');
            io.sockets.emit('disableEmergencyMessage', data);
        });
	}
});
