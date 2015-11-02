'use strict';

//var md5 = require('MD5');
var db = mongodb.getDb();

module.exports.getUserlist = function (req, res) {
	db.collection('user').find({}).toArray(function(err, result) {
		if (err) throw err;
		//console.log("Record added as "+result[0]._id);
		res.json(result);
	});
};

module.exports.getAgentlist = function (req, res) {
	db.collection('user').find({userType:'Agent'}).toArray(function(err, result) {
		if (err) throw err;
		//console.log("Record added as "+result[0]._id);
		res.json(result);
	});
};

module.exports.getAgentDrop = function (req, res) {
	db.collection('user').find({active:1, userType:'Agent'}, {_id:1, empID:1, firstName:1, lastName:1, Email:1}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getuserByID = function (req, res) {
	var postDate = req.body;
	db.collection('user').findOne({empID: postDate.id},function(err, result) {
		if (err) throw err;
		console.log(result);
		res.json(result);
	});
};

module.exports.createUser = function(req, res){
	//simple json record
	var postDate = req.body;
	//var passHash = createHash(postDate.password);
	var userData = {
		empID:postDate.empID,  
		firstName:postDate.firstName, 
		lastName:postDate.lastName, 
		Email:postDate.Email,  
		password:postDate.password,  
		realPass:postDate.password, 
		Phone:postDate.Phone,
		country:postDate.country,
		username:postDate.username,   
		Appraiser:postDate.reportingTl, 
		Reviewer:postDate.reportingTM,   
		language:postDate.language,
		role:postDate.role, 
		userType:postDate.userType,
		accountType:postDate.accountType,  
		active:1,
		logStatus:0,
		createdDate: new Date()
	};
	//insert record
	db.collection('user').insert(userData, function(err, result) {
		if (err) throw err;
		//console.log("Record added as "+result[0]._id);
		res.json(result);
	});

	/*db.collection('test').insert(document, function(err, records) {
		if (err) throw err;
		console.log("Record added as "+records[0]._id);
	});*/
};

module.exports.updateUser = function(req, res){
	//simple json record
	var postDate = req.body;
	//var passHash = createHash(postDate.password);
	var userData = {
		firstName:postDate.firstName, 
		lastName:postDate.lastName, 
		Email:postDate.Email,  
		Phone:postDate.Phone,
		country:postDate.country,  
		Appraiser:postDate.reportingTl, 
		Reviewer:postDate.reportingTM,   
		language:postDate.language,
		role:postDate.role, 
		userType:postDate.userType,
		accountType:postDate.accountType, 
	};
	//insert record
	db.collection('user').update({empID:postDate.empID},{$set: userData}, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.chkEmpIdExist = function (req, res) {
	var resCnt = {};
	db.collection('user').find({ empID: req.body.empID}).count(function (err, exist) {
		if(exist > 0) {
			resCnt = {valid:false};
			res.json(resCnt);
		} else {
			resCnt = {valid:true};
			res.json(resCnt);
		}
	});
};

module.exports.chkEmailExist = function (req, res) {
	var resCnt = {};
	db.collection('user').find({ Email: req.body.Email}).count(function (err, exist) {
		if(exist > 0) {
			resCnt = {valid:false};
			res.json(resCnt);
		} else {
			resCnt = {valid:true};
			res.json(resCnt);
		}
	});
};

// Generates hash using md5
/*var createHash = function(pass){
	return md5(pass);
}*/



