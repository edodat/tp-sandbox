// INITIALIZATION
var express = require('express')
, http = require('http')
, app = express()
, server = http.createServer(app);

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname+'/static'));

var items = [	{name : 'banana'},
				{name : 'apple'},
				{name : 'orange'},
				{name : 'strawberry'}];

// main page
app.get('/', function (req, res) {
	res.redirect('/rest.html');
});

//GET ALL
app.get('/items', function (req, res) {
	console.log('GET /items');
	res.send(items);
});

//GET
app.get('/item/:id', function (req, res) {
	var id = req.params.id;
	console.log('GET /item', id);
	res.send(items[id]);
});

// POST
app.post('/item', function (req, res) {
	console.log('POST /item');
	items.push(req.body);
	res.send('ok');
});

// PUT
app.put('/item/:id', function (req, res) {
	var id = req.params.id;
	console.log('PUT /item', id);
	items[id].name = req.body.name;
	res.send(items[id]);
});

// DELETE
app.del('/item/:id', function (req, res) {
	var id = req.params.id;
	console.log('DELETE /item', id);
	delete items[id];
	res.send('ok');
});

server.listen(80);
