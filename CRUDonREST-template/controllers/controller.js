/**
 * Parent controller
 *
 * User: Etienne
 * Date: 10/09/13
 * Time: 15:36
 */

////////////////////
// INITIALIZATION //
////////////////////

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var Controller = {};
module.exports = Controller;

/**
 * Handles success response
 *
 * @param res : HTTP response
 * @param obj : object to return
 */
Controller.success = function (res, obj) {
    res.type('json');
    res.json(obj);
};

/**
 * Handles technical error response
 *
 * @param res : HTTP response
 * @param error : error object
 */
Controller.error = function (res, error) {
    res.type('json');
    res.json(500, { error: error });
};

/**
 * Handles access error response
 *
 * @param res : HTTP response
 * @param message : error message
 */
Controller.unauthorized = function (res, message) {
    res.type('json');
    res.json(401, { error: message });
};

/**
 * Handles resource error response
 *
 * @param res : HTTP response
 * @param message : error message
 */
Controller.notFound = function (res, message) {
    res.type('json');
    res.json(404, { error: message });
};

/**
 * Helper function to use as a last callback before rendering.
 * Controller will check error returned, otherwise returns object.
 *
 * @param res : HTTP response
 */
Controller.wrapup = function (res){
    return function(err, obj){
        if (err) return Controller.error(res, err);
        return Controller.success(res, obj);
    }
};