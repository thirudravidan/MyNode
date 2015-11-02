'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
// Gear Head Routings
module.exports = function(app) {
	// User Routes
	var index = require('../controller/index');
	// Setting up the users profile api
	app.route('/').get(index.login);
	app.route('/login').get(index.login);
	app.route('/login').post(passport.authenticate('login', {
		successRedirect: '/dashboard', 
		failureRedirect: '/login', 
		failureFlash : true  
	}));
	//app.route('/dashboard').get(index.isAuthenticated, index.dashboard);
	app.route('/dashboard').get(index.home);
	app.route('/caseTracker/:action/:method').post(index.methodCall);
	app.route('/logout').get(index.logout);
};