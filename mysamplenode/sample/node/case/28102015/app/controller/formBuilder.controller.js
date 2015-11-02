'use strict';

var db = mongodb.getDb();

module.exports.getFormlist = function (req, res) {
	db.collection('formBuilder').find({}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateFormlist = function(req, res){
	//simple json record
	var postData = req.body;
	var status = 1;
	if(postData.status === 1) status = 0;
	var frmData = {
		status:status
	};
	//insert record
	db.collection('formBuilder').update({formId:postData.formId},{$set: frmData}, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getFormView = function (req, res) {
	var postData = req.body;
	db.collection('formBuilder').find({formId: parseInt(postData.formId)}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.storeForm = function (req, res) {
	var postData = req.body;
	var counters = db.eval('counter("formBuilder")', function(err, result) {
		if (err) throw err;
		postData.createdDate = new Date();
		postData.formId = result.seq;
		//insert record
		db.collection('formBuilder').insert(postData, function(err, result) {
			if (err) throw err;
			//console.log("Record added as "+result[0]._id);
			res.json(result);
		});
	});
};

module.exports.updateForm = function (req, res) {
	var postData = req.body;

	var frmData = {
		formId : postData.formId,
		formName : postData.formName,
		formMenu : postData.formMenu,
		formBuild : postData.formBuild,
		status : postData.status
	};
	db.collection('formBuilder').update({formId : postData.formId}, {$set:frmData},  function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};