'use strict';

var db = mysqldb.getDb()
, _this = module.exports
, multer = require('multer')
, path = require('path')
, filePath = path.resolve(__dirname, '..')
, location = 't_location_mas';

filePath = path.join(filePath, '/upload/projlogo/');
var upload = multer({ dest: filePath,
    rename : function (fieldname, filename, req, res) {
        return filename;
        //return  req.body.caseID
    },
    onFileUploadComplete: function (file, req, res) {
    	return file;
    }
});

module.exports.uploadprologo = function (req, res) {

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

module.exports.getUnit = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_delivery_unit_mas', function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});
};

module.exports.createUnit = function (req, res) {
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
	var query = db.query('INSERT INTO t_delivery_unit_mas SET ?', unitData, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateUnit = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var unitData = {
		dunit_name:postData.unitName,  
		dunit_desc:postData.remarks, 
		status:(postData.status === true)?1:0,
		updated_date: new Date(),
		updated_by:1
	};
	//insert record
	var query = db.query('UPDATE t_delivery_unit_mas SET ? WHERE dunit_id_pk = ?', [unitData,postData.id], function(err, result) {
		if (err) throw err;
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
		res.json(result);
	});
};


/* Location */

module.exports.getLocation = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM '+location, function(err, result) {
		if (err) throw err;
		
		res.json(result);
	});
};

