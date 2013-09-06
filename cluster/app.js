// Generate random errors to test respawn by cluster master process
/*if (Math.floor(Math.random() * 4) < 3) {
    console.log('Error for ' + process.pid)
    sdfsdf();
}*/

var server = require('http').createServer();
server.listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + server.address().port);
});