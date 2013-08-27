var express = require('express')
, http = require('http')
, app = express()
, server = http.createServer(app);


app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname+'/static'));

app.set('view engine', 'ejs');
app.set('view options', {layout: false});

var ejs = require('ejs');
ejs.open = '<@';
ejs.close = '@>';

app.get('/', function(req, res) {
	res.render('index', {
	    message : 'Yes !'
	});
});

server.listen(80);
