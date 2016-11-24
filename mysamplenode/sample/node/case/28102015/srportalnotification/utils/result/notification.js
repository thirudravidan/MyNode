'use strict';
var sendMails = require('./mailtemplate')
, moments = require('moment');
module.exports.getNotificationDetails = function (callback) {
	// console.log(GLOBAL.connection);
	// SELECT notification_type,COUNT(user_id_fk) as cnt,user_id_fk FROM t_notifications WHERE is_read=0 GROUP BY notification_type,user_id_fk
	GLOBAL.connection.query('SELECT user_id_fk,COUNT(user_id_fk) AS cnt FROM t_notifications WHERE is_read=0 GROUP BY user_id_fk', function(err, usrRes) {
        if (err) throw err;     
        // console.log(usrRes);
        callback(usrRes);
        // io.sockets.in('38').emit('eventToEmit', {'Result': usrRes});
    });
};

module.exports.getOverDueProjectPlanDet = function (callback) {
	var notifiDet=[],notifiField,recCnt=0,notify_desc,totRec,mapObj,mailTemp;
	var finalset =function(){
		console.log(notifiDet);
		recCnt++;
		if (recCnt == totRec) {
			console.log(notifiDet.length);	
			if (notifiDet.length > 0) {				
				GLOBAL.connection.query('INSERT INTO t_notifications(notification_name,notification_type,notification_desc,user_id_fk,is_read,created_date,unique_id) VALUES ?',[notifiDet],function (err,notires){
					if (err) {
						throw err;
					}else{
						callback({'Result' :true});
					}
				});
			}else{
				callback({'Result' :true});
			}		
		}
	};

	var sendMailToreceipients = function (projName,taskName,mailTo){
		mapObj = {
				   '#ProjName#': projName,
				   '#taskName#': taskName
				};
		mailTemp = 'projectplanalerttpl';					
		
		var mailData = {
			'to': mailTo, //'thirumaran.dhanapal@csscorp.com'
			'replace': mapObj
		}; 
		sendMails.sendEmail(mailTemp, mailData, function (result1) {								
		}); 
	};

	GLOBAL.connection.query('SELECT  PM.project_name,PPT.project_plan_trans_id_pk,PPT.task_name,PPT.start_date,PPT.end_date,CONCAT(UMP.email,",",UMS.email) AS Receipient,UMP.user_id_pk AS PrimaryUserID,UMS.user_id_pk AS SecondaryUserID,CASE WHEN UMP.email=UMS.email THEN TRUE ELSE FALSE END AS Samereceipient FROM t_project_plan_trans AS PPT INNER JOIN t_project_plan_mas AS PPM ON PPM.project_plan_mas_id_pk = PPT.plan_mas_id_fk AND PPM.phase_id_fk =2 INNER JOIN t_project_mas AS PM ON PM.project_id_pk = PPM.project_id_fk INNER JOIN t_user_mas AS UMP ON UMP.user_id_pk = PPT.primary_owner INNER JOIN t_user_mas AS UMS ON  UMS.user_id_pk = PPT.secondary_owner WHERE PPT.STATUS !="STATUS_DONE" AND PPT.parent_id !=0 AND end_date < NOW()', function(err, overdueres) {
        if (err) {
        	throw err;     
        }else{
        	// callback(overdueres);
        	if (overdueres.length > 0) {
        		totRec=overdueres.length;
        		overdueres.forEach(function (val, key) {         			
        			GLOBAL.connection.query('SELECT COUNT(*) AS RecCount FROM t_notifications WHERE user_id_fk = ? AND unique_id = ?',[val.PrimaryUserID,val.project_plan_trans_id_pk],function (err,prusrresult){
        				notify_desc ='The following task '+ val.task_name+' is overdue on '+moments(new Date(val.end_date)).format('YYYY-MM-DD');
						if (err) {
							throw err;
						}else{
							if (prusrresult[0].RecCount == 0) {
								sendMailToreceipients(val.project_name,val.task_name,val.Receipient);	
								// notify_desc = val.task_name+' is overdue on '+moments(new Date(val.end_date)).format('YYYY-MM-DD');					
								notifiField = [val.project_name,'projectplan',notify_desc,val.PrimaryUserID,0,moments().format('YYYY-MM-DD HH:mm:ss'),val.project_plan_trans_id_pk];
								notifiDet.push(notifiField);
							}
							GLOBAL.connection.query('SELECT COUNT(*) AS RecCount FROM t_notifications WHERE user_id_fk = ? AND unique_id = ?',[val.SecondaryUserID,val.project_plan_trans_id_pk],function (err,secusrres){
								if (err) {
									throw err;
								}else{
									if (secusrres[0].RecCount == 0) {
										notifiField = [val.project_name,'projectplan',notify_desc,val.SecondaryUserID,0,moments().format('YYYY-MM-DD HH:mm:ss'),val.project_plan_trans_id_pk];
										notifiDet.push(notifiField);
									}
								}
							});								
						}
						finalset();
					}); 
        		});
        	}
        }        
    });
};
