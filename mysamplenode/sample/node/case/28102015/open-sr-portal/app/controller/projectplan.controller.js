'use strict';

var db = mysqldb.getDb()
, _this = module.exports
, func = require('../config/func.js')
, util=require('util')
, moments = require('moment')
, multer = require('multer')
, path = require('path')
, alasql = require('alasql')
, filePath = path.resolve(__dirname, '..')
, _this = module.exports;
var sendMails = require('./mailtemplate.controller');


filePath = path.join(filePath, '/upload/taskattachments/');
var files,filesField,taskcomments,commentsField;
module.exports.saveProjectPlan = function (req, res) {
	
	var postData = req.body, treeData, projPlanMasterID , projPlanMasterData,projStartDate,projEndDate;
	// var proDate = alasql("SELECT Startdate,Enddate FROM ? WHERE Parentid = 0",[postData.treedata]); //Get proj start/End Date
	// projStartDate = proDate[0].Startdate;
	// projEndDate = proDate[0].Enddate;
	// console.log(postData);
	treeData=postData.treedata;
	var projPlanMasterData = {	
		project_id_fk : postData.projectId,	 
		version:postData.version,   
		phase_id_fk:postData.PhaseId,   
		status:postData.status,
		hideoptions : postData.hideoptions,
		isExecutionPlan : (postData.PhaseId == 2) ? 1 : ((postData.isExecutionPlan == 1) ? postData.isExecutionPlan : 0)
	};

	db.beginTransaction(function(err) {//start beginTransaction
		  if (err) {
		  	 db.rollback(function() {
		        throw err;
		      });
		  	}else{
		  		db.query('SELECT Count(*) as RecCount,`project_plan_mas_id_pk` as ProjPlanMasID,`version` FROM `t_project_plan_mas` WHERE `project_id_fk` = ?', [postData.projectId], function(err, result) {
		  			if (err) {
	  				 db.rollback(function() {
				        throw err;
				      });
	  				}else{
	  					// console.log("result[0].RecCount==========",result[0].RecCount);
	  					if(result[0].RecCount > 0) {
				  			//Update project plan master details
				  			db.query('UPDATE t_project_plan_mas SET ? WHERE project_plan_mas_id_pk = ?', [projPlanMasterData, result[0].ProjPlanMasID], function(err, upres) {
				  				if (err) {
				  					db.rollback(function() {
							        	throw err;
							      	});
				  				}else{
				  					projPlanMasterID=result[0].ProjPlanMasID;
				  					if (postData.PhaseId < 3) {//Insert Proposal and Execution paln alone
				  						db.query('DELETE FROM t_project_plan_trans WHERE plan_mas_id_fk = ?', [projPlanMasterID], function(err, delres) {
					  						if (err) {
							  					db.rollback(function() {
										        	throw err;
										      	});
						  					} else {
						  						_this.insertProjectplan(treeData,db,projPlanMasterID,postData,res,function (e) { 
					  								db.rollback(function() {
					  									throw err;
					  								});
						  						});
						  					}
				  						});
				  					}else{
				  						db.commit(function(err) {
											if (err) {
												db.rollback(function() {
									            	res.json({result:false});
									          	});
											}
											res.json({result:true});
										});
				  					}
				  				}
				  			});
				  		}else{
				  			// console.log("==================New Insert on PP master==================");
				  			//Insert New Record project plan master details
				  			var query = db.query('INSERT INTO t_project_plan_mas SET ? ', projPlanMasterData, function (err, insres) {
				  				// console.log(query.sql);
				  				if (err) {
				  					db.rollback(function() {
							        	throw err;
							      	});

				  				}else{
				  					projPlanMasterID=insres.insertId;
				  					//console.log("==================New Insert on Task called==================");
				  					_this.insertProjectplan(treeData,db,projPlanMasterID,postData,res,function (e) {
		  								db.rollback(function() {
		  									throw err;
		  								});
			  						});
				  				}
				  			});
				  		}
	  				}
		  		});//End check project plan availability
		  	} //End else
	});//End beginTransaction
};

module.exports.updateProjectMaster = function (req,res){
	var postData = req.body;
	var projMaster ={
		start_date : moments(new Date(postData.proStart)).format('YYYY-MM-DD'),
		go_live_date : moments(new Date(postData.proEnd)).format('YYYY-MM-DD')
	}	
	db.query('UPDATE t_project_mas SET ? WHERE project_id_pk = ? ',[projMaster,postData.projectID], function(err, result) {
		if (err){ 
			throw err;
		}else{
			res.json({result:true});
		}
	});
};

