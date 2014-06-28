//var http = require('http');
var restify = require('restify');

var port = 8080;

var server = restify.createServer();
var io = require('socket.io').listen(server);

server.use(restify.queryParser());

/*
server.get("/initialize", function(request, response, next){
	response.writeHead(200, {});
	response.write('I love you baby!');
	response.end();
	next();
});

server.get("/hello", function(request, response, next){
	console.log('request received from client');
	response.writeHead(200, {});
	response.write('Hello world!');
	response.end({});
	next();	
});

server.get("/katherinebaby", function(request, response, next){
	console.log('Do you love me?');
	response.writeHead(200, {});
	response.write('I love you baby!');
	response.end();
	response.send();
	next();	
});*/

server.listen(port, function(){
	console.log('Server started and listening at port ' + port);
});


//whenever a socket connects...
io.sockets.on('connection', function(sock){
	console.log('socket connected');
	if(sock)
	{
		sock.emit('news', { news: 'hello world' });
		
		sock.on('sendMessageToAllClient', function(data)
		{
			console.log('received message for all clients');
			io.sockets.emit('allClients', { news: data['message'] });
		});
	}	
	//send to all sockets but the new one
		//socket.broadcast.emit('news', { socket: 'initialized' });
		
		//send only to the newly created socket
		//socket.emit('news', {socket: 'initialized'});
		
		//send to all sockets
		//io.sockets.emit('news', { news: 'start a game in 5 seconds' });
});
