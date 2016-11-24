'use strict';

/**
 * Module dependencies.
 */
// Gear Head Routings
module.exports = function (app) {
	// User Routes
	var index = require('../controller/index');
	
	// Setting up the users profile api
	// app.route('/').get(index.login);
	// app.route('/login').get(index.login);
	// app.route('/login').post(passport.authenticate('login', {
	// 	successRedirect: '/dashboard',
	// 	failureRedirect: '/login',
	// 	failureFlash : true
	// }));

	//app.route('/dashboard').get(index.isAuthenticated, index.dashboard);
	// app.route('/dashboard').get(index.isAuthenticated, index.home);
	// app.route('/csatForm/:caseId/:custId').get(index.csat);
	// app.route('/rmaForm/:caseId/:custId').get(index.rma);
	// app.route('/rokuapi/:action/:method').post(index.methodCall);
	// app.route('/admin/:action/:method').get(index.methodCall);
	// app.route('/rules/:action/:method/:options').get(index.rulesCall); // For rules URL Access
	// app.route('/logout').get(index.logout);
	// router.get('api/getcases/',casectrl.getCaseDetails);
	// router.post('api/getcasesByID',casectrl.getCaseByCaseID);
	app.route('/rokuapi/get/:action/:method').get(index.methodCall);
	app.route('/rokuapi/post/:action/:method').post(index.methodCall);
};