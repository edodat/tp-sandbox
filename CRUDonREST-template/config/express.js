module.exports = function (app, express){

    app.enable('trust proxy')
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({secret:'tpsession'}));
    app.use(app.router);
    app.use(express.static(__dirname+'/../public'));
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

};
