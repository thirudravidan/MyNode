'use strict';
var db = mysqldb.getDb()
, _this = module.exports
, alasql = require('alasql');
var sendMails = require('./mailtemplate.controller');

module.exports.getUser = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT user_id_pk,first_name,last_name,email,mobile_no,telephone FROM t_user_mas', function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});
};

module.exports.getTimezone = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT timezone_id_pk, timezone_name FROM t_timezone_mas', function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});
};

module.exports.getComMatrix = function (req, res) {
	var postData = req.body;
	//select record
	var prjId = postData.prjId;

	var query1 = db.query('SELECT COUNT(*) as cnt FROM t_comm_matrix_mas WHERE project_id_fk='+prjId+'', function(err, result1) {
		if (err) throw err;
		if(result1[0].cnt == 0) {
			var sql = "INSERT INTO t_comm_matrix_mas (project_id_fk,comm_matrix_title,client_emailid,email_status,created_by,created_date,updated_by,updated_date,status,internal) VALUES ?";
			var values = [
			    [prjId, 'Client View', '', 0,1,new Date(),1,new Date(),1,2],
			    [prjId, 'CSS Users View', '', 0,1,new Date(),1,new Date(),1,1]
			];
			var query2 = db.query(sql, [values], function(err,result2) {
			    var query = db.query('SELECT tm1.*, tm2.* FROM t_comm_matrix_mas tm1 LEFT JOIN t_comm_matrix_trans tm2 ON tm2.comm_matrix_id_fk = tm1.comm_matrix_id_pk WHERE tm1.project_id_fk='+prjId+' ORDER BY tm1.internal', function(err, result) {
					if (err) throw err;
					
					res.json(result);
				});
			});
		} else {
			var query = db.query('SELECT tm1.*, tm2.* FROM t_comm_matrix_mas tm1 LEFT JOIN t_comm_matrix_trans tm2 ON tm2.comm_matrix_id_fk = tm1.comm_matrix_id_pk WHERE tm1.project_id_fk='+prjId+' ORDER BY tm1.internal', function(err, result) {
				if (err) throw err;
				
				res.json(result);
			});
		}
	});
	/*var query = db.query('SELECT t_comm_matrix_mas.*, t_comm_matrix_trans.* FROM t_comm_matrix_mas tm1 LEFT JOIN t_comm_matrix_trans tm2 ON tm2.comm_matrix_id_fk = tm1.comm_matrix_id_pk WHERE tm1.project_id_fk='+prjId+' ORDER BY tm2.comm_matrix_id_fk', function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});*/
};

module.exports.saveCommTrans = function (req, res) {
	var postData = req.body;
	//comm_matrix_trans_id_pk comm_matrix_id_fk user_id_fk comm_matrix_stkname comm_matrix_role comm_matrix_email   comm_matrix_telephone comm_matrix_mobile comm_matrix_subcomm timezone_id_fk
	var commData = {
		comm_matrix_id_fk:postData.comm_matrix_id_fk,  
		//user_id_fk:postData.user_id_fk,   
		comm_matrix_stkname:postData.comm_matrix_stkname,   
		comm_matrix_role:postData.comm_matrix_role,   
		comm_matrix_email:postData.comm_matrix_email,   
		comm_matrix_telephone:postData.comm_matrix_telephone,   
		comm_matrix_mobile:postData.comm_matrix_mobile,   
		comm_matrix_subcomm:postData.comm_matrix_subcomm,   
		timezone_id_fk:postData.timezone_id_fk
	};
	//insert record
	var firstChar  = postData.id[0];
	if(firstChar === "n") {
		var sql = "INSERT INTO t_comm_matrix_trans SET ?";
		var query = db.query(sql, commData, function(err, result) {
			if (err) throw err;
			postData['insType'] = 'Created';
			_this.sendMailToRow(postData,'commatrix_rowtpl');
			res.json(result);
		});
	} else {
		var sql = "UPDATE t_comm_matrix_trans SET ? WHERE comm_matrix_trans_id_pk = ?";
		var query = db.query(sql, [commData,postData.id], function(err, result) {
			if (err) throw err;
			postData['insType'] = 'Updated';
			_this.sendMailToRow(postData,'commatrix_rowtpl');
			res.json(result);
		});
	}
};

module.exports.updateCommTrans = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var commData = {
		comm_matrix_title:postData.comm_matrix_title
	};
	//insert record
	var query = db.query('UPDATE t_comm_matrix_mas SET ? WHERE comm_matrix_id_pk = ?', [commData,postData.comm_matrix_id_pk], function(err, result) {
		if (err) throw err;

		res.json(result);
	});
};

module.exports.sendMailCommTrans = function (req, res) {
	var postData = req.body;
	var usrData = req.user;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	postData['log_username'] = usrData.first_name;
	_this.sendMailTo(postData,'clientMail', function (result) {
		res.json(result);
	}); 
};

alasql.aggr.GROUP_CONCAT = function(v,s){
    if(typeof s == "undefined" && !s) return v; else return s+';'+v;
};

module.exports.sendMailTo = function (pData,type,callback) {
	var mailTo = '', mapObj = '', mailTemp = '';
	switch(type){
        case 'clientMail':
        	var uEmail = alasql("SELECT '1' as id, text AS email FROM ?",[pData.sEmail]);
			var sEmail = alasql('SELECT GROUP_CONCAT(email) AS emails FROM ? GROUP BY id',[uEmail]);
			
        	mapObj = {
			   '#PROJECT_NAME#':pData.prjName,
			   '#SECTION_NAME#':pData.comName,
			   '#LOG_USERNAME#':pData.log_username
			};
			mailTemp = 'commatrix_cemail';
			mailTo = sEmail[0].emails.replace(";undefined", "");
            break;
    }
    console.log(mailTo);
    var mailData = {
		'to':mailTo, //pData.email
		'replace': mapObj
	};
    sendMails.sendEmail(mailTemp, mailData, function (result1) {
		callback(result1);
	});
};

module.exports.sendMailToRow = function (pData,type) {
	var projectID = pData.prjId;
	var query = db.query('SELECT GROUP_CONCAT(UM.email SEPARATOR ";") as Receipients FROM t_user_mas AS UM INNER JOIN t_user_project_map PM ON PM.user_id_fk = UM.user_id_pk WHERE UM.user_role_id_fk = 1 AND PM.project_id_fk =? GROUP BY PM.project_id_fk',[projectID], function(err, result) {
			if (err){throw err;}
			else{
				if (result.length > 0) {
					var mapObj,mailTemp;
					mapObj = {
					   '#PROJECT_NAME#':pData.prjName,
					   '#SECTION_NAME#':pData.section_name.comm_matrix_title,
					   '#STACKHOLDER_NAME#':pData.comm_matrix_stkname,
					   '#ROLE#':pData.comm_matrix_role,
					   '#OFFICIAL_MAIL#':pData.comm_matrix_email,
					   '#OFFICIAL_PHONE#':pData.comm_matrix_telephone,
					   '#MOBILE#':pData.comm_matrix_mobile,
					   '#SUBCOMM#':pData.comm_matrix_subcomm,
					   '#TIMEZONE#':pData.timezone_name,
					   '#TYPE#':pData.insType
					};
					mailTemp = 'commatrix_rowtpl';
					console.log(result[0].Receipients);
					var mailData = {
						'to':'nagaraj.muthuvaradhan@csscorp.com', //result[0].Receipients
						'replace': mapObj
					};

					sendMails.sendEmail(mailTemp, mailData, function (result1) { 
					});
				}
				// res.json(result);
			} 
	});
};