module.exports.insertProjectplan = function (treeData,dbrc,projplanmasID,postData,res,callback){
	// console.log("===================insertProjectplan calledsdfsdf=======================");
	try	{
		var complete = 0, filecnt = 0 , cmtcnt = 0;
		var finalSet = function () {
			complete++;
			if(complete === treeData.length) {
				if (filecnt > 0 || cmtcnt > 0) {
					if (filecnt > 0) {
						dbrc.query('INSERT INTO t_project_plan_attachment_trans (project_plan_trans_id_fk, attachment_original_file_name,attachment_temp_file_name,attachment_file_path,attachment_file_size,attachment_uploaded_date,attachment_uploaded_by) VALUES ?', [files], function(err, filres) {
							if (err) {
								dbrc.rollback(function() {
						        throw err;
						      });
							}else{
								if (cmtcnt > 0) {
										var qur=dbrc.query('INSERT INTO t_project_plan_comments_trans (project_plan_trans_id_fk,comments_desc,comments_date,comments_uploaded_by) VALUES ?', [taskcomments], function(err, comres) {
											if (err) {
												dbrc.rollback(function() {
										        throw err;
										      });
											}else{
												dbrc.commit(function(err) {
													if (err) {
														dbrc.rollback(function() {
											            	res.json({result:false});
											          	});
													}
													res.json({result:true});
												});
											}
										});//End comments Insert
									}else{
										dbrc.commit(function(err) {
											if (err) {
												dbrc.rollback(function() {
									            	res.json({result:false});
									          	});
											}
											res.json({result:true});
										});
									}
							}
						});//End attachment Insert
					}else{
						if (cmtcnt > 0) {
								var qur=dbrc.query('INSERT INTO t_project_plan_comments_trans (project_plan_trans_id_fk,comments_desc,comments_date,comments_uploaded_by) VALUES ?', [taskcomments], function(err, comres) {
									if (err) {
										dbrc.rollback(function() {
								        throw err;
								      });
									}else{
										dbrc.commit(function(err) {
											if (err) {
												dbrc.rollback(function() {
									            	res.json({result:false});
									          	});
											}
											res.json({result:true});
										});
									}
								});//End comments Insert
							}else{
								dbrc.commit(function(err) {
									if (err) {
										dbrc.rollback(function() {
							            	res.json({result:false});
							          	});
									}
									res.json({result:true});
								});
							}
					}
						
				}else{
					dbrc.commit(function(err) {
						if (err) {
							dbrc.rollback(function() {
				            	res.json({result:false});
				          	});
						}
						res.json({result:true});
					});
				}
				
			}
		};
		files=[];
		taskcomments=[];
		var pArr={};
		var rooid = 0;
		treeData.forEach(function (val, key) {
			pArr[val.Parentid] = ({'id':val.TreeId,'pid':val.Parentid});
			if(val.Parentid > 0) {
				rooid = pArr[(val.Parentid - 1)].id;
			}
			var taskDet={
				plan_mas_id_fk : projplanmasID,
				// materialized_path :
				parent_id : val.Parentid,
				status : val.Status,
				task_name : val.Taskname,
				primary_owner :((postData.PhaseId) == 1) ? val.Primaryowner : ((val.Primaryowner == undefined) ? '' : val.Primaryowner),
				secondary_owner : ((postData.PhaseId) == 1) ? val.Secondaryowner : ((val.Secondaryowner == undefined) ? '' : val.Secondaryowner),
				start_date : moments(new Date(val.Startdate)).format('YYYY-MM-DD'),
				end_date : moments(new Date(val.Enddate)).format('YYYY-MM-DD'),
				start_day : val.Startday,
				end_day : val.Endday,
				duration : val.Duration,
				precedence : val.Predecessors,
				progress_percent : val.Progress,											
				created_by : postData.userId,
				updated_by : postData.userId,
				created_date : moments().format('YYYY-MM-DD'),
				update_date : moments().format('YYYY-MM-DD'),
				version : postData.version,
				haschild : val.isChecked,
				ishighLevelPlan : val.ishighlevelplan,
				actual_startdate : (val.actual_startdate == null) ? null :  moments(new Date(val.actual_startdate)).format('YYYY-MM-DD'),
				actual_enddate : (val.actual_enddate == null) ? null :  moments(new Date(val.actual_enddate)).format('YYYY-MM-DD'),
				treeID : val.TreeId,
				rootID : rooid
			};


			var query = dbrc.query('INSERT INTO t_project_plan_trans SET ?', taskDet, function(err, taskres) {
				if (err) {
					dbrc.rollback(function() {
				        throw err;
				     });
				} else {
					if (util.isArray(val.Files) && val.Files.length > 0) {
						val.Files.forEach(function (fi, key) {
							filecnt++;
							filesField = [taskres.insertId,fi.filename,fi.tempfilename,fi.filepath,fi.size,moments(new Date(fi.uploadedon)).format('YYYY-MM-DD HH:mm:ss'),fi.uploadedby];
							files.push(filesField);
						}); //End files foreach
					}
					if (util.isArray(val.Comments) && val.Comments.length > 0) {
						val.Comments.forEach(function (com, key) {
							cmtcnt++;
							commentsField = [taskres.insertId,com.Comments,moments(new Date(com.CommentOn)).format('YYYY-MM-DD HH:mm:ss'),com.CommentsBy];
							taskcomments.push(commentsField);
						}); //End files foreach
					}
					finalSet();
				}
			});//End Insert Project plan
		});//Treedata foreach end
	}catch(e){
		callback(e);
	}
}

