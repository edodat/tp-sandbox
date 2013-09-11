function Controller(){

}

Controller.prototype.unauthorized = function(data){
    console.log('unauthorized '+data);
}

module.exports = Controller;