var express = require('express')
, http = require('http')
, app = express()
, server = http.createServer(app)
, io = require('socket.io').listen(server);

io.set('log level',2);

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.redirect('/editable.html');
});


io.of('/project').on('connection', function (socket) {

	console.log(socket.id, 'connected');

	// send ack and broadcast on client joining project
	socket.on('join', function(data){
		socket.join(data.project);
		socket.emit('join-ack', {client: socket.id, data: data});
		// broadcast new joiner ID
		socket.broadcast.to(data.project).emit('join', {client: socket.id, data: data}, function(data){
			// collect current updates and send to new joiner
			socket.emit('edit', {client: socket.id, data: data});
		});
		socket.set('project', data.project, function(){
			console.log(socket.id, 'joined', data.project);			
		});
	});
	
	// send ack on edition request
	socket.on('edit-req', function (data) {
		socket.emit('edit-ack', {client: socket.id, data: data});
		console.log('Edit requested by', socket.id);
	});

	// broadcast update started
	socket.on('edit', function (data) {
		socket.get('project', function(err, project) {
			socket.broadcast.to(project).emit('edit', {client: socket.id, data: data});
			console.log('Edit by', socket.id);
		});
	});

	// broadcast update ended
	socket.on('save', function (data) {
		socket.get('project', function(err, project) {
			socket.broadcast.to(project).emit('save', {client: socket.id, data: data});
			console.log('Save by', socket.id, 'with', data);
		});
	});
	
	// broadcast disconnection
	socket.on('disconnect', function(){
		socket.get('project', function(err, project) {
			socket.broadcast.to(project).emit('left', {client: socket.id});
			socket.leave(project);
		});
	})
});

server.listen(80);
