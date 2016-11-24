'use strict';
var db = mysqldb.getDb()
, _this = module.exports
, multer = require('multer')
, path = require('path')
, filePath = path.resolve(__dirname, '..')
, func = require('../config/func.js')
, tbl_capex_mas = 't_capex_opex_trans_mas'
, tbl_capex_trans = 't_capex_opex_trans';
var sendMails = require('./mailtemplate.controller');

filePath = path.join(filePath, '/upload/capex/');

var upload = multer({ dest: filePath,
    rename : function (fieldname, filename, req, res) {
        return filename;
        //return  req.body.caseID
    },
    onFileUploadComplete: function (file, req, res) {
    	return file;
    }
});

module.exports.getCapex = function (req, res) {
	var postData = req.body;
	//select record
	var prjId = postData.prjId;
	//project_id_fk t_co_trans_mas_id_pk t_capex_total t_opex_total t_capex_opex_total created_by updated_by created_date updated_date
	var query1 = db.query('SELECT COUNT(*) as cnt FROM '+tbl_capex_mas+' WHERE project_id_fk='+prjId+'', function(err, result1) {
		if (err) throw err;
		if(result1[0].cnt == 0) {
			var sql = "INSERT INTO "+tbl_capex_mas+" (project_id_fk,t_capex_total,t_opex_total,t_capex_opex_total,created_by,updated_by,created_date,updated_date) VALUES ?";
			var values = [[prjId, 0, 0, 0, 1, 1, new Date(), new Date()]];
			var query2 = db.query(sql, [values], function(err,result2) {
			    var mainSql = "SELECT * FROM  "+tbl_capex_mas+" t1 LEFT JOIN "+tbl_capex_trans+" t2 ON t2.t_co_trans_mas_id_fk = t1.t_co_trans_mas_id_pk WHERE t1.project_id_fk="+prjId;

				var options = {sql: mainSql, nestTables: true};

			    var nestingOptions = [
			        { tableName : 't1', pkey: 't_co_trans_mas_id_pk'},
			        { tableName : 't2', pkey: 't_co_trans_id_pk', fkeys:[{table:'t1',col:'t_co_trans_mas_id_fk'}]}
			    ];

				var query = db.query(options, function(err, results) {
					if (err) throw err;
					var nestedRows = func.convertToNested(results, nestingOptions);
					
					res.json(nestedRows);
				});
			});
		} else {
			var mainSql = "SELECT * FROM  "+tbl_capex_mas+" t1 LEFT JOIN "+tbl_capex_trans+" t2 ON t2.t_co_trans_mas_id_fk = t1.t_co_trans_mas_id_pk WHERE t1.project_id_fk="+prjId;

			var options = {sql: mainSql, nestTables: true};

		    var nestingOptions = [
		        { tableName : 't1', pkey: 't_co_trans_mas_id_pk'},
		        { tableName : 't2', pkey: 't_co_trans_id_pk', fkeys:[{table:'t1',col:'t_co_trans_mas_id_fk'}]}
		    ];

			var query = db.query(options, function(err, results) {
				if (err) throw err;
				var nestedRows = func.convertToNested(results, nestingOptions);
				
				res.json(nestedRows);
			});
		}
	});
};

module.exports.uploadDoc = function (req, res) {
	upload(req, res, function (err) {
		if(err) throw(err);

		var uploadFiles = req.files;
		var postData = req.body;
		postData.srcfile = uploadFiles.file.name;
		postData.destLoc = postData.Types;
		// var destination = postData.destLoc + '/' + postData.srcfile + '_' + moment() + '.json';
		res.json(postData);
		
	});
};

