'use strict';
var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, alasql = require('alasql')
, moments = require('moment')
, func = require('../config/func');

module.exports.getLocationCalendar = function (req, res) {
	var postData = req.body, resutSet = {}, sqlStr ='';
	sqlStr = 'SELECT * FROM t_calender_loc_mas AS CM LEFT JOIN  t_calender_loc_holidays_trans AS CH ON  CH.cal_loc_id_fk =CM.cal_loc_id_pk WHERE CM.location_id_fk =? AND CM.YEAR =?';
	
	var options = {sql: sqlStr, nestTables: true};
    var nestingOptions = [
        { tableName : 'CM', pkey: 'cal_loc_id_pk'},
        { tableName : 'CH', pkey: 'holidays_id_pk', fkeys:[{table:'CM',col:'cal_loc_id_fk'}]}        
    ];
	var query = db.query(options,[postData.locationID,postData.selectedYear] ,function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};

module.exports.saveLocationHolidays = function (req, res) {
	var postData,holidays,daystrans =[],datefield,complete=0,cptcount=0;
	postData = req.body;
	holidays=postData.holidayDate;	
	var finalSet = function () {
		complete++;
		if(complete === postData.holidayDate.length) {
			var query=db.query('INSERT INTO t_calender_loc_holidays_trans(cal_loc_id_fk,holiday_name,holiday_date,STATUS,created_date,updated_date,created_by,updated_by) VALUES ?', [daystrans], function(err, result) {
				if (err) {
					throw err;
				}else{
					res.json({"status" :true});
				}
			});
		}
				
	};
	if (postData.calMasID > 0) {
		db.query('UPDATE t_calender_loc_mas SET weekoff_days = ? WHERE cal_loc_id_pk =?',[postData.weekOffDays,postData.calMasID] ,function(err, results) {
			if (err) {
				throw err;
			}else{
				db.query('DELETE FROM t_calender_loc_holidays_trans WHERE cal_loc_id_fk = ?', postData.calMasID);
				if (util.isArray(holidays) && holidays.length > 0) {
					postData.holidayDate.forEach(function (val, key) {
						cptcount++;
						datefield =[postData.calMasID,val.data.message,moments(new Date(val.date)).format('YYYY-MM-DD'),1,moments().format('YYYY-MM-DD'),moments().format('YYYY-MM-DD'),postData.userID,postData.userID];
						daystrans.push(datefield);
						finalSet();
					});
				}				
			}			
		});
	}else{
		var calmas={
			location_id_fk : postData.locationID,
			YEAR : postData.calYear,
			weekoff_days: postData.weekOffDays
		};
		db.query('INSERT INTO t_calender_loc_mas SET ?',calmas ,function(err, results) {
			if (err) {
				throw err;
			}else{
				db.query('DELETE FROM t_calender_loc_holidays_trans WHERE cal_loc_id_fk = ?', postData.calMasID);
				if (util.isArray(holidays) && holidays.length > 0) {
					postData.holidayDate.forEach(function (val, key) {
						cptcount++;
						datefield =[results.insertId,val.data.message,moments(new Date(val.date)).format('YYYY-MM-DD'),1,moments().format('YYYY-MM-DD'),moments().format('YYYY-MM-DD'),postData.userID,postData.userID];
						daystrans.push(datefield);
						finalSet();
					});

				}
			}
		});
	}	
};

module.exports.getProjectLocationHolidayDet = function (req, res) {

	var postData = req.body, resutSet = {}, sqlStr ='';
	sqlStr = 'SELECT * FROM t_calender_loc_mas CM LEFT JOIN t_calender_loc_project_map CPM ON CPM.cal_loc_id_fk =CM.cal_loc_id_pk LEFT JOIN t_calender_loc_holidays_trans CHT ON CHT.cal_loc_id_fk = CM.cal_loc_id_pk WHERE CPM.project_id_fk =?';
	
	var options = {sql: sqlStr, nestTables: true};
    var nestingOptions = [
        { tableName : 'CM', pkey: 'cal_loc_id_pk'},        
        { tableName : 'CHT', pkey: 'holidays_id_pk', fkeys:[{table:'CM',col:'cal_loc_id_fk'}]}        
    ];
	var query = db.query(options,[postData.projectID] ,function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});

};

module.exports.getSpecialWorkingDays = function (req, res) {

	var postData = req.body, resutSet = {}, sqlStr ='';
	sqlStr = 'SELECT * FROM  t_special_workingday_mas AS WM LEFT JOIN t_special_workingday_trans AS SWT ON SWT.splworking_id_fk =WM.splworking_id_pk WHERE WM.project_id_fk=?';
	
	var options = {sql: sqlStr, nestTables: true};
    var nestingOptions = [
        { tableName : 'WM', pkey: 'splworking_id_pk'},        
        { tableName : 'SWT', pkey: 'splworking_trans_id_pk', fkeys:[{table:'WM',col:'splworking_id_fk'}]}        
    ];
	var query = db.query(options,[postData.projectID] ,function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};

module.exports.insertSpecialWorking = function (req, res) {
	var postData=req.body,daystrans =[],datefield,complete=0,cptcount=0;
	var finalSet = function () {
		complete++;
		if(complete === postData.specialDay.length) {
			var query=db.query('INSERT INTO t_special_workingday_trans(splworking_id_fk,special_date,comments,created_by,created_date) VALUES ?', [daystrans], function(err, result) {
				if (err) {
					throw err;
				}else{
					res.json({"status" :true});
				}
			});
		}
				
	};
	if (postData.splMasID > 0) {
		db.query('DELETE FROM t_special_workingday_trans WHERE splworking_id_fk = ?', postData.splMasID);
		if (util.isArray(postData.specialDay) && postData.specialDay.length > 0) {
			postData.specialDay.forEach(function (val, key) {
				cptcount++;
				datefield =[postData.splMasID,moments(new Date(val.date)).format('YYYY-MM-DD'),val.data.message,postData.userID,moments().format('YYYY-MM-DD')];
				daystrans.push(datefield);
				finalSet();
			});

		}
	}else{
		var splwork={
				project_id_fk : postData.projectID,
				created_by : postData.userID,
				created_date: moments().format('YYYY-MM-DD'),
				updated_by : postData.userID,
				updated_date: moments().format('YYYY-MM-DD')
			};

		db.query('INSERT INTO t_special_workingday_mas SET ?',splwork ,function(err, results) {
			if (err) {
				throw err;
			}else{
				db.query('DELETE FROM t_special_workingday_trans WHERE splworking_id_fk = ?', postData.splMasID);
				if (util.isArray(postData.specialDay) && postData.specialDay.length > 0) {
					postData.specialDay.forEach(function (val, key) {
						cptcount++;
						datefield =[results.insertId,moments(new Date(val.date)).format('YYYY-MM-DD'),val.data.message,postData.userID,moments().format('YYYY-MM-DD')];
						daystrans.push(datefield);
						finalSet();
					});

				}
			}
		});
	}

};

module.exports.getProjectWeekoffDetails = function (req, res) {
	var postData=req.body;
	var query = db.query('SELECT CM.weekoff_days,LM.location_name FROM t_calender_loc_mas AS CM LEFT JOIN t_calender_loc_project_map AS CPM ON CPM.cal_loc_id_fk = CM.cal_loc_id_pk LEFT JOIN t_location_mas AS LM ON LM.location_id_pk =CM.location_id_fk WHERE CPM.project_id_fk= ?',[postData.projectID] ,function(err, results) {
		if (err) throw err;
		res.json(results);
	});	
};