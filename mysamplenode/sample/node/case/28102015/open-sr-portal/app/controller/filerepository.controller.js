'use strict';

var db = mysqldb.getDb()
, _this = module.exports;

module.exports.getAllTask = function (req, res) {
	var postData = req.body;
	var query = db.query('SELECT PPT.`project_plan_trans_id_pk` as TaskID,PPT.treeID,PPT.rootID,PPT.`task_name` as TaskName,PPT.`parent_id` as ParentID FROM `t_project_plan_trans` PPT inner join t_project_plan_mas as PM on PM.project_plan_mas_id_pk = PPT.plan_mas_id_fk	WHERE PM.`project_id_fk` =  ?',[postData.projectID], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.getAttachmentDetails = function (req, res) {
	var postData = req.body;
	var dbQuery='SELECT PP.`project_plan_trans_id_pk` as TaskID,PP.treeID,PP.`task_name` as TaskName,PPA.`attachment_original_file_name` as FileName, PPA.`attachment_file_size` as FileSize,PPA.`attachment_uploaded_date` as UploadedDate,	PPA.`attachment_file_path` as FilePath,US.first_name as `UploadedBy`,US.profilepicurl ,PPA.`attachment_temp_file_name` as TempFileName FROM `t_project_plan_trans` as `PP` Inner join `t_project_plan_attachment_trans` as  `PPA` on PPA.project_plan_trans_id_fk = PP.project_plan_trans_id_pk INNER JOIN t_user_mas as `US` ON US.user_id_pk = PPA.attachment_uploaded_by Inner join t_project_plan_mas as PM on PM.project_plan_mas_id_pk = PP.plan_mas_id_fk WHERE PM.`project_id_fk` = '+postData.projectID+' ORDER BY project_plan_trans_id_pk DESC';
	var query = db.query(dbQuery, function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};