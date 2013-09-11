var User = require('./user.js'),
    util = require('util');

// constructor
function AdminUser(name){
    // call parent constructor
    AdminUser.super_.call(this, name);

    this.role = 'admin';
}

// inherit methods
util.inherits(AdminUser, User);

// override
AdminUser.prototype.printName = function() {
    console.log(this.name + ' /' + this.printRole());
}

// export class
module.exports = AdminUser;
