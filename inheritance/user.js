
// constructor
function User(name){
    this.name = name;
    this.role = 'guest';
}

// methods
User.prototype.printName = function() {
    console.log(this.name);
}

User.prototype.printRole = function() {
    console.log(this.role);
}

// export class
module.exports = User;