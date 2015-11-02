'use strict';

var db = mongodb.getDb();
var moment = require('../public/lib/js/jQuery/moment');

module.exports.getCatlist = function (req, res) {
	var collLis = {};
	db.collection('category').find({}).toArray(function(err, result) {
		if (err) throw err;
		collLis.category = result;
		db.collection('email_content').find({}).toArray(function(err, mailresult) {
			if (err) throw err;
			collLis.email = mailresult;
			res.json(collLis);
		});
	});
};

module.exports.createCate = function(req, res){
	//simple json record
	var postData = req.body;
	console.log(postData);
	var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var counters = db.eval('counter("category")', function(err, result) {
		if (err) throw err;
		var catData = {
			_id:result.seq,  
			name:postData.name, 
			field_name:(postData.name.replace(' ','_')).toLowerCase(),
			type:parseInt(postData.type), 
			parentId:(postData.parentId)? parseInt(postData.parentId) : parseInt(0),
			status:parseInt(postData.status),
			createdDate:timeDate,
			createdBy:postData.createdBy,
			createdByName:postData.createdByName
		};
		//insert record
		db.collection('category').insert(catData, function(err, result) {
			if (err) throw err;
			res.json(result);
		});
	});
};
