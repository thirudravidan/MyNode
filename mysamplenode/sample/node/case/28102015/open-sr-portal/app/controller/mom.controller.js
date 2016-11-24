'user strict';

var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, func = require('../config/func.js')
, alasql = require('alasql')
, moment = require('moment')
, multer = require('multer')
, path = require('path')
, moments = require('moment')
, filePath = path.resolve(__dirname, '..')
, meetingmasDB = 't_meeting_mas'
, attachtransDB = 't_meeting_attachment_trans'
, joineetransDb = 't_meeting_joinee_trans'
, actionitemDB = 't_meeting_action_items_trans'
, usermasDB = 't_user_mas';
var sendMails = require('./mailtemplate.controller');

filePath = path.join(filePath, '/upload/momfiles/');
/* Scores Data Set */
var upload = multer({ dest: filePath,
    rename : function (fieldname, filename, req, res) {
        return filename;
        //return  req.body.caseID
    },
    onFileUploadComplete: function (file, req, res) {
    	return file;
    }
});

module.exports.uploadMOMDoc = function (req, res) {
	upload(req, res, function (err) {
		if(err) throw(err);
		res.json(req.files);
	});
};

module.exports.getMOMmeeting = function (req, res) {
	var postData = req.body;

	var mainSql = "SELECT * FROM "+meetingmasDB+" t1 LEFT JOIN "+joineetransDb+" t2 ON t2.meeting_mas_id_fk = t1.meeting_mas_id_pk LEFT JOIN "+attachtransDB+" t3 ON t3.meeting_mas_id_fk = t1.meeting_mas_id_pk LEFT JOIN "+usermasDB+" t4 ON t4.user_id_pk = t2.user_id_fk";
	var options = {sql: mainSql, nestTables: true};
	
    var nestingOptions = [
        { tableName : 't1', pkey: 'meeting_mas_id_pk'},
        { tableName : 't2', pkey: 'meeting_joinee_id_pk', fkeys:[{table:'t1',col:'meeting_mas_id_fk'},{table:'t4',col:'user_id_fk'}]},
        { tableName : 't3', pkey: 'meeting_attach_id_pk',fkeys:[{table:'t1',col:'meeting_mas_id_fk'}]},
        { tableName : 't4', pkey: 'user_id_pk'}
    ];

	var query = db.query(options, function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};

module.exports.getActionItem = function (req, res) {
	var postData = req.body;
	
	var query = db.query("SELECT * FROM "+actionitemDB+" WHERE meeting_mas_id_fk = ?",[postData.mid], function(err, results) {
		if (err) throw err;
		res.json(results);
	});
};

module.exports.getMomJoinee = function (req, res) {
	var postData = req.body;
	
	var query = db.query("SELECT * FROM "+joineetransDb+" WHERE meeting_mas_id_fk = ?",[postData.mid], function(err, results) {
		if (err) throw err;
		res.json(results);
	});
};

module.exports.getprojectmas = function (req, res) {
	var postData = req.body;

	var mainSql = "SELECT project_id_pk as id, project_name as name FROM "+projectmasDb+" WHERE project_name LIKE '%"+postData.query+"%'";
	
	var query = db.query(mainSql, function(err, results) {
		if (err) throw err;
		res.json(results);
	});
};

module.exports.createMom = function(req, res) {
	var postData = req.body;
	var usrData = req.user;
	var momData = {
		meeting_title : postData.momtitle,
		meeting_location : postData.momlocation,
		start_date : postData.startDate,
		end_date : postData.endDate,
		start_time : moment(postData.momstarttime, ["h:mm A"]).format("HH:mm:ss"),
		end_time : moment(postData.momendtime, ["h:mm A"]).format("HH:mm:ss"),
		start_date_time : moment(postData.startDate+' '+postData.momstarttime, ["YYYY-MM-DD h:mm A"]).format("YYYY-MM-DD HH:mm:ss"),
		end_date_time : moment(postData.endDate+' '+postData.momendtime, ["YYYY-MM-DD h:mm A"]).format("YYYY-MM-DD HH:mm:ss"),
		timezone : postData.momtimezone,
		comments : postData.momcomments,
		created_by : postData.userID,
		updated_by : postData.userID,
		created_date : new Date(),
		updated_date : new Date(),
		status : 1
	};
	//insert record
	var query = db.query('INSERT INTO '+meetingmasDB+' SET ?', momData, function (err, result) {
		if (err) throw err;
		if(result.insertId) {
			if(postData.tags.length > 0) {
				// _this.createJoinee(result.insertId, postData.tags, res);
				_this.createJoinee(result.insertId, postData, res);
			}
			if(postData.files.length > 0) {
				_this.createAttachment(result.insertId, postData.files, res);
			}
			
			postData['creatorName'] = usrData.first_name+' '+usrData.last_name;
			_this.sendMailTo(postData,'inviteMeet');
			
			res.json(result);
		}
	});
};

module.exports.updateMom = function(req, res) {
	var postData = req.body;
	var usrData = req.user;
	var momData = {
		meeting_title : postData.momtitle,
		meeting_location : postData.momlocation,
		start_date_time : moment(postData.startDate+' '+postData.momstarttime, ["YYYY-MM-DD h:mm A"]).format("YYYY-MM-DD HH:mm:ss"),
		end_date_time : moment(postData.endDate+' '+postData.momendtime, ["YYYY-MM-DD h:mm A"]).format("YYYY-MM-DD HH:mm:ss"),
		timezone : postData.momtimezone,
		comments : postData.momcomments,
		updated_by : postData.userID,
		updated_date : new Date()
	};
	//Update record
	var query = db.query("UPDATE "+meetingmasDB+" SET ? WHERE meeting_mas_id_pk = ? ", [momData,postData.id], function(err, result) {
		if (err) throw err;
		if(postData.tags.length > 0) {
			// _this.createJoinee(postData.id, postData.tags, res);
			_this.createJoinee(postData.id, postData, res);
		}
		if(postData.files.length > 0) {
			_this.createAttachment(postData.id, postData.files, res);
		}

		postData['creatorName'] = usrData.first_name+' '+usrData.last_name;
		_this.sendMailTo(postData,'inviteMeet');
		
		res.json(result);
	});
};

alasql.aggr.GROUP_CONCAT = function(v,s){
    if(typeof s == "undefined" && !s) return v; else return s+';'+v;
};

module.exports.sendMailMom = function (pData, res) {
	console.log(pData.tags);
	var uEmail = alasql("SELECT '1' as id, email FROM ?",[pData.tags]);
	console.log(uEmail);
	var sEmail = alasql('SELECT GROUP_CONCAT(email) AS emails FROM ? GROUP BY id',[uEmail]);
	console.log(sEmail);
	/*sendMails.sendEmail('invitetpl', postData, function (result1) {
		res.json(result1);
	});*/
};

module.exports.createJoinee = function (fid, data, res) {
	var mapData = [], momDet =[],notify_desc;
	notify_desc='Meeting is scheduled between '+data.startDate +' and '+data.endDate+ ' in '+data.momlocation + ' for ' +data.momcomments;
	if(util.isArray(data.tags)) {
		data.tags.forEach(function (value, key) {
			with (value) {
				mapData.push([fid, 0, id, '', 0]);
				momDet.push([data.momtitle,'mom',notify_desc,id,0,moments().format('YYYY-MM-DD HH:mm:ss'),fid]);
			}
		});
	}

	var query = db.query('DELETE FROM '+joineetransDb+' WHERE meeting_mas_id_fk = '+fid, function (err, delRes) {
		if(err) throw err;
		console.log(momDet);
		var query = db.query('INSERT INTO '+joineetransDb+' (meeting_mas_id_fk,accepted,user_id_fk,email_id,present) VALUES ?', [mapData], function (err, result) {
			if (err) throw err;
			db.query('DELETE FROM t_notifications WHERE unique_id = ?',[fid], function (err, delNoti) {
				if(err) throw err;
				db.query('INSERT INTO t_notifications(notification_name,notification_type,notification_desc,user_id_fk,is_read,created_date,unique_id) VALUES ?',[momDet],function (err,notires){
					console.log(notires);
				});
			});
		});
	});
};

module.exports.addJoinee = function (req, res) {
	var postData = req.body;
	var data = postData.userids;
	var mapData = [];
	if(util.isArray(data)) {
		data.forEach(function (value, key) {
			with (value) {
				mapData.push([postData.mid, 0, id, '', 1]);
			}
		});
	}
	console.log(mapData);
	var query = db.query('INSERT INTO '+joineetransDb+' (meeting_mas_id_fk,accepted,user_id_fk,email_id,present) VALUES ?', [mapData], function (err, result) {
		if (err) throw err;

		res.json(result);
	});
};

module.exports.createAttachment = function (fid, data, res) {
	var mapData = [];
	if(util.isArray(data)) {
		data.forEach(function (value, key) {
			with (value) {
				mapData.push([fid, name, '/upload/momfiles/', 3]);
			}
		});
	}

	var query = db.query('INSERT INTO '+attachtransDB+' (meeting_mas_id_fk,file_name,file_path,uploaded_by) VALUES ?', [mapData], function (err, result) {
		if (err) throw err;
		console.log(result);
	});
};

module.exports.updateMomDiscusss = function(req, res) {
	var postData = req.body;
	//Update record
	var query = db.query("UPDATE "+meetingmasDB+" SET meeting_discussion = CONCAT_WS('||',meeting_discussion, ?) WHERE meeting_mas_id_pk = ? ", [postData.discussNotes,postData.id], function(err, result) {
		if (err) throw err;

		res.json(result);
	});
};

module.exports.createActionItem = function (req, res) {
	var postData = req.body;
	var usrData = req.user;
	var aiData = {
		ai_notes : postData.ainotes,
		due_date : postData.due_date,
		status : postData.status,
		reminder_days : postData.remainder,
		user_id_fk : postData.userId[0].id,
		meeting_mas_id_fk : (postData.mid)?postData.mid:1,
		created_by : usrData.user_id_pk,
		updated_by : usrData.user_id_pk,
		created_date : new Date(),
		updated_date : new Date(),
	};

	postData['qtype'] = 'New';
	var query = db.query('INSERT INTO '+actionitemDB+' SET ?', aiData, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateActionItem = function (req, res) {
	var postData = req.body;
	var usrData = req.user;
	var aiData = {
		ai_notes : postData.ainotes,
		due_date : postData.due_date,
		status : postData.status,
		reminder_days : postData.remainder,
		user_id_fk : postData.userId[0].id,
		updated_by : usrData.user_id_pk,
		updated_date : new Date(),
	};
	postData['qtype'] = 'Updated';
	var query = db.query("UPDATE "+actionitemDB+" SET ? WHERE action_items_trans_id_pk = ? ", [aiData,postData.id], function(err, result) {
		if (err) throw err;
		_this.sendMailTo(postData,'actionItem');
		res.json(result);
	});
};

module.exports.setPresent = function(req, res) {
	var postData = req.body;
	//Update record
	var query = db.query("UPDATE "+joineetransDb+" SET present = ? WHERE meeting_joinee_id_pk = ? ", [postData.pstatus,postData.id], function(err, result) {
		if (err) throw err;

		res.json(result);
	});
};

//Action Item
module.exports.getActionItemByUser = function (req, res) {
	var postData = req.body;
	var usrData = req.user;
	var query = db.query("SELECT * FROM "+actionitemDB+" ai LEFT JOIN "+meetingmasDB+" mom ON mom.meeting_mas_id_pk = ai.meeting_mas_id_fk WHERE ai.user_id_fk = ? OR ai.created_by = ?",[usrData.user_id_pk,usrData.user_id_pk], function(err, results) {
		if (err) throw err;
		res.json(results);
	});
};

module.exports.sendMailTo = function (pData,type) {
	var projectID = pData.prjId, mailTo = '';
	var statuses = {1:'Yet To Start',2:'In Progress',3:'Completed'};
	switch(type){
        case 'inviteMeet':
        	console.log(pData.tags);
			var uEmail = alasql("SELECT '1' as id, email, name FROM ?",[pData.tags]);
			var sEmail = alasql('SELECT GROUP_CONCAT(email) AS emails, GROUP_CONCAT(name) AS names FROM ? GROUP BY id',[uEmail]);
			
			mapObj = { 
			   '#TITLE#':pData.momtitle,
			   '#LOCATION#':pData.momlocation,
			   '#START_DATE#':pData.startDate,
			   '#START_TIME#':pData.momstarttime,
			   '#END_DATE#':pData.endDate,
			   '#END_TIME#':pData.momendtime,
			   '#AGENDA#':pData.momcomments,
			   '#TIME_ZONE#':pData.momtimezone,
			   '#INVITEE#':sEmail[0].names.replace(";undefined", ""),
			   '#CREATOR#':pData.creatorName
			};
			mailTemp = 'invitetpl';
			mailTo = sEmail[0].emails.replace(";undefined", "");
			console.log(mailTo);
            break;
        case 'actionItem':
			mapObj = {
			   '#USERNAME#':pData.userId[0].name,
			   '#DUE_DATE#':pData.due_date,
			   '#REMAINDER#':pData.remainder,
			   '#STATUS#':statuses[pData.status],
			   '#AGENDA#':pData.ainotes,
			   '#TYPE#':pData.qtype
			};
			mailTemp = 'actionitemtpl';
			mailTo = pData.userId[0].email;
            break;
    }
    console.log(pData.email);
    var mailData = {
		'to':mailTo, //pData.email
		'replace': mapObj
	};
    sendMails.sendEmail(mailTemp, mailData, function (result1) {
	
	});
};

