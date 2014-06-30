//var http = require('http');
var restify = require('restify');
var ecstatic = require('ecstatic');

var port = 8080;

var server = restify.createServer();
var io = require('socket.io').listen(server);

server.pre(ecstatic({ root: __dirname + '/public'}));
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
		
		sock.on('sendMessageToAllClients', function(data)
		{
			console.log('received message for all clients');
			io.sockets.emit('allClients', { news: data['message'] });
		});

        sock.on('chatMsg', function(data){
            console.log('chat message received ' + data['chatMsg']);
            sock.broadcast.emit('chatMsg', data);
        });
        /*
        sock.on('chat', function(data){
            console.log('received message for all clients');
            io.sockets.broadcast('chatM', { news: data['message'] });
        });*/
	}	
	//send to all sockets but the new one
		//socket.broadcast.emit('news', { socket: 'initialized' });
		
		//send only to the newly created socket
		//socket.emit('news', {socket: 'initialized'});
		
		//send to all sockets
		//io.sockets.emit('news', { news: 'start a game in 5 seconds' });
});
