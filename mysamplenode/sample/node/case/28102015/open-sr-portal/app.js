/*jslint browser: true, devel: true, node: true, ass: true, evil: true, nomen: true, unparam: true, sloppy: true, vars: true, white: true*/
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var compression = require('compression'); // GZIP all assets
var ejs = require('ejs');
var multer = require('multer');
var app = express();
var csrf = require('csurf');

require('./app/config/init.js')();
var setting = require('./app/config/config.js');
var filename = '';


app.use(compression()); 

/*GLOBAL.transporter = nodemailer.createTransport(smtpTransport({
    host: "smtp.office365.com", // hostname
    port: 587,
    auth: {
        user: "nagaraj.muthuvaradhan@csscorp.com",
        pass: "asdf@123"
    }
}));*/

/*GLOBAL.transporter = nodemailer.createTransport("SMTP", {
    host: "smtp.office365.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: "nagaraj.muthuvaradhan@csscorp.com",
        pass: "asdf@123"
    },
    tls: {
        ciphers:'SSLv3'
    }
});*/

GLOBAL.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mnagas@gmail.com',
        pass: 'america321'
    }
});
// GLOBAL.mongodb = require('./app/config/mongoUtil.js');
GLOBAL.mysqldb = require('./app/config/mysqlUtil.js');

GLOBAL.settings = setting;
GLOBAL.sessionStore = [];
GLOBAL.subdomains = '';

//mongodb.connectToServer( function( err) {
//app.locals.jsFiles = setting.getJavaScriptAssets().concat(setting.getJavaScriptModules());
//app.locals.cssFiles = setting.getCSSAssets().concat(setting.getCSSModules());
/*app.set('view options', {
    open: '{$',
    close: '$}'
});*/
ejs.open = '{$'; ejs.close = '$}';
app.set('views', path.join(__dirname, './build'));
app.set('view engine', setting.templateEngine);
app.use('/download', express.static(path.join(__dirname, 'app/upload')));
app.use(favicon(__dirname + '/build/assets/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, './app/lib')));
app.use(express.static(path.join(__dirname, './build')));
app.use(express.static(path.join(__dirname, './build/assets')));
app.use(function (req, res, next) {
    app.locals.timeZone = JSON.stringify(setting.db.timeZone);
    /*mysqldb.connectToServer( function( err ) {
        var project = require('./app/controller/project.controller')
        project.getProject( function(err, result) {
            app.locals.project = result;
        });
    });*/
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});
// Configuring Passport
app.use(expressSession({secret: setting.sessionSecret, saveUninitialized: true, resave: true}));
//app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
app.use(flash());

// csrf token intializing

// var csrfValue = function(req) {
//   var token = (req.body && req.body._csrf)
//     || (req.query && req.query._csrf)
//     || (req.headers['x-csrf-token'])
//     || (req.headers['x-xsrf-token']);
//   return token;
// };

// app.use(csrf({value: csrfValue}));
// app.use(function(req, res, next) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     next();
// });

//Initialize Passport
var initPassport = require('./app/config/passport.init');
initPassport(passport);

//routing the path
/*app.use(multer({
    dest : './app/public/upload/',
    rename : function (fieldname, filename, req, res) {
        return filename;
        //return  req.body.caseID
    },
    onFileUploadComplete: function (file, req, res) {
        //var filename='./public/upload/'+file.name;
        fs.move(file.path, filename, function (err) {
            if (err) {
                throw err;
            }
            console.log('Moved ' + file.path + ' to ' + filename);
        });
        res.json({'responseCode' : 1});
        //res.end('Success.......');
    }
}));
app.post('/upload', function (req, res, next) {
    //res.end('upload');
});*/
require(path.resolve('./app/routes/route'))(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var server = app.listen(setting.port, setting.ip, function () {
    var host = server.address().address, ports = server.address().port;
    console.log('Example app listening at http://%s:%s', host, ports);
});

// Error Handler
process.on('uncaughtException', function (err) {
      // GLOBAL.mysqldb.connectToServer( function( err ) {
      //   console.log('Server Reconnected');
      //   db = GLOBAL.mysqldb.getDb();
      // });
    console.log('Uncaught Error Stack:' + err.stack);
    console.log('Uncaught Error Message:' + err.message);
});

module.exports = app;
//});// view engine setup

