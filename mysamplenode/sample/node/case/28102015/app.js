'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var flash 	 = require('connect-flash');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var app = express();

require('./app/config/init.js')();
var setting = require('./app/config/config.js');
GLOBAL.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sashi.it4@gmail.com',
        pass: 'sashi69175'
    }
});
GLOBAL.mongodb = require('./app/config/mongoUtil.js');
GLOBAL.settings = setting;
GLOBAL.sessionStore = [];

mongodb.connectToServer( function( err) {

	app.locals.jsFiles = setting.getJavaScriptAssets().concat(setting.getJavaScriptModules());
	app.locals.cssFiles = setting.getCSSAssets().concat(setting.getCSSModules());
	app.set('views', path.join(__dirname, './app/views'));
	app.set('view engine', setting.templateEngine);

	app.use(favicon(__dirname + '/app/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, './app/public')));
	//app.use(express.static(path.join(__dirname, './app/lib')));
	app.use(express.static(path.join(__dirname, './app/views')));
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	});

	// Configuring Passport
	app.use(expressSession({secret: setting.sessionSecret, saveUninitialized: true, resave: true}));
	app.use(passport.initialize());
	app.use(passport.session());

	// Using the flash middleware provided by connect-flash to store messages in session
	app.use(flash());

	// Initialize Passport
	var initPassport = require('./app/config/passport.init');
	initPassport(passport);

	//routing the path
	require(path.resolve('./app/routes/route'))(app);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	
	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	var server = app.listen(setting.port, setting.ip, function () {
		var host = server.address().address;
		var port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});

	// Error Handler
	process.on('uncaughtException', function(err) {
	  console.log('Uncaught Error Stack:'+ err.stack);
	  console.log('Uncaught Error Message:'+ err.message);
	});

	module.exports = app;
});// view engine setup

