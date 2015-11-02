'use strict';

//var md5 = require('MD5');
var objectId = require('mongodb').ObjectID;
var db = mongodb.getDb();

module.exports.getCustomerlist = function (req, res) {
	db.collection('customer').find({}).toArray(function(err, result) {
		if (err) throw err;
		//console.log("Record added as "+result[0]._id);
		res.json(result);
	});
};

module.exports.getAgentlist = function (req, res) {
	db.collection('customer').find({userType:'Agent'}).toArray(function(err, result) {
		if (err) throw err;
		//console.log("Record added as "+result[0]._id);
		res.json(result);
	});
};

module.exports.getcustomerByID = function (req, res) {
	var postDate = req.body;
	db.collection('customer').findOne({_id: objectId(postDate.id)},function(err, result) {
		if (err) throw err;
		console.log(result);
		res.json(result);
	});
};

module.exports.createCustomer = function(req, res){
	//simple json record
	var postDate = req.body;
	//var passHash = createHash(postDate.password);
	var userData = {
		firstName:postDate.firstName, 
		lastName:postDate.lastName,
		primaryphone:postDate.primaryphone,
	    Email:postDate.Email,  
		company:postDate.company,
		city:postDate.city,
		country:postDate.country,    
		state:postDate.state,  
		addressline1:postDate.addressline1, 
		addressline2:postDate.addressline2, 
		zip:postDate.zip, 
		active:1,
		logStatus:0,
		createdDate: new Date()
	};
	//insert record
	db.collection('customer').insert(userData, function(err, result) {
		if (err) throw err;
		//console.log("Record added as "+result[0]._id);
		res.json(result);
	});

	/*db.collection('test').insert(document, function(err, records) {
		if (err) throw err;
		console.log("Record added as "+records[0]._id);
	});*/
};

module.exports.updateCustomer = function(req, res){
	//simple json record
	var postDate = req.body;
	//var passHash = createHash(postDate.password);
	var userData = {
		firstName:postDate.firstName, 
		lastName:postDate.lastName,
		primaryphone:postDate.primaryphone,
		company:postDate.company,
		city:postDate.city,
		country:postDate.country,
		Email:postDate.Email,    
		state:postDate.state,  
		addressline1:postDate.addressline1, 
		addressline2:postDate.addressline2, 
		zip:postDate.zip, 
	};
	//insert record
	db.collection('customer').update({Email:postDate.Email},{$set: userData}, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.chkEmpIdExist = function (req, res) {
	var resCnt = {};
	db.collection('customer').find({ empID: req.body.empID}).count(function (err, exist) {
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
	db.collection('customer').find({ Email: req.body.Email}).count(function (err, exist) {
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



