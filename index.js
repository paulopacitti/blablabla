var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var messages =[];

var storeMessage = function(data){
	messages.push(data);
	if(messages.length > 10)
		messages.shift();
};

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('first', function(user){
		socket.broadcast.emit("first", user + " has connected...");
		messages.forEach(function(message){
			socket.emit("message", message);
		});
	});

	socket.on('message', function(msg){
		socket.emit("message", msg);
		socket.broadcast.emit("message", msg);
		storeMessage(msg);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(3000, function(){
	console.log('listening in *:3000')
});