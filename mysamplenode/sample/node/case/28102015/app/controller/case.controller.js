'use strict';

var db = mongodb.getDb();
var moment = require('../public/lib/js/jQuery/moment');

var send_mail = function(value, callback) {
	console.log(value);
};

module.exports.getCaselist = function (req, res) {
	db.collection('casetracker').find({}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getCaseById = function (req, res) {
	var postData = req.body;
	db.collection('casetracker').find({caseId:parseInt(postData.caseId)}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getCaseByUser = function (req, res) {
	var postData = req.body;
	db.collection('casetracker').find({empID:postData.empID}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getCaseByCust = function (req, res) {
	var postData = req.body;
	db.collection('casetracker').find({customerId:postData.custId}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.createCase = function(req, res){
	//simple json record
	var postData = req.body;
	var timeDate = new Date();
	//insert record
	var counters = db.eval('counter("case")', function(err, result) {
		if (err) throw err;
		postData.caseId = result.seq;
		postData.empID = parseInt('12345');
		postData.createdDate = timeDate;
		db.collection('casetracker').insert(postData, function(err, result) {
			if (err) throw err;
			if(postData.Callback) {
				var callData = {};
				callData.caseId = result.seq;
				callData.callbackno = postData['Callback Number'];
				callData.callbackowner = postData['Callback Owner'];
				callData.reason = postData['Reason For Callback'];				
				callData.callbackfrmdate = new Date(postData['From DateTime']);
				callData.callbacktodate = new Date(postData['To DateTime']);
				db.collection('callbackcases').insert(callData, function(err, result) {
					if (err) throw err;
					var mailOptions = {
					    from: 'sashi.it4@gmail.com', // sender address 
					    to: 'sashidharan.kanagaraj@csscorp.com', // list of receivers 
					    subject: 'Test', // Subject line 
					    text: 'Hello world ✔', // plaintext body 
					    html: postData['Email Template'] // html body 
					};
					transporter.sendMail(mailOptions, function(error, info){
					    if(error){
					        console.log(error);
					    } else {
					        console.log('Message sent: ' + info.response);
					    }
					});
					res.json(result);
				});
			} else {
				var mailOptions = {
				    from: 'sashi.it4@gmail.com', // sender address 
				    to: 'sashidharan.kanagaraj@csscorp.com', // list of receivers 
				    subject: 'Test', // Subject line 
				    text: 'Hello world ✔', // plaintext body 
				    html: postData['Email Template'] // html body 
				};
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        console.log(error);
				    } else {
				        console.log('Message sent: ' + info.response);
				    }
				});
			}
			res.json(result);
		});
	});
};
