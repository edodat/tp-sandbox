var util = require("util");
var Controller = require('./controller.js');

function AuthController() {
    AuthController.super_.call(this);
}

util.inherits(AuthController, Controller);

AuthController.prototype.login = function(data) {
    console.log(data);
    this.unauthorized(data);
}

module.exports = new AuthController();
