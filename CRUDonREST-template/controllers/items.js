/**
 * Administration dashboard controller
 *
 * User: Etienne
 * Date: 16/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var Controller = require('./controller.js'),
    Item = require('../models/item.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var ItemsController = {};
module.exports = ItemsController;

/**
 * Retrieves servers
 */
ItemsController.getItems = function (req, res){
    Item.find({}, Controller.wrapup(res));
};

/**
 * Create server
 */
ItemsController.createItem = function (req, res){
    var server = req.body;
    //TODO do some check
    Item.save(server, Controller.wrapup(res));
};

/**
 * Update server
 */
ItemsController.updateItem = function (req, res){
    var server = req.body;
    //TODO do some check
    Item.save(server, Controller.wrapup(res));
};

/**
 * Delete server
 */
ItemsController.deleteItem = function (req, res){
    var _id = req.params._id;
    //TODO do some check
    Item.remove({ _id: _id}, Controller.wrapup(res));
};


