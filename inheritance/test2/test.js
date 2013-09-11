


var controllers = require('./controllers');


controllers.auth.login("It works!");

var next = controllers.auth.login;
next ("It doesn't work!");