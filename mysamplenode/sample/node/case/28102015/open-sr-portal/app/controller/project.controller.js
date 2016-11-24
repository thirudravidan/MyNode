'use strict';

var db = mysqldb.getDb()
, _this = module.exports;


module.exports.getAllProject = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_project_mas', function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});
};

module.exports.getProject = function (res) {
	var query = db.query('SELECT * FROM t_project_mas', function(err, result) {
		res(err, result)
	});
};

module.exports.getClients = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT `client_id_pk` as ClientID,`client_name` as ClientName FROM `t_client_mas` WHERE status=1', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getDevisions = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT `division_id_pk` as DevisionID,`division_name` as DevisionName FROM `t_division_mas` WHERE status=1', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getLocations = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT `location_id_pk` as LocationID,`location_name` as LocationName FROM `t_location_mas` WHERE status=1', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getTemplates = function (req, res) {
		//select record
	var query = db.query('SELECT `tpl_id_pk` as TempID,`tpl_name` as TempName FROM `t_project_plan_tpl_mas` WHERE `status` = 1', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getActiveProjects = function (req, res) {
	var postData =req.body;
	var query = db.query('SELECT PM.project_id_pk AS projID,CONCAT(PM.project_name," ( ",DM.division_name," )") AS ProjName,PM.logo_path,PM.go_live_date FROM `t_project_mas` PM INNER JOIN t_division_mas DM ON DM.division_id_pk = PM.`division_id_fk` INNER JOIN t_user_project_map UPM ON UPM.project_id_fk = PM.project_id_pk AND UPM.user_id_fk = ?',[postData.userID] ,function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getUserAclMenu = function (req, res) {
	var postData =req.body;
	var query = db.query('SELECT * FROM t_user_acl_trans WHERE project_id_fk=2 OR (user_id_pk =? AND project_id_fk IS NULL)',[postData.userID] ,function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getUserRoleMenu = function (req, res) {
	var postData =req.body;
	var query = db.query('SELECT * FROM t_user_role_module_map WHERE user_role_id_fk = ?',[postData.usrroleID] ,function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getUserMenu = function (req, res) {
	var postData =req.body;
	var query = db.query('SELECT PM.go_live_date,UCL.division_id_fk,COALESCE(UCL.project_id_fk,0) AS project_id_fk, UCL.user_id_pk,UCL.module_id_pk, UCL.acl_id_pk, BM.bucket_name, MM.module_name,MM.actual_name,MM.routing_path, BM.icon FROM t_user_acl_trans UCL LEFT JOIN t_module_mas MM ON MM.module_id_pk=UCL.module_id_pk LEFT JOIN t_project_mas AS PM ON PM.project_id_pk =UCL.project_id_fk LEFT JOIN t_bucket_mas BM ON BM.bucket_id_pk=MM.bucket_id_fk WHERE UCL.user_id_pk= ?',[postData.userID] ,function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getBUMaster = function (req, res) {
	//select record
	var query = db.query('SELECT bu_id_pk,bu_name FROM t_bu_mas WHERE STATUS=1', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getTimeZoneDet = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT timezone_id_pk,country_name FROM t_timezonedet_mas WHERE STATUS=1', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};