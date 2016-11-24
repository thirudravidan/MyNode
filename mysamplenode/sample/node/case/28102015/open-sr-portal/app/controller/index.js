'use strict';

var dashData = {};
var passport = require('passport');
var fs = require('fs');
var fsDomain = require('../config/domainUtil.js');

var _this = module.exports;

var render = function (data, res) {
	res.render(data.url, data.data);
};

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
};

var isLoggedIn = function (req, res, next) {
	
};

module.exports.isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		sessionStore[req.user.emp_id] = req.user;
		return next();
	}
	res.redirect('/');
};

module.exports.login = function (req, res) {
	if(req.isAuthenticated()) {
		_this.dashboard(req, res);
	} else {
		var postData = req.body, 
		result = {url: 'login', data : { message : req.flash('message')} };
		render(result, res);
	}
};

module.exports.logout = function (req, res) {
	//sessionStore.splice(req.user._id, 1);
	//delete sessionStore[req.user._id];
	req.logout();
	res.redirect('/');
};

module.exports.dashboard = function (req, res) {
	// mysqldb.connectToServer(function (err) {
	// 	var project = require('./project.controller')
	//  	project.getProject( function(err, result) {
			var result = {url: 'index', data : { user: JSON.stringify(req.user)} };
			render(result, res);
// 	    });
//     });
};

module.exports.home = function (req, res) {
	var valu = '';
	dashData.user = (valu = JSON.stringify(req.user)) ? valu : '';
	var result = {url: 'index', data : { message: req.flash('message')} };
	render(result, res);
};

module.exports.methodCall = function (req, res) {
	//Based on the param import that controller
	delete req.body._csrf;
    mysqldb.connectToServer(function (err) {
		var genericController = {};
		// Checks File is Locations
		var location = settings.getGlobbedFiles('app/controller/' + req.params.action + '.controller.js', 'app/controller/');
		if (location[0] !== '') {
			genericController = require('./' + location[0]);
			if (genericController.hasOwnProperty(req.params.method)) {
				genericController[req.params.method](req, res);
				delete require.cache[require.resolve('./' + location[0])];
			} else {
				res.json('Invalid Request');
			}
		}
    });
};