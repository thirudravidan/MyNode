'user strict';

var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, alasql = require('alasql')
, moment = require('moment')
, func = require('../config/func')
, positionDb = 't_position_mas'
, resourceDb = 't_resource_details'
, educationDb = 't_resource_details_edu_trans'
, experienceDb = 't_resource_details_emp_trans'
, projectmapDb = 't_resource_project_map'
, assessmentDb = 't_resource_project_assessment_trans'
, attendanceDb = 't_resource_project_attendance_trans'
, assCategoryDb = 't_assessment_ctgy_mas'
, assSubCatDb = 't_assessment_subctgy_mas'
, projectmasDb= 't_project_mas';
var sendMails = require('./mailtemplate.controller');

module.exports.defaultSet = function (req, res) {
	var postData = req.body, resutSet = {};
	var query = db.query('SELECT * FROM '+positionDb, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getFormDefault = function (req, res) {
	var postData = req.body, resutSet = {};
	var query = db.query('SELECT * FROM t_project_mas', function(err, projectMas) {
		if (err) throw err;
		resutSet.projectMas = projectMas;
		db.query('SELECT * FROM t_location_mas', function(err, locationMas) {
			if (err) throw err;
			resutSet.locationMas = locationMas;
			db.query('SELECT * FROM t_division_mas', function(err, divisionMas) {
				if (err) throw err;
				resutSet.divisionMas = divisionMas;
				res.json(resutSet);
			});
		});
	});
};

module.exports.getLocation = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_location_mas', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getDivision = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_division_mas', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};
/* Create Resource/ Recruitment Starts*/

module.exports.createRecruit = function (req, res) {
	var postData = req.body, mapData = [];
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var recruitData = {
		resource_first_name: postData.recruitmentFirstName,
		resource_Last_name: postData.recruitmentLastName,
		resource_dob: moment(postData.recruitmentDob).format('YYYY-MM-DD'),
		resource_gender: 0,
		resource_email: postData.recruitmentEmail,
		position_mas_id_fk: postData.recruitmentPosition,
		resource_interview_date: moment(postData.recruitmentInterview).format('YYYY-MM-DD'),
		resource_address: '',
		interview_status: (postData.status === true)?1:0,
		position_mas_id_fk: postData.recruitmentPosition,
	};
	//insert record
	var query = db.query('INSERT INTO '+resourceDb+' SET ?', recruitData, function (err, result) {
		if (err) throw err;
		if(result.insertId) {
			_this.createEducation(result.insertId, postData.education, res);
			_this.createExperience(result.insertId, postData.experiences, res);
			res.json(result);
		}
	});
};

module.exports.createEducation = function (id, data, res) {
	var mapData = [];
	if(util.isArray(data)) {
		data.forEach(function (value, key) {
			with (value) {
				mapData.push([qualification, university, grade, id, fromDate, toDate]);
			}
		});
	}
	var query = db.query('INSERT INTO '+educationDb+' (resource_edu_trans_degree, resource_edu_trans_university, resource_edu_trans_grade, resource_details_id_fk, resource_edu_trans_period_from, resource_edu_trans_period_till) VALUES ?', [mapData], function (err, result) {
		if (err) throw err;
	});
};

module.exports.createExperience = function (id, data, res) {
	var mapData = [];
	if(util.isArray(data)) {
		data.forEach(function (value, key) {
			with (value) {
				mapData.push([company, experience, fromDate, toDate, id]);
			}
		});
	}
	var query = db.query('INSERT INTO '+experienceDb+' (resource_emp_trans_company, resource_emp_trans_exp, resource_emp_trans_period_from, resource_emp_trans_period_till, resource_details_id_fk) VALUES ?', [mapData], function (err, result) {
		if (err) throw err;
	});
};

/* Create Resource/ Recruitment Starts*/

/* Form D Starts */

module.exports.getResource = function (req, resultSet, res) {
	var postData = req.body;
	resultSet.resource = [];
	var query = db.query('SELECT pm.emp_id AS empId, pm.work_email_id AS emailId, CONCAT(rd.resource_first_name, " ", rd.resource_last_name) AS resName, rd.resource_details_id_pk AS resourceId, pm.project_id_fk AS projectId FROM '+projectmapDb+' AS pm LEFT JOIN '+resourceDb+' AS rd ON rd.resource_details_id_pk = pm.resource_details_id_fk WHERE pm.project_id_fk='+postData.prjId+' AND pm.client_interview_status != 0', function (err, result) {
		if (err) throw err;
		if(result.length > 0) {
			resultSet.resource = result;
		}
		res.json(resultSet);
	});
};

module.exports.getScoreSet = function (req, res) {
	var postData = req.body, resutSet = {};
	var query = db.query('SELECT cat.assessment_ctgy_id_pk AS catId, cat.assessment_ctgy_name AS catName, sub.assessment_subctgy_id_pk AS subId, sub.assessment_subctgy_name AS subName FROM '+assCategoryDb+' AS cat LEFT JOIN '+assSubCatDb+' AS sub ON cat.assessment_ctgy_id_pk = sub.assessment_ctgy_id_fk WHERE cat.status = 1 AND sub.status = 1', function (err, result) {
		if (err) throw err;
		resutSet.assessment = {};
		if(result.length > 0) {
			resutSet.assessment.category = alasql('SELECT catId, catName FROM ? GROUP BY catId, catName', [result]);
			resutSet.assessment.subCat = result;
			_this.getResource(req, resutSet, res);
		}
	});
};

module.exports.getAssessment = function (req, res) {
	var postData = req.body, resutSet = {}, sqlStr ='';
	sqlStr = 'SELECT * FROM '+resourceDb+' AS rd LEFT JOIN '+projectmapDb+' AS rpm ON rd.resource_details_id_pk = rpm.resource_details_id_fk LEFT JOIN '+assessmentDb+' AS rps ON rd.resource_details_id_pk = rps.resource_details_id_fk LEFT JOIN '+attendanceDb+' AS rpa ON rd.resource_details_id_pk = rpa.resource_details_id_fk WHERE rd.resource_details_id_pk = '+postData.resId.resourceId+' AND rpm.project_id_fk = '+postData.resId.projectId;
	
	var options = {sql: sqlStr, nestTables: true};

    var nestingOptions = [
        { tableName : 'rd', pkey: 'resource_details_id_pk'},
        { tableName : 'rps', pkey: 'assessment_subctgy_id_fk', fkeys:[{table:'rd',col:'resource_details_id_fk'}]},
        { tableName : 'rpa', pkey: 'attandance_trans_pk', fkeys:[{table:'rd',col:'resource_details_id_fk'}]}
    ];

	var query = db.query(options, function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};

module.exports.getAttendance = function (req, res) {
	var postData = req.body, resutSet = {}, sqlStr ='';
	sqlStr = 'SELECT * FROM '+resourceDb+' AS rd LEFT JOIN '+projectmapDb+' AS rpm ON rd.resource_details_id_pk = rpm.resource_details_id_fk LEFT JOIN '+assessmentDb+' AS rps ON rd.resource_details_id_pk = rps.resource_details_id_fk LEFT JOIN '+attendanceDb+' AS rpa ON rd.resource_details_id_pk = rpa.resource_details_id_fk where rpm.client_interview_status != 0'
	
	var options = {sql: sqlStr, nestTables: true};

    var nestingOptions = [
        { tableName : 'rd', pkey: 'resource_details_id_pk'},
        { tableName : 'rps', pkey: 'assessment_subctgy_id_fk', fkeys:[{table:'rd',col:'resource_details_id_fk'}]},
        { tableName : 'rpa', pkey: 'attandance_trans_pk', fkeys:[{table:'rd',col:'resource_details_id_fk'}]}
    ];

	var query = db.query(options, function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};

module.exports.getAttandanceByDay = function (req, res) {
	var postData = req.body;
	var dt = postData.selDay;
	var mainSql = "SELECT * FROM "+projectmapDb+" t1 LEFT JOIN "+resourceDb+" t2 ON t2.resource_details_id_pk = t1.resource_details_id_fk LEFT JOIN "+attendanceDb+" t3 ON t3.resource_details_id_fk = t1.resource_details_id_fk AND DATE_FORMAT(date,'%m/%d/%Y') = '"+postData.selDay+"' WHERE t1.project_id_fk ="+postData.projectId+" AND (t2.interview_status = 2 OR t1.client_interview_status IN (2,3)) ORDER BY  t3.date ";
	var options = {sql: mainSql, nestTables: true};

    var nestingOptions = [
        { tableName : 't1', pkey: 'resource_details_id_fk',fkeys:[{table:'t2',col:'resource_details_id_fk'}]},
        { tableName : 't3', pkey: 'attandance_trans_pk', fkeys:[{table:'t1',col:'resource_details_id_fk'}]},
        { tableName : 't2', pkey: 'resource_details_id_pk'}
    ];

	var query = db.query(options, function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};

module.exports.insertScoreSet = function (req, res) {
	var postData = req.body, assessScores = [];
	postData.subData.forEach(function (value, key) {
		with (value) {
			if(postData.data[subId]) {
				assessScores.push([postData.resId.resourceId, postData.resId.projectId, postData.catId, subId, postData.data[subId]])
			}
		}
	});
	var query = db.query('DELETE FROM '+assessmentDb+' WHERE resource_details_id_fk = '+postData.resId.resourceId+' AND project_id_fk = '+postData.resId.projectId+' AND assessment_ctgy_id_fk = '+postData.catId, function (err, delRes) {
		if(err) throw err;
		db.query('INSERT INTO '+assessmentDb+' (resource_details_id_fk, project_id_fk, assessment_ctgy_id_fk, assessment_subctgy_id_fk, score_percentage) VALUES ?', [assessScores], function (err, result) {
			if (err) throw err;
			_this.sendMailToSRManager(postData,'Scores');
			res.json(result);
		});
	});
};

module.exports.insertAttendence = function (req, res) {
	var postData = req.body, attendenceSt = [];
	Object.keys(postData.data).forEach(function (value, key) {
		with (postData.data[value]) {
			attendenceSt.push([postData.resId.resourceId, postData.resId.projectId, date, status])
		}
	});
	var query = db.query('DELETE FROM '+attendanceDb+' WHERE resource_details_id_fk = '+postData.resId.resourceId+' AND project_id_fk = '+postData.resId.projectId, function (err, delRes) {
		if(err) throw err;
		db.query('INSERT INTO '+attendanceDb+' (resource_details_id_fk, project_id_fk, date, status) VALUES ?', [attendenceSt], function (err, result) {
			if (err) throw err;
			res.json(result);
		});
	});
};

/* Form D Ends */

module.exports.recruit_client = function (req, res) {
	var postData = req.body;
	//select record
	var sql = "SELECT t1.*,t2.*,t3.*, IF(SUM(t4.resource_emp_trans_exp)>0,SUM(t4.resource_emp_trans_exp),0) AS totExp FROM "+projectmapDb+" t1 INNER JOIN "+resourceDb+" t2 ON t2.resource_details_id_pk = t1.resource_details_id_fk INNER JOIN "+projectmasDb+" t3 ON t3.project_id_pk = t1.project_id_fk LEFT JOIN "+experienceDb+" t4 ON t4.resource_details_id_fk = t1.resource_details_id_fk WHERE t1.client_interview = 1 AND t1.client_interview_status = 0 GROUP BY t1.resource_details_id_fk";
	var query = db.query(sql, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updClientStatus = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var cData = {
		client_interview_status:postData.cstatus,  
		client_comments:postData.comments
	};
	//insert record
	var query = db.query("UPDATE "+projectmapDb+" SET ? WHERE resource_details_id_fk = ? AND  project_id_fk = ?", [cData,postData.resource_details_id_fk,postData.project_id_fk], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.saveStatus = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var cData = {
		interview_status:postData.interview_status
	};
	//insert record
	var query = db.query("UPDATE "+resourceDb+" SET ? WHERE resource_details_id_pk = ?", [cData,postData.resource_details_id_pk], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getRecruitement = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT resource_details_id_pk,resource_first_name,resource_email,resource_interview_date,interview_status FROM t_resource_details t1 LEFT JOIN t_resource_project_map t2 ON t2.resource_details_id_fk = t1.resource_details_id_pk WHERE project_id_fk IS NULL ', function (err, result) {
		if (err) throw err;		
		res.json(result);
	});
};


module.exports.updateSelectStatus = function (req, res) {
	var postData = req.body;
	var interview_status = 1;
	if(postData.interview_status === 1) interview_status = 0;
	var statusData = {
		interview_status:interview_status
	};
	//insert record
	var query = db.query('UPDATE t_resource_details SET ? WHERE resource_details_id_pk = ?', [statusData,postData.resource_details_id_pk], function (err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.insertEmailandId = function (req, res) {
	var postData = req.body;
		var formbData = {
			empId:postData.empId,
			email:postData.email
		};
		//insert record
		var query = db.query('UPDATE tablename SET ? WHERE id = ?', [formbData,postData.id], function (err, result) {
			if (err) throw err;
			if(result)
				res.json(result);
		});
};

module.exports.formACreation = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var formAData = {
		dunit_name:postData.unitName,  
		dunit_desc:postData.remarks, 
		status:(postData.status === true)?1:0,
		created_date: new Date(),
		created_by:1,
		updated_date: new Date(),
		updated_by:1
	};
	//insert record
	var query = db.query('INSERT INTO tablename SET ?', formAData, function (err, result) {
		if (err) throw err;
	});
};

module.exports.getRecuritementFormb = function (req, res) {
	var postData = req.body, resutSet = {};
	//select record
	var query = db.query('SELECT rpm.mailsend,rpm.emp_id, rpm.work_email_id, rpm.designation, rpm.resource_details_id_fk, rd.resource_first_name AS fname, rd.resource_last_name AS lname, rd.resource_phone_no AS ph1, rpm.designation, rpm.doj,rpm.required_transport, IF(SUM(rdet.resource_emp_trans_exp)>0,SUM(rdet.resource_emp_trans_exp),0) AS totExp, pm.project_name,pm.project_id_pk, lm.location_name, dm.division_name FROM t_resource_details AS rd LEFT JOIN t_resource_details_emp_trans AS rdet ON rdet.resource_details_id_fk= rd.resource_details_id_pk LEFT JOIN t_resource_project_map rpm ON rpm.resource_details_id_fk=rd.resource_details_id_pk LEFT JOIN t_project_mas pm ON pm.project_id_pk=rpm.project_id_fk LEFT JOIN t_division_mas dm ON dm.division_id_pk=rpm.division_id_fk LEFT JOIN t_location_mas lm ON lm.location_id_pk=rpm.location_id_fk WHERE rpm.project_id_fk=? AND rpm.client_interview_status IN (2,3) GROUP BY rd.resource_details_id_pk',[postData.projectID], function (err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateFormB = function (req, res) {
	var postData = req.body;
	var formbData = {
		emp_id:postData.emp_id,
		work_email_id:postData.work_email_id
	};
	//insert record
	var query = db.query('UPDATE t_resource_project_map SET ? WHERE resource_details_id_fk  = ?', [formbData,postData.resource_details_id_fk], function (err, result) {
		if (err) throw err;
		if (postData.agentdetails.mailsend == 0) {
			_this.sendMailToSRManager(postData,'ExpertsSelection');	
		}		
		res.json(result);
	});
};

/* Recruitment Form A Starts */

module.exports.getrtformaUnit = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_resource_project_map', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.creatertformaUnit = function (req, res) {
	var postData = req.body;
	if(postData) {
		var unitData = {
			designation:postData.rtdesignation,
			salary:postData.rtsalary,
			doj:postData.rtdoj,
			client_interview:postData.rtclientinterview,
			client_interview_date:postData.rtclientinterviewdate,
			required_transport:postData.rtworktransport,
			project_id_fk:postData.rtproject,  
			location_id_fk:postData.rtworklocation,
			division_id_fk:postData.rtworkdivision,
			resource_details_id_fk:postData.resource_details_id_pk,
			client_interview_status: (postData.rtclientinterview == 1) ? 0 : 2
		};
		//insert record
		var query = db.query('INSERT INTO t_resource_project_map SET ?', unitData, function(err, result) {
			if (err) throw err;
			res.json(result);
		});
	} else {
		res.json(false);
	}
};

module.exports.getUserDet = function (req, res) {
	var postData = req.body, resutSet = {};
	//select record
	var query = db.query('SELECT rd.resource_details_id_pk, rd.resource_first_name AS fname, rd.resource_last_name AS lname, rd.resource_phone_no AS ph1,  IF(SUM(rdet.resource_emp_trans_exp)>0,SUM(rdet.resource_emp_trans_exp),0) AS totExp FROM t_resource_details AS rd LEFT JOIN t_resource_details_emp_trans AS rdet ON rdet.resource_details_id_fk= rd.resource_details_id_pk WHERE rd.resource_details_id_pk = ? GROUP BY rdet.resource_details_id_fk',[postData.userId], function(err, result) {
		if (err) throw err;
		if(result.length > 0) {
			res.json(result[0]);
		} else {
			res.json(result);
		}
	});
};

module.exports.getattendanceMas = function (req, res) {
	//select record
	var query = db.query('SELECT option_id_pk,option_name FROM t_attendance_options_mas', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.saveAttendance = function (req, res) {
	var postData = req.body;
	if (postData.transID > 0) {
		var qry = db.query('UPDATE t_resource_project_attendance_trans SET option_id_fk= ?,comments=? WHERE attandance_trans_pk =?',[postData.optID,postData.comment,postData.transID], function(err, result) {
			if (err){throw err;}
			else{
				if (postData.optID == 2 || postData.optID == 3) {
					_this.sendMailToSRManager(postData,'Attendance');
				}
				res.json(result);	
			} 		
		});

	}else{
		var attdet={
			resource_details_id_fk :postData.resId.resourceId,
			project_id_fk:postData.resId.projectId,
			DATE : postData.attDate,
			option_id_fk :postData.optID,
			comments :postData.comment
		};
		var query = db.query('INSERT INTO t_resource_project_attendance_trans SET ?',attdet, function(err, result) {
			if (err){throw err;}
			else{
				if (postData.optID == 2 || postData.optID == 3) {
					_this.sendMailToSRManager(postData,'Attendance');
				}
				res.json(result);	
			} 
		});
	}
	
};

module.exports.saveAttendanceGroup = function (req, res) {
	var postData = req.body;
	if(util.isArray(postData)) {
		postData.forEach(function (value, key) {
			with (value) {
				if (value.transID > 0) {
					var qry = db.query('UPDATE t_resource_project_attendance_trans SET option_id_fk= ?,comments=? WHERE attandance_trans_pk =?',[value.optID,value.comment,value.transID], function(err, result) {
						if (err){throw err;}
						else{
							if (value.optID == 2 || value.optID == 3) {
								_this.sendMailToSRManager(value,'GroupAttendance');
							}	
						} 		
					});

				} else {
					var attdet={
						resource_details_id_fk :value.resId,
						project_id_fk:value.prjId,
						DATE : moment(value.attDate,'MM/DD/YYYY').format('YYYY-MM-DD'),
						option_id_fk :value.optID,
						comments :value.comment
					};
					var query = db.query('INSERT INTO t_resource_project_attendance_trans SET ?',attdet, function(err, result) {
						if (err){throw err;}
						else{
							if (value.optID == 2 || value.optID == 3) {
								_this.sendMailToSRManager(value,'GroupAttendance');
							}
						} 
					});
				}
			}
		});
		res.json({'result':'success'});
	}
};

module.exports.sendMailToSRManager = function (data,type) {
	var projectID = (type === 'ExpertsSelection') ? data.agentdetails.project_id_pk : (type === 'GroupAttendance') ? data.prjId : data.resId.projectId ;
	var query = db.query('SELECT GROUP_CONCAT(UM.email SEPARATOR ";") as Receipients FROM t_user_mas AS UM INNER JOIN t_user_project_map PM ON PM.user_id_fk = UM.user_id_pk WHERE UM.user_role_id_fk =1 AND PM.project_id_fk =? GROUP BY PM.project_id_fk',[projectID], function(err, result) {
			if (err){throw err;}
			else{
				if (result.length > 0) {
					var mapObj,mailTemp;
					if (type === 'Attendance') {
						mapObj = {
							   '#AgentName#':data.resId.resName,
							   '#EmpID#':data.resId.empId,
							   '#AttendanceDesc#': (data.optID == 2) ? 'Absent' : 'HD',
							   '#AtteDate#': moment(data.attDate).format('DD-MM-YYYY')
							};
							mailTemp = 'attendancetpl';
					}else if(type === 'Scores'){
						mapObj = {
							   '#AgentName#':data.resId.resName,
							   '#EmpID#':data.resId.empId,
							   '#CateName#': (data.catId == 1) ? 'Technical' : 'Communication',
							   '#Thresholdscore#':(data.catId == 1) ? data.data[1] : data.data[5],
							   '#InitAssess#':(data.catId == 1) ? data.data[2] : data.data[6],
							   '#midAsses#': (data.catId == 1) ? data.data[3] : data.data[7],
							   '#finalAsses#': (data.catId == 1) ? data.data[4] : data.data[8]
							};
							mailTemp = 'agntscrtpl';
					}else if (type === 'ExpertsSelection') {
						mapObj = {
							   '#DivName#':data.agentdetails.division_name,
							   '#AgentName#':data.agentdetails.fname +' ' + data.agentdetails.lname,
							   '#EmpID#': data.emp_id,
							   '#EmpEmail#': data.work_email_id,
							   '#Mapproj#': data.agentdetails.project_name,
							   '#DOJ#': moment(data.agentdetails.doj).format('DD-MM-YYYY'),
							   '#Desig#': data.agentdetails.designation
							};
							mailTemp = 'newagentseltpl';
					}else if(type === 'GroupAttendance'){
						mapObj = {
							   '#AgentName#':data.resName,
							   '#EmpID#':data.resId,
							   '#AttendanceDesc#': (data.optID == 2) ? 'Absent' : 'HD',
							   '#AtteDate#': moment(data.attDate).format('DD-MM-YYYY')
							};
							mailTemp = 'attendancetpl';
					}
					var mailData = {
						'to': result[0].Receipients, //'thirumaran.dhanapal@csscorp.com', //result[0].Receipients
						'replace': mapObj
					};

					sendMails.sendEmail(mailTemp, mailData, function (result1) {
					});
				}
				// res.json(result);
			} 
	});
};

/* Recruitment Form A Ends */