// Generate random errors
if (Math.floor(Math.random() * 4) < 3) {
    console.log('Error for ' + process.pid)
    sdfsdf();
}

require('http').createServer().listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + (process.env.PORT || 80));
});