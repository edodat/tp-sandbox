var User = require('./user.js'),
    util = require('util');

// constructor
function AdminUser(name){
    // call parent constructor
    User.call(this, name);

    this.role = 'admin';
}

// inherit methods
util.inherits(AdminUser, User);

// override
AdminUser.prototype.printName = function() {
    console.log(this.name + ' [admin]');
}

// export class
module.exports = AdminUser;
