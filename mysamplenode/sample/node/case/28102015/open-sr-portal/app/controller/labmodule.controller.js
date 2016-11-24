'use strict';

var db = mysqldb.getDb()
, _this = module.exports
, func = require('../config/func.js')
, tbl_catmas = 't_labrrf_ctgy_mas'
, tbl_scatmas = 't_labrrf_subctgy_mas'
, tbl_labmas = 't_labrrf_trans_mas'
, tbl_labtrans = 't_labrrf_trans';

module.exports.getCategories = function (req, res) {
	var postData = req.body;
	//select record
	var mainSql1 = "SELECT * FROM  "+tbl_catmas+"; ";
	var mainSql2 = "SELECT * FROM  "+tbl_scatmas+"; ";
	var mainSql3 = "SHOW TABLE STATUS LIKE  '"+tbl_scatmas+"'";
	var query = db.query(mainSql1+mainSql2+mainSql3, function(err, result) {
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

module.exports.getLabmodule = function (req, res) {
	var postData = req.body;
	//select record
	var prjId = postData.prjId;

	var query1 = db.query('SELECT COUNT(*) as cnt FROM '+tbl_labmas+' WHERE project_id_fk='+prjId, function(err, result1) {
		if (err) throw err;
		if(result1[0].cnt == 0) {
			//account_manager,final_version,timezone_id_fk,roll_out_date,location,no_of_postion,emp_details,hs_no_of_seat,hs_no_of_systems
			var sql = "INSERT INTO "+tbl_labmas+" (project_id_fk,account_manager,final_version,timezone_id_fk,roll_out_date,location,no_of_postion,emp_details,hs_no_of_seat,hs_no_of_systems) VALUES ?";
			var values = [[prjId, '', '', 1,'','',0,'',0,0]];

			var query2 = db.query(sql, [values], function(err,result2) {
				if (err) throw err;
				sql = "INSERT INTO "+tbl_labtrans+" (project_id_fk, labrrf_trans_mas_id_fk, labrrf_ctgy_id_fk, labrrf_subctgy_id_fk) SELECT '"+prjId+"','"+result2.insertId+"', labrrf_ctgy_id_fk, labrrf_subctgy_id_pk FROM "+tbl_scatmas+" WHERE defined_fields = 1";
				var query3 = db.query(sql, function(err, result3) {
					if (err) throw err;
					
					var mainSql = "SELECT * FROM  t_labrrf_trans_mas t1 LEFT JOIN t_labrrf_trans t2 ON t2.labrrf_trans_mas_id_fk = t1.idt_labrrf_trans_mas_id_pk INNER JOIN t_labrrf_subctgy_mas t3 ON t3.labrrf_subctgy_id_pk = t2.labrrf_subctgy_id_fk WHERE t1.project_id_fk="+prjId;

					var options = {sql: mainSql, nestTables: true};

				    var nestingOptions = [
				        { tableName : 't1', pkey: 'idt_labrrf_trans_mas_id_pk'},
				        { tableName : 't2', pkey: 'labrrf_trans_id_pk', fkeys:[{table:'t1',col:'labrrf_trans_mas_id_fk'}]},
				        { tableName : 't3', pkey: 'labrrf_subctgy_id_pk', fkeys:[{table:'t2',col:'labrrf_subctgy_id_fk'}]}
				    ];

					var query = db.query(options, function(err, results) {
						if (err) throw err;
						var nestedRows = func.convertToNested(results, nestingOptions);
						
						res.json(nestedRows);
					});

				});
			});
		} else {
			var mainSql = "SELECT * FROM  t_labrrf_trans_mas t1 LEFT JOIN t_labrrf_trans t2 ON t2.labrrf_trans_mas_id_fk = t1.idt_labrrf_trans_mas_id_pk INNER JOIN t_labrrf_subctgy_mas t3 ON t3.labrrf_subctgy_id_pk = t2.labrrf_subctgy_id_fk WHERE t1.project_id_fk="+prjId;

			var options = {sql: mainSql, nestTables: true};

		    var nestingOptions = [
		        { tableName : 't1', pkey: 'idt_labrrf_trans_mas_id_pk'},
		        { tableName : 't2', pkey: 'labrrf_trans_id_pk', fkeys:[{table:'t1',col:'labrrf_trans_mas_id_fk'}]},
		        { tableName : 't3', pkey: 'labrrf_subctgy_id_pk', fkeys:[{table:'t2',col:'labrrf_subctgy_id_fk'}]}
		    ];

			var query = db.query(options, function(err, results) {
				if (err) throw err;
				var nestedRows = func.convertToNested(results, nestingOptions);
				
				res.json(nestedRows);
			});
		} 
	});	
};

module.exports.saveLabmodultTrans = function (req, res) {
	var postData = req.body;
	
	//var prjId = postData.prjId;
	var labData = {
		project_id_fk:postData.project_id_fk,  
		labrrf_trans_mas_id_fk:postData.labrrf_trans_mas_id_fk,   
		labrrf_ctgy_id_fk:postData.labrrf_ctgy_id_fk,   
		labrrf_subctgy_id_fk:postData.labrrf_subctgy_id_fk,   
		labrrf_trans_desc:postData.labrrf_trans_desc,   
		labrrf_trans_remarks:postData.labrrf_trans_remarks
	};

    var query1 = db.query("SELECT COUNT(*) as cnt, labrrf_subctgy_id_pk FROM "+tbl_scatmas+" WHERE labrrf_ctgy_id_fk="+postData.labrrf_ctgy_id_fk+" AND labrrf_subctgy_name='"+postData.labrrf_subctgy_id_fk+"'", function(err, result1) {
    	if (err) throw err;

		if(result1[0].cnt == 0) {

			var sql = "INSERT INTO "+tbl_scatmas+" (labrrf_ctgy_id_fk, labrrf_subctgy_name, labrrf_subctgy_desc, soundex, defined_fields, created_by, updated_by, created_date, updated_date, status) VALUES ? ";
			var values = [[postData.labrrf_ctgy_id_fk, postData.labrrf_subctgy_id_fk, postData.labrrf_subctgy_id_fk,postData.labrrf_subctgy_id_fk,0,1,1,new Date(),new Date(),1]];

			var query2 = db.query(sql, [values], function(err, result2) {
				if (err) throw err;
				labData.labrrf_subctgy_id_fk = result2.insertId;
				var firstChar  = postData.id[0];
				if(firstChar === "n") {
					sql = "INSERT INTO "+tbl_labtrans+" SET ?";
					var query = db.query(sql, labData, function(err, result) {
						if (err) throw err;

						result.labrrf_subctgy_id_fk = result2.insertId;
						res.json(result);
					});
				} else {
					sql = "UPDATE "+tbl_labtrans+" SET ? WHERE labrrf_trans_id_pk = ?";
					var query = db.query(sql, [labData,postData.id], function(err, result) {
						if (err) throw err;

						result.labrrf_subctgy_id_fk = result2.insertId;
						res.json(result);
					});
				}
			});
			
		} else {
			var firstChar  = postData.id[0];
			labData.labrrf_subctgy_id_fk = result1[0].labrrf_subctgy_id_pk;
			if(firstChar === "n") {
				sql = "INSERT INTO "+tbl_labtrans+" SET ?";
				var query = db.query(sql, labData, function(err, result) {
					if (err) throw err;

					result.labrrf_subctgy_id_fk = result1[0].labrrf_subctgy_id_pk;
					res.json(result);
				});
			} else {
				sql = "UPDATE "+tbl_labtrans+" SET ? WHERE labrrf_trans_id_pk = ?";
				var query = db.query(sql, [labData,postData.id], function(err, result) {
					if (err) throw err;

					result.labrrf_subctgy_id_fk = result1[0].labrrf_subctgy_id_pk;
					res.json(result);
				});
			}
		}

    });
};

module.exports.delLabmodultTrans = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('DELETE FROM '+tbl_labtrans+' WHERE labrrf_trans_id_pk = ?',[postData.id], function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});
};

module.exports.saveLabmodule = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var labData = {
		account_manager:postData.account_manager,
		final_version:postData.final_version,
		timezone_id_fk:postData.timezone_id_fk,
		roll_out_date:postData.	roll_out_date,
		location:postData.location,
		no_of_postion:postData.no_of_postion,
		emp_details:postData.emp_details,
		hs_no_of_seat:postData.hs_no_of_seat,
		hs_no_of_systems:postData.hs_no_of_systems
	};
	//insert record
	var query = db.query('UPDATE t_labrrf_trans_mas SET ? WHERE idt_labrrf_trans_mas_id_pk = ?', [labData,postData.idt_labrrf_trans_mas_id_pk], function(err, result) {
		if (err) throw err;

		res.json(result);
	});
};