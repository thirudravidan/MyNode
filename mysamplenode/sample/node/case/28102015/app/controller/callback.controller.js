'use strict';

var db = mongodb.getDb();
var moment = require('../public/lib/js/jQuery/moment');

module.exports.getCallbackcaselist = function (req, res) { 
	db.collection('callbackcases').find({}).toArray(function(err, result) { 
		if (err) throw err;
		res.json(result);
	});
};