/**
 * Main application script
 *
 * User: Etienne Dodat
 * Date: 29/08/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var https = require('https'),
    express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    app = express();


///////////////////
// CONFIGURATION //
///////////////////

var users = [
    { id: 1, username: 'bob', token: '123456789', email: 'bob@example.com' },
    { id: 2, username: 'joe', token: 'abcdefghi', email: 'joe@example.com' }
];

function findByToken(token, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.token === token) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

// Use the BearerStrategy within Passport.
//   Strategies in Passport require a `validate` function, which accept
//   credentials (in this case, a token), and invoke a callback with a user
//   object.
passport.use(new BearerStrategy(
    function(token, done) {
        // asynchronous validation, for effect...
        process.nextTick(function () {
            // Find the user by token.  If there is no user with the given token, set
            // the user to `false` to indicate failure.  Otherwise, return the
            // authenticated `user`.  Note that in a production-ready application, one
            // would want to validate the token for authenticity.
            findByToken(token, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { scope: 'read' });
            })
        });
    }
));

passport.use('provider', new OAuth2Strategy({
        authorizationURL: 'https://localhost:8082/authorize',
        tokenURL: 'not used with implicit grant scenario',
        clientID: 'application',
        clientSecret: 'not used with implicit grant scenario',
        callbackURL: 'https://localhost:8080/auth/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous validation, for effect...
        process.nextTick(function () {
            // Find the user by token.  If there is no user with the given token, set
            // the user to `false` to indicate failure.  Otherwise, return the
            // authenticated `user`.  Note that in a production-ready application, one
            // would want to validate the token for authenticity.
            findByToken(token, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { scope: 'read' });
            })
        });
    }
));

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'tpsession' }));

//debug
    app.use(function(req, res, next) {
        console.log('-- session --');
        console.dir(req.session);
        console.log('-------------');
        next()
    });

    // Initialize Passport!  Note: no need to use session middleware when each
    // request carries authentication credentials, as is the case with HTTP
    // Bearer.
    app.use(passport.initialize());
    //app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname+'/public'));

    app.use(express.errorHandler());
});

var sslOptions = {
    key: fs.readFileSync('ssl/dev-key.pem'),
    cert: fs.readFileSync('ssl/dev-cert.pem')
};

////////////
// ROUTES //
////////////

app.get('/',
    passport.authenticate('bearer', { failureRedirect: '/auth' }),
    function(req, res){
        res.json({ result : 'ok' });
    }
);

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/callback
app.get('/auth',
    passport.authenticate('provider')
);

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/callback',
    passport.authenticate('provider', { successRedirect: '/', failureRedirect: '/auth' })
);

//////////////////
// START SERVER //
//////////////////

https.createServer(sslOptions, app).listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + (process.env.PORT || 80));
});
