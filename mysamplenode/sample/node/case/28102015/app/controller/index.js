'use strict';

var dashData = {};
var passport = require('passport');
var fs = require('fs');

var render = function(data, res) {
	res.render(data.url, data.data);
};

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
};

var isLoggedIn = function(req, res, next) {
	
};

module.exports.isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()){
		//sessionStore[req.user._id] = req.user;
		return next();
	}
	res.redirect('/');
};

module.exports.login = function(req, res){
	var postData = req.body;
	var result = {url: 'login', data : { message: req.flash('message')}};
	render(result, res);
};

module.exports.logout = function(req, res){
	//sessionStore.splice(req.user._id, 1);
	//delete sessionStore[req.user._id];
	req.logout();
	res.redirect('/');
};

module.exports.dashboard = function(req, res) {
	dashData.projects = {0:'Singpost', 1:'Vonage', 2:'Netgear', 3:'Roku', 4:'Parallels'};
	var result = {url: 'index', data : { data: dashData, message: req.flash('message')}};
	render(result, res);
};

module.exports.home = function(req, res) {
	var valu = '';
	dashData.projects = ['Singpost', 'Vonage', 'Netgear', 'Roku', 'Parallels'];
	dashData.user = (valu=JSON.stringify(req.user))? valu : '';
	var result = {url: 'index', data : { data: dashData, message: req.flash('message')}};
	render(result, res);
};

module.exports.methodCall = function(req, res){
	//Based on the param import that controller
	var genericController = {};
	// Checks File is Locations
	var location = settings.getGlobbedFiles('app/controller/'+req.params.action+'.controller.js', 'app/controller/');
	if(location[0] !== '') {
		genericController = require('./'+location[0]);
		if(genericController.hasOwnProperty(req.params.method)) {
			genericController[req.params.method](req, res);
		} else {
			res.json('Invalid Request');
		}
	}
};