module.exports.getProjectPlanDetails = function (req, res) {
	var postData=req.body;
	var nestedRows;
	 db.query('SELECT Count(*) as RecCount,`project_plan_mas_id_pk` as ProjPlanMasID FROM `t_project_plan_mas` WHERE `project_id_fk` = ?',[postData.ProjectID], function(err, result) {
		if (err){ 
			throw err;
		}else{
			if (result[0].RecCount > 0) {
				var mainQuery ='SELECT * FROM `t_project_plan_trans` as PP LEFT OUTER JOIN `t_project_plan_attachment_trans` as Files on Files.`project_plan_trans_id_fk` = PP.`project_plan_trans_id_pk` LEFT OUTER JOIN `t_project_plan_comments_trans` as comment on comment.`project_plan_trans_id_fk` = PP.`project_plan_trans_id_pk` WHERE PP.`plan_mas_id_fk` ='+result[0].ProjPlanMasID;
				var options = {sql: mainQuery, nestTables: true};
				 var nestingOptions = [
				        { tableName : 'PP', pkey: 'project_plan_trans_id_pk'},
				        { tableName : 'Files', pkey: 'attachment_id_pk', fkeys:[{table:'PP',col:'project_plan_trans_id_fk'}]},
				        { tableName : 'comment', pkey: 'comments_id_pk', fkeys:[{table:'PP',col:'project_plan_trans_id_fk'}]}
			    	];
				db.query(options, function(err, result) {
					if (err){ 
						throw err;
					}else{
						 nestedRows = func.convertToNested(result, nestingOptions);
						 res.json(nestedRows);	
					}
				});
			}else{
				db.query('SELECT project_name as ProjectName,`go_live_date` as CompletionDate,start_date as ProStartDate FROM `t_project_mas` WHERE `project_id_pk` = ?',[postData.ProjectID], function(err, projres) {
					if (err){ 
						throw err;
					}else{
						nestedRows=[{
								"id": postData.ProjectID,
								"task_name": projres[0].ProjectName,
								"primary_owner": "",
								"secondary_owner": "",
								"duration": 1,
								"start_date": projres[0].ProStartDate,
								"end_date":  projres[0].ProStartDate,
								"status": "STATUS_UNDEFINED",
								"Comments": [],
								"Files": [],
								"progress_percent": 0,
								"precedence": "",
								"parent_id": 0,
								"TreeId": 1,
								"haschild": false,
								"startIsMilestone": true,
								"ishighLevelPlan" : false,
								"actual_startdate" : null,
								"actual_enddate" : null,
								"created_by": "",
								"created_date": moments().format('DD/MM/YYYY')
							}];
						res.json(nestedRows);		
					}
				});				
				
			}
		}
	});
};

module.exports.getPhaseDetails = function (req, res){
	db.query('SELECT `phase_id_pk` as PhaseID,`phase_name` as PhaseName FROM `t_phase_mas`',function(err, result) {
		if (err){ 
			throw err;
		}else{
			res.json(result);
		}
	});
};

module.exports.getUsers = function (req, res){
	db.query('SELECT `user_id_pk` as id,`first_name` as value FROM `t_user_mas` WHERE `status`=1',function(err, result) {
		if (err){ 
			throw err;
		}else{
			res.json(result);
		}
	});
};

var upload = multer({ dest: filePath,
    rename : function (fieldname, filename, req, res) {
        return filename;
        //return  req.body.caseID
    },
    onFileUploadComplete: function (file, req, res) {
    	return file;
    }
});



