/**
 * Server model class
 *
 * User: Etienne
 * Date: 17/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var Model = require('./model.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var Item = {};
module.exports = Item;

Model.declare(Item, 'items');

