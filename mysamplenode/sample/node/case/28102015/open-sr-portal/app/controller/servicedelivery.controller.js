'use strict';
var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, alasql = require('alasql')
, moments = require('moment')
, func = require('../config/func');

module.exports.getProjectServiceDeleveryDetails =function (req,res){
	var postData=req.body;
	db.query('SELECT * FROM t_service_delivery_trans WHERE project_id_fk=?',[postData.projectID] ,function(err, serdel) {
		if (err) {
			throw err;
		}else{
			res.json(serdel);
		}
	});
};


module.exports.saveMetricsDetails = function (req, res) {
	var postData = req.body;
	if (postData.transID > 0) {
		var qry = db.query('UPDATE t_service_delivery_trans SET service_evaluation= ?,comments=? WHERE service_delivery_trans_id =?',[postData.service_evaluation,postData.comment,postData.transID], function(err, result) {
			if (err){throw err;}
			else{				
				res.json({'servStatus':true});	
			} 		
		});

	}else{
		var metDetails={
			service_delivery_id_fk :postData.metricmasID,
			project_id_fk:postData.projectID,
			service_date : postData.ser_date,
			comments :postData.comment,
			created_by :postData.userID,
			created_date :moments().format('YYYY-MM-DD HH:mm:ss'),
			service_evaluation :postData.service_evaluation
		};
		var query = db.query('INSERT INTO t_service_delivery_trans SET ?',metDetails, function(err, result) {
			if (err){throw err;}
			else{				
				res.json({'servStatus':true});	
			} 
		});
	}
	
};

module.exports.getServiceMetricsMas = function (req, res) {
	var postData =req.body,serMas =[],masDet,complete=0,dataLength=0,dataDefault=[];	
	var finalSet = function () {
		var query=db.query('INSERT INTO t_service_delivery_mas(metrics_name,projict_id_fk,metrics_threshold,created_by,created_date) VALUES ?', [serMas], function(err, result) {
			if (err) {
				throw err;
			}else{
				db.query('SELECT * FROM t_service_delivery_mas WHERE projict_id_fk = ?',[postData.projectID], function(err, serres) {
					res.json(serres);
				});
			}
		});				
	};
	var query = db.query('SELECT * FROM t_service_delivery_mas WHERE projict_id_fk = ?',[postData.projectID], function(err, result) {
		if (err){throw err;}
		else{							
			if (result.length > 0) {
				res.json(result);	
			}else{
				db.query('SELECT metrics_name FROM t_service_del_default', function(err, defres) {
					if (err) {
						throw err;
					}else{
						dataDefault =dataLength=defres;
						dataDefault.forEach(function (val, key) {
							complete++;		
							masDet=[val.metrics_name,postData.projectID,60,postData.userID,moments().format('YYYY-MM-DD HH:mm:ss')];
							serMas.push(masDet);
							if (complete === dataLength.length) {									
								finalSet();
							}
						});
					}
				});
			}
		} 
	});
};

module.exports.saveMetricsName = function (req, res) {
	var postData =req.body;
	if (postData.metricsID > 0) {
		var query = db.query('UPDATE t_service_delivery_mas SET metrics_name= ? WHERE service_delivery_id_pk =? and projict_id_fk =?',[postData.metricsName,postData.metricsID,postData.projectID] ,function(err, result) {
			if (err){throw err;}
			else{				
				res.json({'servStatus':true});	
			} 
		});
	}else{
		var masDet={
			metrics_name : postData.metricsName,
			created_by : postData.userID,
			created_date : moments().format('YYYY-MM-DD HH:mm:ss'),
			metrics_threshold : 60,
			projict_id_fk : postData.projectID
		};
		var query = db.query('INSERT INTO t_service_delivery_mas SET ?',masDet, function(err, result) {
			if (err){throw err;}
			else{				
				res.json({'servStatus':true});	
			} 
		});
	}
	
};

module.exports.updateThresholdValue = function (req, res) {
var postData =req.body;
var query = db.query('UPDATE t_service_delivery_mas SET metrics_threshold= ? WHERE service_delivery_id_pk =? and projict_id_fk =?',[postData.newThreshold,postData.metricsID,postData.projectID] ,function(err, result) {
		if (err){throw err;}
		else{				
			res.json({'servStatus':true});	
		} 
	});
};

module.exports.removeMetrics = function (req, res) {
	var postData =req.body;
	var query = db.query('DELETE FROM t_service_delivery_mas WHERE service_delivery_id_pk=?',[postData.metMasID] ,function(err, result) {
		if (err){throw err;}
		else{				
			res.json({'servStatus':true});	
		} 
	});

};


