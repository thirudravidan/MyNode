'user strict';

var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, func = require('../config/func.js')
, moment = require('moment')
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


/* Scores Data Set */

module.exports.getAssessment = function (req, res) {
	var postData = req.body, resutSet = {};
	
	var mainSql = "SELECT * FROM "+projectmapDb+" t1 LEFT JOIN "+resourceDb+" t2 ON t2.resource_details_id_pk = t1.resource_details_id_fk LEFT JOIN "+projectmasDb+" t3 ON t3.project_id_pk = t1.project_id_fk LEFT JOIN "+assessmentDb+" t4 ON t4.resource_details_id_fk = t1.resource_details_id_fk WHERE (t2.interview_status = 2 OR t1.client_interview_status IN (2,3)) ORDER BY t4.assessment_ctgy_id_fk, t4.assessment_subctgy_id_fk";
	var options = {sql: mainSql, nestTables: true};

    var nestingOptions = [
        { tableName : 't1', pkey: 'resource_details_id_fk', fkeys:[{table:'t3',col:'project_id_fk'},{table:'t2',col:'resource_details_id_fk'}]},
        { tableName : 't4', pkey: 'assessment_subctgy_id_fk', fkeys:[{table:'t1',col:'resource_details_id_fk'}]},
        { tableName : 't2', pkey: 'resource_details_id_pk'},
        { tableName : 't3', pkey: 'project_id_pk'}
    ];

	var query = db.query(options, function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		resutSet.scoreSet = nestedRows;
		_this.getcatDet(req, resutSet, res);
		//res.json(nestedRows);
	});
};

module.exports.getcatDet = function (req, resultSet, res) {
	var postData = req.body; 
	resultSet.catData = [];
	var mainSql = "SELECT cat.assessment_ctgy_id_pk, cat.assessment_ctgy_name, sub.assessment_subctgy_id_pk, sub.assessment_subctgy_name, sub.assessment_ctgy_id_fk FROM "+assCategoryDb+" AS cat LEFT JOIN "+assSubCatDb+" AS sub ON cat.assessment_ctgy_id_pk = sub.assessment_ctgy_id_fk WHERE cat.status = 1 AND sub.status = 1 ORDER BY sub.assessment_ctgy_id_fk, sub.assessment_subctgy_id_pk";
	var options = {sql: mainSql, nestTables: true};
	var nestingOptions = [
        { tableName : 'cat', pkey: 'assessment_ctgy_id_pk'},
        { tableName : 'sub', pkey: 'assessment_subctgy_id_pk', fkeys:[{table:'cat',col:'assessment_ctgy_id_fk'}]}
    ];

	var query = db.query(options, function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		resultSet.catData = nestedRows;
		res.json(resultSet);
	});
};

module.exports.getAttandance = function (req, res) {
	var postData = req.body;
	var dt = postData.year+''+((postData.month.length > 1)?postData.month:'0'+postData.month);
	var mainSql = "SELECT * FROM "+projectmapDb+" t1 LEFT JOIN "+resourceDb+" t2 ON t2.resource_details_id_pk = t1.resource_details_id_fk LEFT JOIN "+attendanceDb+" t3 ON t3.resource_details_id_fk = t1.resource_details_id_fk AND DATE_FORMAT(date,'%Y%m') = '"+dt+"' WHERE (t2.interview_status = 2 OR t1.client_interview_status IN (2,3)) ORDER BY  t3.date ";
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