module.exports.saveCapexTrans = function (req, res) {
	var postData = req.body;
	var prjId = postData.project_id_fk;
	var capexData = {
		t_co_trans_mas_id_fk:postData.t_co_trans_mas_id_fk,  
		t_co_serial_no:postData.t_co_serial_no,   
		item_desc:postData.item_desc,   
		item_qty:postData.item_qty,   
		unit_cost:postData.unit_cost,   
		total:(postData.item_qty * postData.unit_cost),   
		delivery_date:postData.delivery_date,   
		comments:postData.comments,   
		seat_cost:postData.seat_cost, 
		status:0, 
		ctype:postData.ctype
	};
	
	//insert record
	if(postData.id[0] === "n") {
		capexData['filename'] = (postData.file !== '')?postData.file:'';
		var sql = "INSERT INTO "+tbl_capex_trans+" SET ? ";
		var query = db.query(sql, capexData, function(err, resulto) {
			if (err) throw err;
			sql = "UPDATE "+tbl_capex_mas+" t1 INNER JOIN (SELECT `t_co_trans_mas_id_fk`, SUM(total) as ototal FROM "+tbl_capex_trans+" WHERE ctype='capex') t2 ON t1.t_co_trans_mas_id_pk = t2.t_co_trans_mas_id_fk INNER JOIN (SELECT `t_co_trans_mas_id_fk`, SUM(total) as ototal FROM "+tbl_capex_trans+" WHERE ctype='opex') t3 ON t1.t_co_trans_mas_id_pk = t3.t_co_trans_mas_id_fk SET t1.t_capex_total = t2.ototal, t1.t_opex_total = t3.ototal, t1.t_capex_opex_total = (t2.ototal + t3.ototal) WHERE t1.project_id_fk=?";

			var queryRes = db.query(sql, [prjId], function(err, result) {
				if (err) throw err;
				
				res.json(resulto);
			});
		});
	} else {
		if(postData.file != "") {
			capexData['filename'] = postData.file;
		}
		var sql = "UPDATE "+tbl_capex_trans+" SET ? WHERE t_co_trans_id_pk = ? ";
		var query = db.query(sql, [capexData,postData.id], function(err, resulto) {
			if (err) throw err;

			sql = "UPDATE "+tbl_capex_mas+" t1 INNER JOIN (SELECT `t_co_trans_mas_id_fk`, SUM(total) as ototal FROM "+tbl_capex_trans+" WHERE ctype='capex') t2 ON t1.t_co_trans_mas_id_pk = t2.t_co_trans_mas_id_fk INNER JOIN (SELECT `t_co_trans_mas_id_fk`, SUM(total) as ototal FROM "+tbl_capex_trans+" WHERE ctype='opex') t3 ON t1.t_co_trans_mas_id_pk = t3.t_co_trans_mas_id_fk SET t1.t_capex_total = t2.ototal, t1.t_opex_total = t3.ototal, t1.t_capex_opex_total = (t2.ototal + t3.ototal) WHERE t1.project_id_fk=?";

			var queryRes = db.query(sql, [prjId], function(err, result) {
				if (err) throw err;
				
				res.json(resulto);
			});
		});
	}
};

module.exports.saveCapexStatus = function (req, res) {
	var postData = req.body;
	//select record
	var upArr = {};
	upArr[postData.field] = postData.status;
	if(postData.field == 'status' && postData.status === 2) {
		upArr['status_comments'] = postData.scomments;
	}
	var query = db.query('UPDATE '+tbl_capex_trans+' SET ? WHERE t_co_trans_id_pk = ?', [upArr,postData.pid], function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});
};

module.exports.signOffCapex = function (req, res) {
	var postData = req.body;
	var usrData = req.user;
	//select record
	var signoffData = {
		bucket_from : postData.bucket_from,
		bucket_to : postData.bucket_to,
	}
	var query = db.query('UPDATE '+tbl_capex_mas+' SET ? WHERE t_co_trans_mas_id_pk = ?', [signoffData,postData.id], function(err, result) {
		if (err) throw err;
		postData.usrRoleId = postData.bucket_to;
		postData.usrRoleName = (postData.bucket_to == 1)?'SR Manager':(postData.bucket_to == 7)?'Finance':(postData.bucket_to == 6)?'IT Manager':(postData.bucket_to == 9)?'MIS':'Agent';
		_this.sendMailTo(postData,'capex');

		res.json(result);
	});
};

module.exports.sendMailTo = function (pData,type) {
	var projectID = pData.prjId;
	var query = db.query('SELECT GROUP_CONCAT(UM.email SEPARATOR ";") as Receipients FROM t_user_mas AS UM INNER JOIN t_user_project_map PM ON PM.user_id_fk = UM.user_id_pk WHERE UM.user_role_id_fk = ? AND PM.project_id_fk =? GROUP BY PM.project_id_fk',[pData.usrRoleId,projectID], function(err, result) {
			if (err){throw err;}
			else{
				if (result.length > 0) {
					var mapObj,mailTemp;
					if (type === 'capex') {
						mapObj = {
						   '#PROJECT_NAME#':pData.prjName,
						   '#ROLE_NAME#':pData.usrRoleName
						};
						mailTemp = 'capextpl';
					} 
					console.log(result[0].Receipients);
					var mailData = {
						'to':result[0].Receipients, //result[0].Receipients
						'replace': mapObj
					};

					sendMails.sendEmail(mailTemp, mailData, function (result1) { 
					});
				}
				// res.json(result);
			} 
	});
};