module.exports.uploadDoc = function (req, res) {

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


module.exports.getCurrentPhase = function (req, res){
	var postData = req.body;
	var val={};
	db.query('SELECT Count(*) as RecCount,`project_plan_mas_id_pk` as ProjPlanMasID,`version`,phase_id_fk as PhaseID FROM `t_project_plan_mas` WHERE `project_id_fk` = ?',[postData.projectId],function(err, result) {
			if (err){ 
				throw err;
			}
			else{
				if(result[0].RecCount > 0) {
					db.query('SELECT `phase_id_pk` as PhaseID,`phase_name` as PhaseName FROM `t_phase_mas` WHERE phase_id_pk =?',[result[0].PhaseID],function(err, result){
						if (err){ 
							throw err;
						}else{
							val.Isproposal = true;
							val.PropDet = result;
							res.json(val);
						}
					});
				}else{
					db.query('SELECT `phase_id_pk` as PhaseID,`phase_name` as PhaseName FROM `t_phase_mas` WHERE phase_id_pk = 1',function(err, result) 	{
						if (err){ 
							throw err;
						}else{
							var val={};
							val.Isproposal = false;
							val.PropDet = result;
							res.json(val);
						}
					});
				}
			}
	});
};

module.exports.getEnabledPhase = function (req, res){
	var postData = req.body;
	var phaseID=postData.currentPhaseID;
	var enable=[];
	switch(phaseID) {
		    case 1: //Proposal
		        enable = [2,3,4,5];
		        break;
		    case 2: //Execution
		        enable = [3,4,5];
		        break;
	        case 3: //Onhold
	        	db.query('SELECT Count(*) as RecCount FROM `t_project_plan_mas` WHERE isExecutionPlan = 1 AND `project_id_fk` = ?',[postData.projectId], function(err, result) {
					if (err){ 
						throw err;
					}else{
						if (result[0].RecCount > 0) {
							enable = [2,4];
						}else{
							enable = [1,4];
						}
						res.json({"EnabledPhaseID" : enable});
					}
				});
		        break;
		    case 4:
		        enable = [];
		        break;
		    case 5:
		        enable = [];
		        break;
	}
	if (postData.currentPhaseID != 3) {
		res.json({"EnabledPhaseID" : enable});	
	}
};

module.exports.saveTemplate = function (req, res) {
	var postData = req.body, treeData, tempMasterID , tempTask,tempTaskDetails;
	// console.log(postData);
	treeData=postData.tasks;
	 
	var templateMasterDet = {	
		tpl_name : postData.tempName,	 
		tpl_desc:postData.tempDesc, 
		created_by:postData.userID,  
		updated_by:postData.userID,   
		created_date:moments().format("YYYY-MM-DD"),
		updated_date :moments().format("YYYY-MM-DD"),
		status : 1
	};	

	db.beginTransaction(function(err) {//start beginTransaction
	  if (err) {
	  	 db.rollback(function() {
	        throw err;
	      });
	  	}else{
	  		var query = db.query('INSERT INTO t_project_plan_tpl_mas SET ? ', templateMasterDet, function (err, insres) {
	  			if (err) {
  					db.rollback(function() {
			        	throw err;
			      	});

  				}else{
  					console.log("Master Saved Successfulley=====",insres.insertId);
  					var complete=0;
  					var finalSet = function () {
						if (complete === treeData.length) {
							db.query('INSERT INTO t_project_plan_tpl_trans(parent_id,task_name,start_day,end_day,duration,precedence,haschild,project_plan_tpl_id_fk) VALUES  ? ', [tempTaskDetails], function (err, insres) {
									if (err) {
					  					db.rollback(function() {
								        	throw err;
								      	});

					  				}else{
					  					db.commit(function(err) {
											if (err) {
												db.rollback(function() {
									            	res.json({result:false});
									          	});
											}
											res.json({result:true});
										});
					  				}
							});
						}
  					};
  					tempMasterID=insres.insertId;
  					tempTaskDetails= [];
  					treeData.forEach(function (val, key) {
  						complete++;
						tempTask = [val.Parentid,val.Taskname,val.Startday,val.Endday,val.Duration,val.Predecessors,val.hasChild,tempMasterID];
						tempTaskDetails.push(tempTask);
					});//Treedata foreach end
					finalSet();
  				}
	  		});
  		}
	});//End beginTransaction
};

module.exports.getCurrentPlanOption = function (req, res) {
	var postData=req.body;
	 db.query('SELECT Count(*) as RecCount,`hideoptions` as ColDetails,isExecutionPlan,isapprovalmail,isclientapproved FROM `t_project_plan_mas` WHERE `project_id_fk` = ?',[postData.projectId], function(err, result) {
		if (err){ 
			throw err;
		}else{
			var resval = {};
			resval.coldetails =result[0].ColDetails;
			resval.isExecution =result[0].isExecutionPlan;
			resval.isapprovalmail =result[0].isapprovalmail;
			resval.isclientapproved =result[0].isclientapproved;
			res.json(resval);
		}
	});
};

module.exports.sendMailToClient = function (req,res) {
	var postData = req.body;
	var query = db.query('SELECT GROUP_CONCAT(UM.email SEPARATOR ";") AS Receipients FROM t_user_mas AS UM INNER JOIN t_user_project_map PM ON PM.user_id_fk = UM.user_id_pk WHERE UM.user_role_id_fk =2 AND PM.project_id_fk =? GROUP BY PM.project_id_fk',[postData.projectID], function(err, result) {
			if (err){throw err;}
			else{
				if (result.length > 0) {
					var mapObj,mailTemp;
					mapObj = {
							   '#ProjectName#':postData.projectName,
							   '#PlanPhase#':postData.phaseName
							};
					mailTemp = 'projectplantpl';
					var mailData = {
						'to':'thirumaran.dhanapal@csscorp.com', //result[0].Receipients
						'replace': mapObj
					};
					db.query('UPDATE t_project_plan_mas SET isapprovalmail =1 WHERE project_id_fk = ?',[postData.projectID], function(err, result) {
						if (err) {
							throw err;
						}else{
							sendMails.sendEmail(mailTemp, mailData, function (result1) {
								res.json(result1);
							});
						}
					});
				}
			} 
	});
};

module.exports.clientApproval = function (req,res) {
	var postData = req.body;
	var query = db.query('SELECT GROUP_CONCAT(UM.email SEPARATOR ";") AS Receipients FROM t_user_mas AS UM INNER JOIN t_user_project_map PM ON PM.user_id_fk = UM.user_id_pk WHERE UM.user_role_id_fk =1 AND PM.project_id_fk =? GROUP BY PM.project_id_fk',[postData.projectID], function(err, result) {
			if (err){throw err;}
			else{
				if (result.length > 0) {
					var mapObj,mailTemp;
					if (postData.clientStatus == 1) {
						mapObj = {
							   '#ProjectName#':postData.projectName,
							   '#ApproveStatus#':'Approved',
							   '#ClientName#' : postData.clientName
							};
						mailTemp = 'clientapprovetpl';
					}else{
						mapObj = {
							   '#ProjectName#':postData.projectName,
							   '#ApproveStatus#':'Rejected',
							   '#ClientName#' : postData.clientName,
							   '#ClientComments#' : postData.clientComments,
							};
						mailTemp = 'clientrejecttpl';
					}
					
					var mailData = {
						'to': result[0].Receipients, //'thirumaran.dhanapal@csscorp.com'
						'replace': mapObj
					};
					var planUpdate={
						isapprovalmail : postData.clientStatus,
						isclientapproved : postData.clientStatus,
						clientcomments : postData.clientComments
					};
					db.query('UPDATE t_project_plan_mas SET ? WHERE project_id_fk = ?',[planUpdate,postData.projectID], function(err, result) {
						if (err) {
							throw err;
						}else{
							sendMails.sendEmail(mailTemp, mailData, function (result1) {
								res.json(result1);
							});
						}
					});
				}
			} 
	});
};

module.exports.getProjectCalendar =function (req,res){
	var postData = req.body, resutSet = {}, sqlStr ='';
	sqlStr = 'SELECT * FROM t_calender_loc_mas AS CM LEFT JOIN t_calender_loc_holidays_trans AS HT ON HT.cal_loc_id_fk = CM.cal_loc_id_pk LEFT JOIN t_calender_loc_project_map AS CPM ON CPM.cal_loc_id_fk = CM.cal_loc_id_pk WHERE CPM.project_id_fk =?';
	
	var options = {sql: sqlStr, nestTables: true};
    var nestingOptions = [
        { tableName : 'CM', pkey: 'cal_loc_id_pk'},
        { tableName : 'HT', pkey: 'holidays_id_pk', fkeys:[{table:'CM',col:'cal_loc_id_fk'}]}        
    ];
	var query = db.query(options,[postData.projectId] ,function(err, results) {
		if (err) throw err;
		var nestedRows = func.convertToNested(results, nestingOptions);
		res.json(nestedRows);
	});
};