/**
 * Main application script
 *
 * User: Etienne Dodat
 * Date: 29/08/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var http = require('http'),
    express = require('express'),
    app = express();

var controllers = require('./controllers');
var Model = require('./models/model.js');

///////////////////
// CONFIGURATION //
///////////////////

// Express middleware configuration file
require('./config/express.js')(app, express);

// Converts all incoming "_id" string parameters to MongoDB ObjectIDs
app.param(['_id'], function(req, res, next, _id){
    req.params._id = Model.ObjectId(_id);
    next();
});
app.put('*', function(req, res, next){
    req.body._id = Model.ObjectId(req.body._id);
    next();
});

////////////
// ROUTES //
////////////

app.get('/items', controllers.items.getItems);
app.post('/items', controllers.items.createItem);
app.put('/items/:_id', controllers.items.updateItem);
app.del('/items/:_id', controllers.items.deleteItem);


//////////////////
// START SERVER //
//////////////////

var server = http.createServer(app);
server.listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + server.address().port);
});
