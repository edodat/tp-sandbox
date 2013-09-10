
// constructor
function Singleton(){
    this.message = 'i am the only one';
}

// methods
Singleton.prototype.printMessage = function(){
    console.log(this.message);
};

// export singleton instance
module.exports = new Singleton();