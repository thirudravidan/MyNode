/*jslint browser: true, devel: true, node: true, ass: true, evil: true, nomen: true, unparam: true, sloppy: true, vars: true, white: true*/
'use strict';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var fs = require('fs');

var app = express();
var csrf = require('csurf');
var setting = require('./app/config/config.js');
var objectID = require('mongodb').ObjectID;
// var caseTrack =require('./app/controller/casetracker.js');
var db;

GLOBAL.mongodb = require('./app/mongoUtil.js');
GLOBAL.settings = setting;
GLOBAL.sessionStore = [];
GLOBAL.subdomains = '';
GLOBAL.MongoClients = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(setting.sessionSecret));
app.use(function (req, res, next) {
    // var subDomain = fsDomain.findSubDomain(req.headers.host);
    // GLOBAL.subdomains = setting.db[subDomain].rule;
    // app.locals.subdomain = setting.db[subDomain].rule;
    //app.locals.jsFiles = app.locals.jsFiles.concat(setting.getRuleModules(subDomain));
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type,Authorization, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

app.use(expressSession({secret: setting.sessionSecret, saveUninitialized: true, resave: true}));
// app.use(csrf());
// app.use(csrf({cookie: true}));


// var csrfValue = function(req) {
//   var token = (req.body && req.body._csrf) || (req.query && req.query._csrf) || (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']);
//   return token;
// };

// app.use(csrf({value: csrfValue}));
// app.use(function(req, res, next) {
//     console.log(csrfValue);
//     // res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.locals._csrf = req.csrfToken();
//     next();
// });

require(path.resolve('./app/routes/route'))(app);

// app.get('/getCases', function(req, res) {
//     console.log('/getCases called');
//     caseTrack.getCaseDetails(req, res);
// });



mongodb.connectToServer('rokuapi', function( err ) {    
    if (err) {
        console.log('Database not connected');
        console.log(err);
        process.exit(1);
      }
    db = mongodb.getDb();     

    var server = app.listen(setting.port, setting.ip, function () {
        var host = server.address().address, ports = server.address().port;
        console.log('Example app listening at http://%s:%s', host, ports);
    });

});

// Error Handler
process.on('uncaughtException', function (err) {
    console.log('Uncaught Error Stack:' + err.stack);
    console.log('Uncaught Error Message:' + err.message);
});

module.exports = app;