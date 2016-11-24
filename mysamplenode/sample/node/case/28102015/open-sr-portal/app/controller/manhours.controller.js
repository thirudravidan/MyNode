'use strict';

var db = mysqldb.getDb()
, _this = module.exports;

module.exports.getManhours = function (req, res) {
	var postData = req.body;
	//select record
	var prjId = postData.prjId;
	//project_id_fk cost_per_hour_effort 	tot_man_hour overall_effort
	var query1 = db.query('SELECT COUNT(*) as cnt FROM t_man_hours_calc_mas WHERE project_id_fk='+prjId+'', function(err, result1) {
		if (err) throw err;

		if(result1[0].cnt == 0) {
			var sql = "INSERT INTO t_man_hours_calc_mas (project_id_fk,cost_per_hour_effort,tot_man_hour,overall_effort) VALUES ?";
			var values = [ [prjId, 0, 0, 0] ];
			var query2 = db.query(sql, [values], function(err,result2) {
				console.log(query2.sql);
				var query = db.query('SELECT tm1.*, tm2.* FROM t_man_hours_calc_mas tm1 LEFT JOIN t_man_hours_calc_trans tm2 ON tm2.man_hours_calc_id_fk = tm1.man_hours_calc_id_pk WHERE tm1.project_id_fk='+prjId, function(err, result) {
					if (err) throw err;
					
					res.json(result);
				});
			});
		} else {
			var query = db.query('SELECT tm1.*, tm2.* FROM t_man_hours_calc_mas tm1 LEFT JOIN t_man_hours_calc_trans tm2 ON tm2.man_hours_calc_id_fk = tm1.man_hours_calc_id_pk WHERE tm1.project_id_fk='+prjId, function(err, result) {
				if (err) throw err;
				
				res.json(result);
			});
		}
	});
};

module.exports.saveManHours = function (req, res) {
	var postData = req.body;
	//comm_matrix_trans_id_pk comm_matrix_id_fk user_id_fk comm_matrix_stkname comm_matrix_role comm_matrix_email   comm_matrix_telephone comm_matrix_mobile comm_matrix_subcomm timezone_id_fk
	var prjId = postData.project_id_fk;
	var tmin = (parseInt(postData.recurrence) * parseInt(postData.minutes));
	var mhour = (tmin / 60);
	var tcost = (mhour * postData.costperhour);
	var commData = {
		man_hours_calc_id_fk:postData.man_hours_calc_id_fk,  
		name:postData.name,   
		recurrence:postData.recurrence,   
		minutes:postData.minutes,   
		overall_minutes: tmin,   
		manhours:mhour,   
		effort_cost:tcost,
		costperhour:postData.costperhour
	};
	//insert record costperhour
	if(postData.id[0] === "n") {
		var sql = "INSERT INTO t_man_hours_calc_trans SET ?";
		var query = db.query(sql, commData, function(err, resulto) {
			if (err) throw err;
			sql = "UPDATE t_man_hours_calc_mas t1 INNER JOIN (SELECT `man_hours_calc_id_fk`, SUM(manhours) as mhours, SUM(effort_cost) as tcost FROM t_man_hours_calc_trans) t2 ON t1.man_hours_calc_id_pk = t2.man_hours_calc_id_fk SET t1.tot_man_hour = t2.mhours, t1.overall_effort = t2.tcost WHERE t1.project_id_fk=?";

			var queryRes = db.query(sql, [prjId], function(err, result) {
				if (err) throw err;
				
				res.json(resulto);
			});
		});
	} else {
		var sql = "UPDATE t_man_hours_calc_trans SET ? WHERE man_hours_calc_trans_id_pk = ?";
		var query = db.query(sql, [commData,postData.id], function(err, resulto) {
			if (err) throw err;
			sql = "UPDATE t_man_hours_calc_mas t1 INNER JOIN (SELECT `man_hours_calc_id_fk`, SUM(manhours) as mhours, SUM(effort_cost) as tcost FROM t_man_hours_calc_trans) t2 ON t1.man_hours_calc_id_pk = t2.man_hours_calc_id_fk SET t1.tot_man_hour = t2.mhours, t1.overall_effort = t2.tcost WHERE t1.project_id_fk=?";

			var queryRes = db.query(sql, [prjId], function(err, result) {
				if (err) throw err;

				res.json(resulto);
			});
		});
	}
	
};

module.exports.updateCommTrans = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var unitData = {
		dunit_name:postData.unitName,  
		dunit_desc:postData.remarks, 
		status:(postData.status === true)?1:0,
		created_date: new Date(),
		created_by:1,
		updated_date: new Date(),
		updated_by:1
	};
	//insert record
	var query = db.query('UPDATE t_delivery_unit_mas SET ? WHERE dunit_id_pk = ?', [unitData,postData.id], function(err, result) {
		if (err) throw err;
		console.log(query.sql); 
		res.json(result);
	});
};

module.exports.updateUnitStatus = function(req, res){
	//simple json record
	var postData = req.body;
	var status = 1;
	if(postData.status === 1) status = 0;
	var unitData = {
		status:status
	};
	//Update status
	var query = db.query('UPDATE t_delivery_unit_mas SET ? WHERE dunit_id_pk = ?', [unitData,postData.id], function(err, result) {
		if (err) throw err;
		console.log(query.sql); 
		res.json(result);
	});
};