module.exports.createLocation = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var locData = {
		location_name:postData.locationName,  
		location_desc:postData.remarks, 
		status:(postData.status === true)?1:0,
		created_date: new Date(),
		created_by:1,
		updated_date: new Date(),
		updated_by:1
	};
	//insert record
	var query = db.query('INSERT INTO '+location+' SET ?', locData, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateLocation = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var locData = {
		location_name:postData.locationName,  
		location_desc:postData.remarks, 
		status:(postData.status === true)?1:0,
		updated_date: new Date(),
		updated_by:1
	};
	//insert record
	var query = db.query('UPDATE '+location+' SET ? WHERE location_id_pk = ?', [locData,postData.id], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updateLocationStatus = function(req, res){
	//simple json record
	var postData = req.body;
	var status = 1;
	if(postData.status === 1) status = 0;
	var locData = {
		status:status
	};
	//Update status
	var query = db.query('UPDATE '+location+' SET ? WHERE location_id_pk = ?', [locData,postData.id], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

/* Location */


/* Client */

module.exports.getclientUnit = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_client_mas ORDER BY client_id_pk desc', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.createclientUnit = function (req, res) {
	var postData = req.body;
	if(postData) {
		var unitData = {
			client_name:postData.clientname,  
			client_street:postData.clientstreet,
			client_location:postData.clientlocation,
			client_city:postData.clientcity,
			client_state:postData.clientstate,
			client_country:postData.clientcountry,
			client_phone:postData.clientphone,
			client_fax:postData.clientfax,
			client_emailid:postData.clientemailid,
			client_contact_person:postData.clientcontactperson,
			client_contact_person_designation:postData.clientcontactpersondesignation,
			client_remarks:postData.clientremarks,
			created_date: new Date(),
			created_by:1,
			updated_date: new Date(),
			updated_by:1,
			status : 1
		};
		//insert record
		var query = db.query('INSERT INTO t_client_mas SET ?', unitData, function(err, result) {
			if (err) throw err;
			res.json(result);
		});
	} else {
		res.json(false);
	}
};

module.exports.updateClient = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var unitData = {
		client_name:postData.clientname,  
		client_street:postData.clientstreet,
		client_location:postData.clientlocation,
		client_city:postData.clientcity,
		client_state:postData.clientstate,
		client_country:postData.clientcountry,
		client_phone:postData.clientphone,
		client_fax:postData.clientfax,
		client_emailid:postData.clientemailid,
		client_contact_person:postData.clientcontactperson,
		client_contact_person_designation:postData.clientcontactpersondesignation,
		client_remarks:postData.clientremarks, 
		status:(postData.status === true)?1:0,
		updated_date: new Date(),
		updated_by:1
	};
	//insert record
	var query = db.query('UPDATE t_client_mas SET ? WHERE client_id_pk = ?', [unitData,postData.id], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};




/* Client */


/* New Project */

module.exports.getprojectUnit = function (req, res) {
	var postData = req.body;
	//select record
	// var query = db.query('SELECT PM.`project_id_pk`,PM.`project_name`,PM.`project_desc`,PM.`start_date`,PM.`go_live_date`,PM.`logo_path`,LM.location_name,DM.division_name,CM.client_name,PM.`location_id_fk`,PM.`division_id_fk`,PM.`client_id_fk` FROM `t_project_mas` as PM INNER JOIN `t_location_mas` AS LM ON LM.location_id_pk = PM.`location_id_fk` INNER JOIN `t_division_mas` AS DM ON DM.division_id_pk = PM.`division_id_fk` INNER JOIN `t_client_mas` AS CM ON CM.client_id_pk = PM.`client_id_fk`', function(err, result) {
		var query = db.query('SELECT PM.`project_id_pk`,PM.`project_name`,PM.`project_desc`,PM.`start_date`,PM.`go_live_date`,PM.`logo_path`,LM.location_name,DM.division_name,CM.client_name,PM.`location_id_fk`,PM.`division_id_fk`,PM.`client_id_fk`,CASE WHEN PM.lob =1 THEN "Technical Support(TS)"   ELSE "Customer Support(CS)" END AS LOBNAME,PM.lob,GROUP_CONCAT(BUM.bu_name SEPARATOR ",") AS BuName,GROUP_CONCAT(CONVERT(BUM.bu_id_pk, CHAR(8)) SEPARATOR ",") AS bu_id_pk,PM.prj_loc_timezone_id,PM.prj_golive_timezone_id FROM `t_project_mas` AS PM INNER JOIN `t_location_mas` AS LM ON LM.location_id_pk = PM.`location_id_fk` INNER JOIN `t_division_mas` AS DM ON DM.division_id_pk = PM.`division_id_fk` INNER JOIN `t_client_mas` AS CM ON CM.client_id_pk = PM.`client_id_fk` INNER JOIN t_project_bu_map AS BU ON BU.project_id_fk =PM.project_id_pk LEFT JOIN t_bu_mas AS BUM ON BUM.bu_id_pk = BU.bu_id_fk GROUP BY PM.project_id_pk ORDER BY project_id_pk DESC', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.createnewprojectUnit = function (req, res) {
	var postData = req.body,mapData=[];
	var projectID,projPlanMasterData,proplanMasID,proName,tempID,completionDate;
	
	if(postData) {
		var unitData = {
			project_name:postData.newprojectclientname,  
			project_desc:postData.newprojectprojectdescription,
			start_date:postData.newprojectstartdate,
			logo_path:postData.logoURL,
			go_live_date:postData.newprojectgolivedate,
			location_id_fk:postData.seleLocation,
			client_id_fk:postData.seleClient,
			division_id_fk:postData.seleDevision,
			template_id_fk:(postData.seleTemplate > 0) ? postData.seleTemplate : null,
			lob : postData.prolob,
			prj_loc_timezone_id : postData.selePrjTimeZ,
			prj_golive_timezone_id : postData.seleGoliveTimeZ
			// created_date: new Date(),
			// created_by:postData.userID,
			// updated_date: new Date(),
			// updated_by:1
		};

			

		//insert record
		var query = db.query('INSERT INTO t_project_mas SET ?', unitData, function(err, result) {
			if (err){
			 throw err;
			}
			else
			{
				projectID = result.insertId;
				proName = postData.newprojectclientname;
				completionDate = postData.newprojectgolivedate;
				//insert BU Map
				postData.businessunit.forEach(function (value, key) {
					mapData.push([projectID, value]);
				});
				db.query('INSERT INTO t_project_bu_map (project_id_fk, bu_id_fk) VALUES ?', [mapData], function(err, buRes) {
					if (err) {
						throw err;
					}else{
						if (projectID > 0 && postData.seleTemplate > 0) {
							 projPlanMasterData = {	
								project_id_fk : projectID,	 
								version:1,   
								phase_id_fk:1,   
								status:1
							};
							tempID = postData.seleTemplate ;
							db.query('INSERT INTO t_project_plan_mas SET ?', projPlanMasterData, function(err, ppmasres) {
								if (err) {
									throw err;
								}else{
									proplanMasID = ppmasres.insertId;
									db.query("INSERT INTO t_project_plan_trans (plan_mas_id_fk,task_name,parent_id,precedence,haschild,start_date,end_date) SELECT '"+proplanMasID+"',CASE parent_id WHEN 0 THEN '"+proName+"' else task_name END,parent_id,precedence,haschild,'"+completionDate+"','"+completionDate+"' FROM t_project_plan_tpl_trans WHERE project_plan_tpl_id_fk = ?",[tempID], function(err, ppres) {
										if (err) {
											throw err;
										}else{
											res.json({"ProjectID" : projectID,"ProjectName":postData.newprojectclientname,"divisionId":postData.seleDevision,"logoPath":postData.logoURL,"go_live_date":postData.newprojectgolivedate});
										}
									});
								}
							});

						}else{
							res.json({"ProjectID" : projectID,"ProjectName":postData.newprojectclientname,"divisionId":postData.seleDevision,"logoPath":postData.logoURL,"go_live_date":postData.newprojectgolivedate});
						}
					}
				});
			}
		});
	} else {
		res.json(false);
	}
};


module.exports.updateProject = function (req, res) {
	var postData = req.body, mapData = [];
	var propPlanMasID;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var unitData = {
			project_name:postData.newprojectclientname,  
			project_desc:postData.newprojectprojectdescription,
			start_date:postData.newprojectstartdate,
			logo_path:postData.logoURL,
			go_live_date:postData.newprojectgolivedate,
			location_id_fk:postData.seleLocation,
			client_id_fk:postData.seleClient,
			division_id_fk:postData.seleDevision,
			prj_loc_timezone_id : postData.selePrjTimeZ,
			prj_golive_timezone_id : postData.seleGoliveTimeZ
			// template_id_fk:1,
			// created_date: new Date(),
			// created_by:1,
			// updated_date: new Date(),
			// updated_by:1
	};
	//insert record
	db.query('DELETE FROM t_project_bu_map WHERE project_id_fk = ?', postData.id); //
	var query = db.query('UPDATE t_project_mas SET ? WHERE project_id_pk = ?', [unitData,postData.id], function(err, result) {
		if (err) {
			throw err;
		}else{
			postData.businessunit.forEach(function (value, key) {
				mapData.push([postData.id, value]);
			});
			db.query('INSERT INTO t_project_bu_map (project_id_fk, bu_id_fk) VALUES ?', [mapData], function(err, buRes) {
				if (err) {
					throw err
				}else{
						db.query('SELECT Count(*) as RecCount,`project_plan_mas_id_pk` as ProjPlanMasID FROM `t_project_plan_mas` WHERE `project_id_fk` = ?',[postData.id], function(err, respp) {
							if (respp[0].RecCount > 0) {
								propPlanMasID=respp[0].ProjPlanMasID;
								db.query('UPDATE t_project_plan_trans SET task_name= ? WHERE plan_mas_id_fk =? AND parent_id=0',[postData.newprojectclientname,propPlanMasID], function(err, resppup) {
									if (err) {
										throw err;
									}else{
										res.json(resppup);			
									}
								});
							}else{
								res.json(result);			
							}
					});
				}
			});
		}
	});
};



/* New Project */




/* Sow Summary */

module.exports.getsowUnit = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_sow_trans', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.createsowUnit = function (req, res) {
	var postData = req.body;
	if(postData) {
		var unitData = {
			sla:postData.sowsummarysla,  
			parameter:postData.sowsummaryparameter,
			matrix:postData.sowsummarymatrix,
			desc:postData.sowsummarydescription,
			project_id_fk:postData.projectID,
			// created_date: new Date(),
			// created_by:1,
			// updated_date: new Date(),
			// updated_by:1
		};
		//insert record
		var query = db.query('INSERT INTO t_sow_trans SET ?', unitData, function(err, result) {
			if (err) throw err;
			res.json(result);
		});
	} else {
		res.json(false);
	}
};

module.exports.updateSow = function (req, res) {
	var postData = req.body;
	var unitData = {
		sla:postData.sowsummarysla,  
		parameter:postData.sowsummaryparameter,
		matrix:postData.sowsummarymatrix,
		desc:postData.sowsummarydescription,
		project_id_fk:postData.projectID, 
		// status:(postData.status === true)?1:0,
		// updated_date: new Date(),
		// updated_by:1
	};
	//insert record
	var query = db.query('UPDATE t_sow_trans SET ? WHERE sow_id_pk = ?', [unitData,postData.id], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};


/* */
module.exports.getBilling = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT * FROM t_billing_cycle_mas', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

/* Sow Summary */




/* Invoice Summary */

module.exports.getinvoiceUnit = function (req, res) {
	var postData = req.body;
	//select record
	var query = db.query('SELECT inv.*, bc.cycle_name FROM t_invoice_trans inv LEFT JOIN t_billing_cycle_mas bc ON bc.cycle_id_pk = inv.billing_cycle_id_fk', function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.createinvoiceUnit = function (req, res) {
	var postData = req.body;
	console.log(postData.invoicedate);
	if(postData) {
		var unitData = {
		// sla:postData.invoiceprojectname,  
		sales_incharge:postData.invoicesalesincharge,
		// matrix:postData.invoiceprojectdescription,
		sbu_incharge:postData.invoicesbuincharge,
		du:postData.invoicedu,
		account_incharge:postData.invoiceaccountincharge,
		region:postData.invoiceregion,
		billing_location:postData.invoicebillinglocation,
		delivery_location:postData.invoicedeliverylocation,
		clien_name:postData.invoiceclientname,
		delivery_head:postData.invoicedeliveryhead,
		address:postData.invoiceaddress,
		delivery_incharge:postData.invoicedeliveryincharge,
		contact_person:postData.invoicecontactperson,
		po_no:postData.invoicepono,
		// desc:postData.invoicebillingcycle,
		invoice_date:postData.invoicedate,
		date_of_msa_sow:postData.invoicedatemsa,
		instructions:postData.invoiceinstructions,
		email_distribution:postData.invoiceemaildistribution,
		billing_cycle_id_fk:postData.invoicebillingcycle,
		project_id_fk:2,

			// created_date: new Date(),
			// created_by:1,
			// updated_date: new Date(),
			// updated_by:1
		};
		//insert record
		var query = db.query('INSERT INTO t_invoice_trans SET ?', unitData, function(err, result) {
			if (err) throw err;
			res.json(result);
		});
	} else {
		res.json(false);
	}
};

module.exports.updateInvoice = function (req, res) {
	var postData = req.body;
	//var timeDate = moment(new Date()).format('DD-MM-YYYY');
	var unitData = {
		// sla:postData.invoiceprojectname,  
		sales_incharge:postData.invoicesalesincharge,
		// matrix:postData.invoiceprojectdescription,
		sbu_incharge:postData.invoicesbuincharge,
		du:postData.invoicedu,
		account_incharge:postData.invoiceaccountincharge,
		region:postData.invoiceregion,
		billing_location:postData.invoicebillinglocation,
		delivery_location:postData.invoicedeliverylocation,
		clien_name:postData.invoiceclientname,
		delivery_head:postData.invoicedeliveryhead,
		address:postData.invoiceaddress,
		delivery_incharge:postData.invoicedeliveryincharge,
		contact_person:postData.invoicecontactperson,
		po_no:postData.invoicepono,
		// desc:postData.invoicebillingcycle,
		invoice_date:postData.invoicedate,
		date_of_msa_sow:postData.invoicedatemsa,
		instructions:postData.invoiceinstructions,
		email_distribution:postData.invoiceemaildistribution,
		billing_cycle_id_fk:postData.invoicebillingcycle, 
		project_id_fk:2,

		// status:(postData.status === true)?1:0,
		// updated_date: new Date(),
		// updated_by:1
	};
	//insert record
	var query = db.query('UPDATE t_invoice_trans SET ? WHERE invoice_id_pk = ?', [unitData,postData.id], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};
/* Invoice Summary */

