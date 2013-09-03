/**
* Main application script
*
* User: Etienne Dodat
* Date: 29/08/13
*/

////////////////////
// INITIALIZATION //
////////////////////

// WEB SERVER

var https = require('https'),
    express = require('express'),
    fs = require('fs'),
    app = express();

// AUTHENTICATION SERVER

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var login = require('connect-ensure-login');

var oauth2orize = require('oauth2orize'),
    server = oauth2orize.createServer();

///////////////////
// CONFIGURATION //
///////////////////

// WEB SERVER

app.configure(function() {
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret:'Neso6JNebNz8J9'}));

    //debug
    app.use(function(req, res, next) {
        console.log('-- session --');
        console.dir(req.session);
        console.log('-------------');
        next()
    });

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname+'/public'));

    app.use(express.errorHandler());
});

var sslOptions = {
    key: fs.readFileSync('ssl/dev-key.pem'),
    cert: fs.readFileSync('ssl/dev-cert.pem')
};

var swig = require('swig');
app.engine('.html', swig.renderFile);
app.set('view engine', 'html');
app.set('view options', { layout: false }); //Don't allow express to automatically pipe your template into a layout.html file. Setting this to false allows you to properly use {% extends %} and {% block %} tags!
app.set('views', __dirname+'/views');

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
    function(username, password, done) {
//        db.users.findByUsername(username, function(err, user) {
//            if (err) { return done(err); }
//            if (!user) { return done(null, false); }
//            if (user.password != password) { return done(null, false); }
//            return done(null, user);
//        });
        //TODO implement
        return done(null, { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
//    db.users.find(id, function (err, user) {
//        done(err, user);
//    });
    //TODO implement
    return done(null, { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' });
});

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, done) {
    return done(null, client.id);
});

server.deserializeClient(function(id, done) {
//    db.clients.find(id, function(err, client) {
//        if (err) { return done(err); }
//        return done(null, client);
//    });
    //TODO implement
    return done(null, { id: '1', name: 'Samplr', clientId: 'abc123', clientSecret: 'ssh-secret' });
});

/**
 * Handles requests to obtain an implicit grant.
 *
 * Callbacks:
 *
 * This middleware requires an `issue` callback, for which the function
 * signature is as follows:
 *
 *     function(client, user, ares, done) { ... }
 *
 * `client` is the client instance making the authorization request.  `user` is
 * the authenticated user approving the request.  `ares` is any additional
 * parameters parsed from the user's decision, including scope, duration of
 * access, etc.  `done` is called to issue an access token:
 *
 *     done(err, accessToken, params)
 *
 * `accessToken` is the access token that will be sent to the client.
 * Optionally, any additional `params` will be included in the response.  If an
 * error occurs, `done` should be invoked with `err` set in idomatic Node.js
 * fashion.
 *
 * Implicit grants do not include client authentication, and rely on the
 * registration of the redirect URI.  Applications can enforce this constraint
 * in the `validate` callback of `authorization` middleware.
 *
 * Options:
 *
 *     scopeSeparator  separator used to demarcate scope values (default: ' ')
 */

/*server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
    AccessToken.create(client, user, ares.scope, function(err, accessToken) {
        if (err) { return done(err); }
        done(null, accessToken);
    });
}));*/

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectURI` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
//    var code = utils.uid(16)
//
//    db.authorizationCodes.save(code, client.id, redirectURI, user.id, function(err) {
//        if (err) { return done(err); }
//        done(null, code);
//    });
    //TODO implement
    return done(null, 12345);
}));


////////////
// ROUTES //
////////////

app.get('/',
    function(req, res) {
        res.send('OAuth 2.0 Server');
    }
);
app.get('/login',
    function(req, res) {
        res.render('login');
    }
);
app.post('/login',
    passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })
);
app.get('/logout',
    function(req, res) {
        req.logout();
        res.redirect('/');
    }
);
app.get('/account',
    login.ensureLoggedIn(),
    function(req, res) {
        res.render('account', { user: req.user });
    }
);

app.get('/authorize',
    login.ensureLoggedIn(),
    server.authorization(function(clientID, redirectURI, done) {
//        db.clients.findByClientId(clientID, function(err, client) {
//            if (err) { return done(err); }
//            // WARNING: For security purposes, it is highly advisable to check that
//            //          redirectURI provided by the client matches one registered with
//            //          the server.  For simplicity, this example does not.  You have
//            //          been warned.
//            return done(null, client, redirectURI);
//        });
        //TODO implement
        return done(null, { id: '1', name: 'Samplr', clientId: 'abc123', clientSecret: 'ssh-secret' }, redirectURI);
    }),
    function(req, res){
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
);

app.post('/authorize/decision',
    login.ensureLoggedIn(),
    server.decision()
);

//////////////////
// START SERVER //
//////////////////

https.createServer(sslOptions, app).listen(process.env.PORT || 443, function(){
    console.log('Server listening on port ' + (process.env.PORT || 443));
});


