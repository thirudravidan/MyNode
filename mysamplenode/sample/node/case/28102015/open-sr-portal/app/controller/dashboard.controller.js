'use strict';

var db = mysqldb.getDb()
, _this = module.exports
, func = require('../config/func.js')
, util=require('util')
, moments = require('moment')
, multer = require('multer')
, path = require('path')
, alasql = require('alasql')
, filePath = path.resolve(__dirname, '..')
, _this = module.exports;



module.exports.upcomingProjectplan = function (req,res){
	var postData = req.body;
	var prjId = postData.prjId;

	var	start_date = moments(new Date(postData.proStart)).format('YYYY-MM-DD');
	var	end_date = moments(new Date(postData.proEnd)).format('YYYY-MM-DD');

	var query = db.query("SELECT t2.* FROM t_project_plan_mas t1 INNER JOIN `t_project_plan_trans` t2 ON t2.plan_mas_id_fk = t1.project_plan_mas_id_pk WHERE t2.parent_id = 0 AND t1.project_id_fk = "+prjId+" AND t2.start_date BETWEEN '"+start_date+"' AND '"+end_date+"'",function(err, result) {
		if (err) { 
			throw err;
		} else {
			res.json(result);
		}
	});
};

module.exports.highlevelProjectplan = function (req,res){
	var postData = req.body;
	var prjId = postData.prjId;
	db.query("SELECT t2.* FROM t_project_plan_mas t1 INNER JOIN `t_project_plan_trans` t2 ON t2.plan_mas_id_fk = t1.project_plan_mas_id_pk WHERE t2.parent_id != 0 AND t1.project_id_fk = "+prjId+" AND t2.ishighLevelPlan = 1",function(err, result) {
		if (err) { 
			throw err;
		} else {
			res.json(result);
		}
	});
};

module.exports.statusBarMap = function (req,res){
	var postData = req.body;
	var prjId = postData.prjId;
	db.query("SELECT count(*) as cnt, t2.status FROM t_project_plan_mas t1 INNER JOIN `t_project_plan_trans` t2 ON t2.plan_mas_id_fk = t1.project_plan_mas_id_pk WHERE t2.parent_id = 0 AND t1.project_id_fk = "+prjId+" GROUP BY t2.status",function(err, result) {
		if (err) { 
			throw err;
		} else {
			res.json(result);
		}
	});
};

module.exports.statusBarList = function (req,res){
	var postData = req.body;
	var prjId = postData.prjId;
	db.query("SELECT t2.* FROM t_project_plan_mas t1 INNER JOIN `t_project_plan_trans` t2 ON t2.plan_mas_id_fk = t1.project_plan_mas_id_pk WHERE t2.parent_id = 0 AND t2.status = '"+postData.status+"' AND t1.project_id_fk = "+prjId,function(err, result) {
		if (err) { 
			throw err;
		} else {
			res.json(result);
		}
	});
};

module.exports.getGoliveDate =function (req,res){
	var postData = req.body;
	db.query("SELECT PM.*,TZP.country_name AS projloc,TZP.timezone AS ProjTimeZone,TZG.country_name AS Goliveloc,TZG.timezone AS GoliveTimeZone FROM t_project_mas AS PM INNER JOIN t_timezonedet_mas AS TZP ON TZP.timezone_id_pk = PM.prj_loc_timezone_id INNER JOIN t_timezonedet_mas AS TZG ON TZG.timezone_id_pk = PM.prj_golive_timezone_id WHERE PM.project_id_pk =?",[postData.projectID],function(err, result) {
		if (err) { 
			throw err;
		} else {
			res.json(result[0]);
		}
	});
};

module.exports.getBurnDownChart =function (req,res){
	var postData = req.body;
	db.query("CALL burndownchart(?)",[postData.prjId],function(err, result) {
		if (err) { 
			throw err;
		} else {
			res.json(result[0]);
		}
	});
};

module.exports.getStatusBarChart =function (req,res){
	var postData = req.body;
	db.query("CALL statusreportchart(?)",[postData.prjId],function(err, result) {
		if (err) { 
			throw err;
		} else {
			res.json(result[0]);
		}
	});
};

module.exports.updateGoliveDate = function (req, res) {
	var postData = req.body;
	var timeDate = moments(postData.goLiveDate).format('YYYY-MM-DD');
	console.log(timeDate);
	var goliveData = {
		go_live_date:timeDate
	};
	//insert record
	var query = db.query('UPDATE t_project_mas SET ? WHERE project_id_pk = ?', [goliveData,postData.projectID], function(err, result) {
		if (err) throw err;

		res.json(result);
	});
};