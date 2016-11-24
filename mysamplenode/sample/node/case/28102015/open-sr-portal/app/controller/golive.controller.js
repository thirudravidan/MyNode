'use strict';
var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, alasql = require('alasql')
, moments = require('moment')
, func = require('../config/func')
, sendMails = require('./mailtemplate.controller');

module.exports.getGoliveMaster =function (req,res){
	// var postData=req.body;
	// db.query('SELECT * FROM t_golive_mas AS GM LEFT JOIN t_golive_mod_details AS GMT ON GMT.golive_id_fk = GM.golive_id_pk WHERE project_id_fk = ?',[postData.projectID] ,function(err, goliveres) {
	// 	if (err) {
	// 		throw err;
	// 	}else{
	// 		res.json(goliveres);
	// 	}
	// });
	var postData = req.body, resutSet = {}, sqlStr ='';
	sqlStr = 'SELECT * FROM t_golive_mas AS GM LEFT JOIN t_golive_mod_details AS GMT ON GMT.golive_id_fk = GM.golive_id_pk WHERE project_id_fk = ?';
	
	var options = {sql: sqlStr, nestTables: true};
    var nestingOptions = [
        { tableName : 'GM', pkey: 'golive_id_pk'},        
        { tableName : 'GMT', pkey: 'golive_mod_id_pk', fkeys:[{table:'GM',col:'golive_id_fk'}]}        
    ];
	var query = db.query(options,[postData.projectID] ,function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};

module.exports.saveGoliveModule = function (req,res){
	var postData = req.body;
	var query = db.query('SELECT golive_id_pk FROM t_golive_mas WHERE project_id_fk = ?',[postData.projectID], function(err, result) {
		if (err){throw err;}
		else{				
			if (result.length > 0) {
				if (postData.module_id == 0) {
					var moddet={
						golive_mod_name : postData.module_Name,
						golive_mod_desc : postData.module_desc,
						golive_mod_status : postData.module_status,
						fail_resolve_hrs : postData.fail_resolve_status,
						golive_id_fk : result[0].golive_id_pk,
						created_by : postData.userID,
						created_date : moments().format('YYYY-MM-DD HH:mm:ss')
					};
					db.query('INSERT INTO t_golive_mod_details SET ?',moddet, function(err, result) {
						if (err){throw err;}
						else{				
							res.json({'modStatus':true});	
						} 
					});
				}else{
					db.query('UPDATE t_golive_mod_details SET golive_mod_name=? ,golive_mod_desc=?,golive_mod_status=?,fail_resolve_hrs=? WHERE golive_mod_id_pk =?',[postData.module_Name,postData.module_desc,postData.module_status,postData.fail_resolve_status,postData.module_id], function(err, result) {
						if (err){throw err;}
						else{				
							res.json({'modStatus':true});	
						} 
					});
				}
			}else{
				var modmas={
						project_id_fk : postData.projectID,
						email_status : 0,
						created_by : postData.userID,
						created_date : moments().format('YYYY-MM-DD HH:mm:ss')
					};
				db.query('INSERT INTO t_golive_mas SET ?',modmas, function(err, masres) {
					if (err){throw err;}
					else{				
						var moddet={
							golive_mod_name : postData.module_Name,
							golive_mod_desc : postData.module_desc,
							golive_mod_status : postData.module_status,
							fail_resolve_hrs : postData.fail_resolve_status,
							golive_id_fk : masres.insertId,
							created_by : postData.userID,
							created_date : moments().format('YYYY-MM-DD HH:mm:ss')
						};
						db.query('INSERT INTO t_golive_mod_details SET ?',moddet, function(err, result) {
							if (err){throw err;}
							else{				
								res.json({'modStatus':true});	
							} 
						});	
					} 
				});
			}
		} 
	});
};

module.exports.deleteGolivemod = function (req,res){
	var postData = req.body;
	db.query('DELETE FROM t_golive_mod_details WHERE golive_mod_id_pk =?',[postData.modID], function(err, result) {
		if (err){throw err;}
		else{				
			res.json(result);	
		} 
	});	
};

module.exports.getTokenUser = function (req, res) {
	var postData = req.body, resutSet = {};
	//select record
	var query = db.query("SELECT UM.user_id_pk AS id, CONCAT(UM.first_name,' ',UM.last_name) AS name, UM.email FROM t_user_mas AS UM INNER JOIN t_user_project_map PM ON PM.user_id_fk = UM.user_id_pk WHERE (UM.first_name LIKE '%"+postData.query+"%' OR UM.last_name LIKE '%"+postData.query+"%') AND STATUS = 1 AND UM.user_role_id_fk !=1 AND PM.project_id_fk =? ",[postData.projectID], function(err, result) {	
		if (err){throw err;} else{
			res.json(result);	
		}		
	});
};

module.exports.mailToUser = function (req, res) {
	var postData = req.body, resutSet = {},userMapDet=[],userDet,complete=0;
	var finalSet = function (mailids) {
		var query=db.query('INSERT INTO t_golive_user_map(golive_id_fk,user_id_fk,user_email,created_by,created_date) VALUES ?', [userMapDet], function(err, result) {
			if (err) {
				throw err;
			}else{
				_this.sendGoliveMail(postData,mailids);
				res.json({'goliveStatus':true});
			}
		});				
	};
	var query = db.query("UPDATE t_golive_mas SET email_status=1 WHERE project_id_fk = ? ",[postData.projectID], function(err, result) {	
		if (err){throw err;} else{
			var maillst = '';
			postData.mailUser.forEach(function (val, key) {
				maillst +=(maillst == '') ? '' : ';';
				maillst+=val.email;
				complete++;	
				userDet=[postData.masID,val.id,val.email,postData.userID,moments().format('YYYY-MM-DD HH:mm:ss')];
				userMapDet.push(userDet);
				if (complete === postData.mailUser.length) {									
					finalSet(maillst);
				}
			});	
		}		
	});
};

module.exports.sendGoliveMail = function (data,mailLst) {	
	var mapObj,mailTemp;
	mapObj = {
		   '#ProjectName#': data.projectName
		};
	mailTemp = 'goliveheadsuptpl';
	var mailData = {
		'to': mailLst, //'thirumaran.dhanapal@csscorp.com', //mailLst
		'replace': mapObj
	};
	sendMails.sendEmail(mailTemp, mailData, function (result1) {
	});
};