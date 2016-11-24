'use strict';

// var db = mongodb.getDb()
var objectId = require('mongodb').ObjectID
, db = mongodb.getDb();


module.exports.getCaseDetails = function (req, res) {
	console.log('Get Called');
	var postData =req.body;
	db.collection('casetracker').find({empID:'108770'}).toArray(function(err, casedet) {
		if (err)throw err;
		res.json(casedet[0]);
	});
};

module.exports.getCaseByCaseID = function (req, res) {
	console.log('post Called');
	var postData =req.body;
	db.collection('casetracker').find({caseId:postData.caseId}).toArray(function(err, casedet) {
		if (err)throw err;
		mongodb.closeDb();
		res.json(casedet[0]);
	});
};