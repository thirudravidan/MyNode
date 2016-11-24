var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, multer = require('multer')
, path = require('path')
, filePath = path.resolve(__dirname, '..')
, orgDb = 't_org_chart_trans'
, templateDb = 't_org_chart_tpl_mas'
, tempTransDb = 't_org_chart_tpl_trans';

filePath = path.join(filePath, '/upload/orgprofile/');

var upload = multer({ dest: filePath,
    rename : function (fieldname, filename, req, res) {
        return filename;
        //return  req.body.caseID
    },
    onFileUploadComplete: function (file, req, res) {
    	return file;
    }
});

module.exports.uploadorgPic = function (req, res) {

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

module.exports.viewOrgChart = function (req, res) {
	var postData = req.body, output = {};
	var query = db.query('SELECT * FROM '+orgDb+' WHERE project_id_fk = ? ORDER BY level',[postData.pid],function (err, result) {
		if (err) throw err;
		output.orgChart = result;
		db.query('SELECT * FROM '+templateDb+' WHERE status = 1', function (err, tempRes) {
			if (err) throw err;
			output.tplRes = tempRes;
			res.json(output);
		});
	});
};

module.exports.getTemplate = function (req, res) {
	var postData = req.body
	var query = db.query('SELECT * FROM '+templateDb+' WHERE tpl_id_pk = ? AND status = 1', postData.tpl , function (err, result) {
		if (err) throw err;
		if(util.isArray(result) && result.length > 0) {
			_this.loadTemplate(postData, res);
		}
	});
};

module.exports.createTemplate = function (req, res) {
	var postData = req.body;
	if(postData) {
		var templateData = {
			tpl_name:postData.templateName,
			tpl_desc:postData.templateName,
			status:1
		};
		//insert record
		var query = db.query('INSERT INTO '+templateDb+' SET ?', templateData, function (err, result) {
			if (err) throw err;
			if(result)
				_this.saveTemplate(postData, result);
			res.json(result);
		});
	} else {
		res.json(false);
	}
};

module.exports.loadTemplate = function (data, res) {
	var resultSet = [], complete = 0, tplData = {};
	db.query('SELECT org_chart_id_fk, parent_id, name, designation, level,email,profileurl FROM '+tempTransDb+' WHERE tpl_id_fk = ? ORDER BY org_chart_id_fk', data.tpl, function (err, orgData) {
		if(err) throw err;
		complete = 0;
		var finalSet = function () {
			complete++;
			if(complete === orgData.length) {
				res.json({result:true, projectId: data.project_id});
			}
		}
		if(util.isArray(orgData) && orgData.length > 0) {
			orgData.forEach(function (value, key) {
				tplData = {};
				with(value) {
					tplData = {
						parent_id: parent_id,
						name: name,
						designation: designation,
						project_id_fk: data.project_id,
						level: level,
						email : email,
						profileurl : profileurl,
						org_chart_id_pk_tmp: org_chart_id_fk,
						org_chart_flag: 0
					}
					db.query('INSERT INTO '+orgDb+' SET ?', [tplData], function(err, divRes) {
						if (err) throw err;
						finalSet()
					});
					/*resultSet.push([parent_id, name, designation, data.project_id, level, org_chart_id_fk, 0]);
					db.query('INSERT INTO '+orgDb+' (parent_id, name, designation, project_id_fk, level, org_chart_id_pk_tmp, org_chart_flag) VALUES ?', [resultSet], function(err, divRes) {
						if (err) throw err;
						finalSet()
					});*/
				}
			});
			
		}
	});
}

module.exports.saveTemplate = function (data, indexId) {
	var resultSet = [];
	db.query('SELECT org_chart_id_pk_tmp, parent_id, name, designation, level,email,profileurl FROM '+orgDb+' WHERE project_id_fk = ? ORDER BY level', data.project_id, function (err, orgData) {
		if(err) throw err;
		if(util.isArray(orgData) && orgData.length > 0) {
			orgData.forEach(function (value, key) {
				with(value) {
					resultSet.push([org_chart_id_pk_tmp, parent_id, name, designation, level, indexId.insertId,email,profileurl]);
				}
			});
			db.query('INSERT INTO '+tempTransDb+' (org_chart_id_fk, parent_id, name, designation, level, tpl_id_fk,email,profileurl) VALUES ?', [resultSet], function(err, divRes) {
				if (err) throw err;
			});
		}
	});
}

module.exports.addOrgChart = function (req, res) {
	var postData = req.body;
	if(postData) {
		var orgData = {
			parent_id:postData.org_chart_id_pk_tmp,
			name:postData.name,
			designation:postData.designation,
			project_id_fk:postData.project_id_fk,
			level:postData.level,
			email:postData.email,
			profileurl:postData.profileURL
		};
		//insert record
		var query = db.query('INSERT INTO '+orgDb+' SET ?', orgData, function (err, result) {
			if (err) throw err;
			res.json(result);
		});
	} else {
		res.json(false);
	}
};

module.exports.updOrgChart = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var orgData = {
		name:postData.name,
		designation:postData.designation,
		email:postData.email,
		profileurl:postData.profileURL
	};
	//insert record
	var query = db.query('UPDATE '+orgDb+' SET ? WHERE org_chart_id_pk = ?', [orgData,postData.org_chart_id_pk], function (err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.rmOrgChart = function (req, res) {
	var postData = req.body, rmIds;
	if(util.isArray(postData.rmIds)) {
		rmIds = postData.rmIds.toString();
	}
	//delete record
	var query = db.query('DELETE FROM '+orgDb+' WHERE org_chart_id_pk IN ('+rmIds+')', function (err, result) {
		if (err) throw err;
		res.json(result);
	});
};