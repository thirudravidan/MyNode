'use strict';

var db = mongodb.getDb();
var moment = require('../public/lib/js/jQuery/moment');
 
 module.exports.getagingelist = function (req,res) {  
	var counters = db.eval('casetracker()', function(err, result) {
		if (err) throw err;  
		res.json(result._firstBatch); 
	}); 
}; 