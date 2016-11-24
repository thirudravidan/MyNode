'use strict';


var fs = require('fs')
, path = require('path')
, _this = module.exports;

module.exports.methodCall = function (req, res) {
	console.log('methodCall called');	
	//Based on the param import that controller
	delete req.body._csrf;    
    mongodb.connectToServer('rokuapi', function (err) {
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

