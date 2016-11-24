'use strict';
var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, multer = require('multer')
, path = require('path')
, filePath = path.resolve(__dirname, '..')
, userDb = 't_user_mas'
, divisionDb = 't_division_mas'
, userTypeDb = 't_user_type_mas'
, userDivMap = 't_division_user_map';

filePath = path.join(filePath, '/upload/userprofile/');

var upload = multer({ dest: filePath,
    rename : function (fieldname, filename, req, res) {
        return filename;
        //return  req.body.caseID
    },
    onFileUploadComplete: function (file, req, res) {
    	return file;
    }
});

module.exports.uploadprofilePic = function (req, res) {

	upload(req, res, function (err) {
		if(err) throw(err);
		var uploadFiles = req.files;
		// postData.srcfile = uploadFiles.file.name;
		// postData.destLoc = postData.Types;
		//var destination = postData.destLoc + '/' + postData.srcfile + '_' + moment() + '.json';
		var postData = req.body;
		res.json(postData);
		
	});
};

module.exports.getUser = function (req, res) {
	var postData = req.body, resutSet = {};
	//select record
	var query = db.query('SELECT um.*, utm.user_type_id_pk, utm.user_type_name, GROUP_CONCAT(dm.division_name SEPARATOR ",") AS division_name, GROUP_CONCAT(CONVERT(dm.division_id_pk, CHAR(8)) SEPARATOR ",") AS division_id FROM '+userDb+' AS um LEFT JOIN '+userDivMap+' AS dum ON dum.user_id_fk = um.user_id_pk LEFT JOIN '+divisionDb+' AS dm ON dm.division_id_pk = dum.division_id_fk LEFT JOIN '+userTypeDb+' AS utm ON utm.user_type_id_pk = um.user_type_id_fk GROUP BY um.user_id_pk ORDER BY um.user_id_pk DESC', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.defaultSet = function (req, res) {
	var postData = req.body, resultSet = {};
	var query = db.query('SELECT * FROM '+divisionDb, function(err, divRes) {
		if (err) throw err;
		resultSet.division = divRes;
		db.query('SELECT * FROM '+userTypeDb, function(err, uTypeRes) {
			if (err) throw err;
			resultSet.userType = uTypeRes;
			res.json(resultSet);
		});
	});
};

module.exports.userRole = function (req, res) {
	db.query('SELECT `user_role_id_pk`,`user_role_name` FROM `t_user_role_mas` WHERE `status` = 1', function(err, usrRes) {
			if (err) throw err;			
			res.json(usrRes);
	});
};


module.exports.createUser = function (req, res) {
	var postData = req.body, mapData = [];
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var userData = {
		first_name:postData.firstName,
		last_name:postData.lastName,
		email:postData.email,
		password:'password',
		mobile_no:postData.mobileNo,
		user_type_id_fk:postData.userType,
		user_role_id_fk:postData.usrRole,
		status:(postData.status === true)?1:0,
		created_date: new Date(),
		created_by:1,
		updated_date: new Date(),
		updated_by:1,
		profilepicurl : postData.profileURL
	};
	//insert record
	var query = db.query('INSERT INTO '+userDb+' SET ?', userData, function(err, result) {
		if (err) throw err;
		if(result) {
			postData.division.forEach(function (value, key) {
				mapData.push([result.insertId, value]);
			});
			db.query('INSERT INTO '+userDivMap+' (user_id_fk, division_id_fk) VALUES ?', [mapData], function(err, divRes) {
				if (err) throw err;
				res.json(result);
			});
		}
	});
};

module.exports.updateUser = function (req, res) {
	var postData = req.body, mapData = [];
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var userData = {
		first_name:postData.firstName,
		last_name:postData.lastName,
		email:postData.email,
		mobile_no:postData.mobileNo,
		user_type_id_fk:postData.userType,
		user_role_id_fk:postData.usrRole,
		status:(postData.status === true)?1:0,
		updated_date: new Date(),
		updated_by:1,
		profilepicurl : postData.profileURL
	};
	//update record
	db.query('DELETE FROM '+userDivMap+' WHERE user_id_fk = ?', postData.id); // 
	var query = db.query('UPDATE '+userDb+' SET ? WHERE user_id_pk = ?', [userData, postData.id], function(err, result) {
		if (err) throw err;
		if(result) {
			postData.division.forEach(function (value, key) {
				mapData.push([postData.id, value]);
			});
			db.query('INSERT INTO '+userDivMap+' (user_id_fk, division_id_fk) VALUES ?', [mapData], function(err, divRes) {
				if (err) throw err;
				res.json(result);		
			});
		}
	});
};

module.exports.updateUserStatus = function(req, res){
	//simple json record
	var postData = req.body;
	var status = 1;
	if(postData.status === 1) status = 0;
	var unitData = {
		status:status
	};
	//Update status
	var query = db.query('UPDATE '+userDb+' SET ? WHERE user_id_pk = ?', [unitData, postData.id], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};


module.exports.getmapProjects = function (req,res){
	var postData = req.body;
	var division;
	// if(util.isArray(postData.divisionID)) {
	// 	division = postData.divisionID.toString();
	// }
	var query = db.query('SELECT * from (SELECT PM.project_id_pk ,CONCAT(PM.project_name," (",DM.division_name,")") AS project_name,PM.`division_id_fk` FROM `t_project_mas` PM INNER JOIN t_division_mas DM ON DM.division_id_pk = PM.`division_id_fk` WHERE PM.`division_id_fk` in ('+postData.divisionID+') ) as temp WHERE project_id_pk NOT IN (SELECT `project_id_fk` FROM `t_user_project_map` WHERE `user_id_fk` =?)', [postData.userId], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getTokenUser = function (req, res) {
	var postData = req.body, resutSet = {};
	//select record
	var query = db.query("SELECT user_id_pk as id, CONCAT(first_name,' ',last_name) as name, email FROM "+userDb+" WHERE (first_name LIKE '%"+postData.query+"%' OR last_name LIKE '%"+postData.query+"%')", function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getMappedProjDetails = function (req,res){
	var postData = req.body;
	var query = db.query('SELECT user_id_fk,PM.project_id_pk,PM.project_name,DM.division_name FROM `t_user_project_map` UPM INNER JOIN t_project_mas PM on PM.project_id_pk = UPM.`project_id_fk` INNER JOIN t_division_mas DM ON DM.division_id_pk = UPM.`division_id_fk` WHERE `user_id_fk` =? ORDER BY project_id_fk DESC', [postData.userID], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getAllUser = function (req, res) {
	var postData = req.body, resutSet = {};
	//select record
	var query = db.query("SELECT user_id_pk as id, CONCAT(first_name,' ',last_name) as name, email FROM "+userDb, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.saveUserProjectMap = function (req, res) {
	var postData = req.body;
	var projectmapData = {
		user_id_fk :postData.UserID,
		project_id_fk :postData.projectID,
		division_id_fk :postData.divisionID
	};
	//select record
	var query = db.query("INSERT INTO t_user_project_map SET ?",projectmapData, function(err, result) {
		if (err) throw err;
		res.json({"mapres" : true});
	});
};


module.exports.getUserACLList = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query("SELECT BM.bucket_name,MM.module_name,UAT.* FROM t_user_acl_trans UAT INNER JOIN t_module_mas MM ON MM.module_id_pk =UAT.module_id_pk INNER JOIN t_bucket_mas BM ON BM.bucket_id_pk= MM.bucket_id_fk WHERE UAT.user_id_pk =? AND UAT.project_id_fk=?",[postData.userID,postData.projectID], function(err, result){
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getACLMaster = function (req, res) {
	//select record
	var query = db.query("SELECT acl_id_pk,acl_name FROM t_acl_list_mas", function(err, result){
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateProjectACL = function (req, res) {
	var postData = req.body;
	var sqlquery='UPDATE t_user_acl_trans SET acl_id_pk = ? WHERE user_id_pk = ? AND module_id_pk =?';
	if (postData.projectID !== null) {
		sqlquery+=' AND project_id_fk ='+postData.projectID;
	}
	else{
		sqlquery+=' AND project_id_fk IS NULL';
	}
	var query = db.query(sqlquery,[postData.aclID,postData.userID,postData.moduleID], function(err, result){
		if (err) throw err;
		res.json({'res' :true});
	});
};

module.exports.getUserAdminACL = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query("SELECT BM.bucket_name,MM.module_name,UAT.* FROM t_user_acl_trans UAT INNER JOIN t_module_mas MM ON MM.module_id_pk =UAT.module_id_pk INNER JOIN t_bucket_mas BM ON BM.bucket_id_pk= MM.bucket_id_fk WHERE UAT.user_id_pk =? AND UAT.project_id_fk IS NULL",[postData.userID], function(err, result){
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getUserRole = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query("SELECT user_role_name FROM t_user_role_mas WHERE user_role_id_pk =?",[postData.roleID], function(err, result){
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getActiveCDMEmployee = function (req, res) {
	mysqldb.connectToCDMServer( function( err ) {
		var cdmdb =mysqldb.getCDMDb();
		var postData = req.body;
		//select record
		// SELECT Emp_Name,Mobile_No,Office_Email FROM tbl_cdm_emp_mas where Emp_Status=1
		// var query = cdmdb.query("SELECT Emp_Name,Mobile_No,Office_Email FROM tbl_cdm_emp_mas where Emp_Status=1 and Emp_Name LIKE '" + postData.empName + "%'", function(err, result){
			var query = cdmdb.query("SELECT Emp_Name,Emp_Code,Mobile_No,Office_Email FROM tbl_cdm_emp_mas where Emp_Status=1", function(err, result){
			if (err) throw err;
			res.json(result);
		});
	});
};

module.exports.updateprofileurl = function (req, res) {
	var postData = req.body, resutSet = {};
	//select record
	var query = db.query('UPDATE t_user_mas SET profilepicurl = ? WHERE user_id_pk =?',[postData.profilePath,postData.userID], function(err, result) {
		if (err) throw err;
		res.json({'status':true});
	});
};

module.exports.getUserDashboard = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT DM.db_id_pk,DM.db_name,DUM.STATUS FROM t_dashboard_mas AS DM INNER JOIN t_user_dashboard_map AS DUM ON DUM.db_id_fk = DM.db_id_pk AND DM.STATUS =1 WHERE DUM.user_id_fk = ?',[postData.userID], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateDashBoardStatus = function(req, res){
	//simple json record
	var postData = req.body;
	var status = 1;
	if(postData.status === 1) status = 0;
	var uptData = {
		STATUS:status
	};
	//Update status
	var query = db.query('UPDATE t_user_dashboard_map SET ? WHERE user_id_fk = ? AND db_id_fk = ?', [uptData, postData.userID,postData.dashBoardID], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getUserNotifications = function(req, res){
	//simple json record
	var postData = req.body;	
	//Update status
	var query = db.query('SELECT * FROM t_notifications WHERE is_read=0 AND user_id_fk = ? ORDER BY notification_type,created_date DESC', [postData.userID], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.readNotification = function(req, res){
	//simple json record
	var postData = req.body;	
	//Update status
	var query = db.query('UPDATE t_notifications SET is_read =1 WHERE notificatoin_id_pk = ?', [postData.notifyID], function(err, result) {
		if (err) throw err;
		res.json({'res':true});
	});
};