
// export singleton instance
module.exports = {
    message : 'i am also the only one',
    printMessage : function(){
        console.log(this.message);
    }
};