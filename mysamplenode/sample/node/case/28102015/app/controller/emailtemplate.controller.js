'use strict';

var objectID = require('mongodb').ObjectID;
var db = mongodb.getDb();
var moment = require('../public/lib/js/jQuery/moment');

module.exports.getMaillist = function (req, res) {
	db.collection('email_content').find({}).toArray(function(err, result) {
		if (err) throw err;

		res.json(result);
	});
};

module.exports.createMail = function(req, res){
	//simple json record
	var postDate = req.body;
	var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var mailData = {
		eTitle:postDate.eTitle,  
		eSubject:postDate.eSubject, 
		eMessage:postDate.eMessage, 
		eMailid:postDate.eMailid,  
		eMailkey:postDate.eMailkey,  
		eStatus:(postDate.eStatus === true)?1:0,
		createdDate: new Date(),
		createdBy:(postDate.createdBy)?postDate.createdBy:'Admin'
	};
	//insert record
	db.collection('email_content').insert(mailData, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateMail = function(req, res){
	//simple json record
	var postData = req.body;
	var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var mailData = {
		eTitle:postData.eTitle,  
		eSubject:postData.eSubject, 
		eMessage:postData.eMessage, 
		eMailid:postData.eMailid,  
		eMailkey:postData.eMailkey,  
		eStatus:(postData.eStatus === true)?1:0,
		updatedDate: new Date(),
		updatedBy:(postData.createdBy)?postData.createdBy:'Admin'
	};
	//insert record
	db.collection('email_content').update({_id: objectID(postData.id)},{$set: mailData}, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateMailStatus = function(req, res){
	//simple json record
	var postData = req.body;
	var status = 1;
	if(postData.status === 1) status = 0;
	var mailData = {
		eStatus:status
	};
	//insert record
	db.collection('email_content').update({_id: objectID(postData.id)},{$set: mailData}, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.chkTicketIDExist = function (req, res) {
	var resCnt = {};
	db.collection('casetracker').find({ ticketNo: req.body.ticketno}).count(function (err, exist) {
		if(exist > 0) {
			resCnt = {valid:false};
			res.json(resCnt);
		} else {
			resCnt = {valid:true};
			res.json(resCnt);
		}
	});
};

module.exports.getmailByID = function (req, res) {
	var postDate = req.body;
	db.collection('email_content').findOne({_id: objectID(postDate.id)},function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateComments = function(req, res){
	//simple json record
	var postDate = req.body;

	var caseData = {
		comments:postDate.comments, 
		rating:parseInt(postDate.rating), 
		updatedBy:'Admin',  
		updatedDate: new Date() 
	};
	//update record
	db.collection('casetracker').update({_id: objectID(postDate.id)},{$set: caseData}, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};


