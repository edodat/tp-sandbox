var User = require('./user.js'),
    AdminUser = require('./adminUser'),
    singleton = require('./singleton.js'),
    singleton2 = require('./singleton2.js');

var user1 = new User('Bob');
var user2 = new AdminUser('Jake');

user1.printName();
user1.printRole();

user2.printName();
user2.printRole();

singleton.printMessage();
singleton2.printMessage();