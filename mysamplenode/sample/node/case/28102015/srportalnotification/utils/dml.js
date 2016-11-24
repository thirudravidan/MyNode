//var md5 = require("c:/program files/nodejs/node_modules/npm/node_modules/MD5");
var config = require('../config');
var settings = config.settings();

var md5 = require(settings.npm.path+"MD5");

exports.activation = function(connection,socket, cldata) {
    //connection.connect();
    var actqry = "SELECT * FROM t_brand_mas WHERE OTP ='"+cldata.otp+"' AND OTP_status=0 AND DATE(OTP_mtime)=DATE(NOW()) AND ADDTIME(TIME(OTP_mtime),  '00:10:00') >= TIME(NOW()) AND status=1;";
    var query = connection.query(actqry, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            if(rows.length > 0) { 
                var fields = [rows[0].brand_id];  
                var udtqry = "UPDATE t_brand_mas SET `OTP_status` = 1 WHERE brand_id = ?;";
                var udtquery = connection.query(udtqry,fields, function(udterr, udtresults) {  
                    if(udterr!==null) {
                        handle_query_error(udterr);
                    } 
                });   
                console.log(udtquery.sql)
                response.result = true;
                response.brand_id = rows[0].brand_id;
                response.theme_path = rows[0].theme_path;
                response.shortcut_keys = JSON.parse(rows[0].shortcut_keys);
                response.button_properties = JSON.parse(rows[0].button_properties);
                response.advanced_settings = JSON.parse(rows[0].advanced_settings);
            } else {
                response.result = false;
            }
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }
    }); 
//connection.end();
};

exports.chromereg = function(connection,socket, connectionList, cldata) {
    connectionList[socket.id].user_id = cldata.uid; 
    connectionList[socket.id].brand_id = cldata.bid;
    var response = new Object;
    response.fname = cldata.fname;
    var glistqry = "SELECT brand_game_id, game_name FROM t_brand_game_map WHERE brand_id = ? AND status = 1;";
    var query = connection.query(glistqry, [cldata.bid], function(err, rows) {
        if(err===null) {
            if(rows.length > 0) { 
                response.result = true;
                response.data = rows;
            } else {
                response.result = false;
            }
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }
    }); 
};

exports.register = function(connection,socket, connectionList, cldata) {
    //connection.connect();
    if(cldata.ftype==0) {
        var fields = [cldata.otp];
        var regqry = "SELECT  tum.user_id_pk,tum.brand_id,tum.user_code,tum.user_pwd,tum.name,tum.role_id,tum.status,tum.login_attempts,tum.lock_status,tum.main_balance,tum.lock_message,tum.user_status,tum.no_cancel_ticket,DATE_FORMAT(tum.remainder_date,'%Y-%m-%d') AS remainder_date,tum.last_updated_on, tbm.message as scrollMsg, tbm.brand_name, tbm.multibuy, tbm.advanced_settings, tbm.shortcut_keys, tbm.button_properties, tbm.file_name FROM t_user_mas AS tum LEFT JOIN t_brand_mas AS tbm ON tum.brand_id = tbm.brand_id WHERE tum.OTP = ? AND tum.OTP_status=0 AND DATE(tum.OTP_mtime)=DATE(NOW()) AND ADDTIME(TIME(tum.OTP_mtime),  '00:10:00') >= TIME(NOW());";
    } else {
        var fields = [cldata.uid, cldata.bid];
        var regqry = "SELECT tum.user_id_pk,tum.brand_id,tum.user_code,tum.user_pwd,tum.name,tum.role_id,tum.status,tum.login_attempts,tum.lock_status,tum.main_balance,tum.lock_message,tum.user_status,tum.no_cancel_ticket,DATE_FORMAT(tum.remainder_date,'%Y-%m-%d') AS remainder_date,tum.last_updated_on, tbm.message as scrollMsg, tbm.brand_name, tbm.multibuy, tbm.advanced_settings, tbm.shortcut_keys, tbm.button_properties, tbm.file_name FROM t_user_mas AS tum LEFT JOIN t_brand_mas AS tbm ON tum.brand_id = tbm.brand_id WHERE tum.user_id_pk = ? AND tum.brand_id= ?;";
    }

    var query = connection.query(regqry, fields, function(err, rows) {
        //console.log(err);
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.ftype = cldata.ftype;
            if(rows.length > 0) {
                var fields = [rows[0].brand_id, rows[0].user_id_pk]; 
                var selqry = connection.query("SELECT * FROM t_security_audit_trans WHERE brand_id=? AND user_id_fk=?",fields, function(serr, srow) {  
                    if(serr===null) {
                        if(srow.length > 0) {
                            var fields  = [socket.remoteAddress, rows[0].brand_id, rows[0].user_id_pk];
                            var udtqry = "UPDATE t_security_audit_trans SET `last_login` = NOW(), server_ip = ? WHERE brand_id = ? AND user_id_fk= ?;";
                            var udtquery = connection.query(udtqry,fields, function(adterr, adtresults) {  
                                if(adterr!==null) {
                                    handle_query_error(adterr);
                                }
                            });  
                                    
                        } else {
                            var ifields = {
                                "brand_id":rows[0].brand_id,
                                "user_id_fk": rows[0].user_id_pk ,
                                "server_ip":socket.remoteAddress
                            };
                            var insqry = connection.query('INSERT INTO t_security_audit_trans SET ?, last_login = NOW()', ifields, function(ierr, iresults) {
                                if(ierr!==null) {
                                    handle_query_error(ierr);
                                }
                            });
                        }
                                    
                    } else {
                        handle_query_error(uerr);
                    }
                });
                          
                if(rows[0].status==1 && cldata.ftype==0 && rows[0].role_id==0) {  
                    var fields  = [rows[0].user_id_pk];
                    var udtqry = "UPDATE t_user_mas SET `status` = 2, `OTP_status` = 1 WHERE user_id_pk= ?;";
                    var udtquery = connection.query(udtqry,fields, function(uerr, uresults) {  
                        if(uerr!==null) {
                            handle_query_error(uerr);
                        }
                    });
                            
                            
                            
                //console.log(udtquery.sql)
                } 
                //socket.user_id = rows[0].user_id_pk;  
						
                connectionList[socket.id].user_id = rows[0].user_id_pk; 
                connectionList[socket.id].brand_id = rows[0].brand_id; 
                //console.log(connectionList[socket.id]);
                console.log("Reminader:"+rows[0].remainder_date);
                response.result = true;
                response.status = rows[0].status;
                response.user_status = rows[0].user_status;
                response.role_id = rows[0].role_id;
                response.data = rows;
                response.data[0].advanced_settings = JSON.parse(rows[0].advanced_settings);
                response.data[0].shortcut_keys = JSON.parse(rows[0].shortcut_keys);
                response.data[0].button_properties = JSON.parse(rows[0].button_properties);
						
                var swfields, swqry;
                if(cldata.OTSetup==0) {
                    swfields = [rows[0].user_id_pk]; 
                     /*20140428GB-INT110-BEGIN add new column for select rename file path so commented*/
                    /*swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  vc.current_version AS \
                                                                old_version, tu.update_type FROM t_user_mas AS tum \
                                                                LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
                                                                LEFT JOIN t_version_control_tbl vc ON vc.node_id_fk = tu.node_id_fk \
                                                                LEFT JOIN t_upload_msi_tbl msi ON msi.upload_id_pk = vc.upload_id_fk OR vc.node_id_fk IS NULL \
                                                                WHERE tum.user_id_pk = ? AND msi.version = '"+cldata.version+"' ORDER BY  update_type DESC";*/
                  /*20140428GB-INT110-END*/  
                  /*20140428GB-INT110-BEGIN add new column for select rename file path*/
                    swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  vc.current_version AS \
                                                                old_version, tu.update_type, tu.old_node_name, tu.old_path, tu.old_tmp_path FROM t_user_mas AS tum \
                                                                LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
                                                                LEFT JOIN t_version_control_tbl vc ON vc.node_id_fk = tu.node_id_fk \
                                                                LEFT JOIN t_upload_msi_tbl msi ON msi.upload_id_pk = vc.upload_id_fk OR vc.node_id_fk IS NULL \
                                                                WHERE tum.user_id_pk = ? AND msi.version = '"+cldata.version+"' ORDER BY  update_type DESC";
                  /*20140428GB-INT110-END*/  
            } else {
                    swfields = [rows[0].user_id_pk]; 
                    /*20140428GB-INT110-BEGIN add new column for select rename file path so commented*/
                    /*swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  tu.earlier_version AS \
                                                                old_version, tu.update_type FROM t_user_mas AS tum \
                                                                LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
                                                                WHERE tum.user_id_pk = ? AND tu.update_available = 1 ORDER BY  update_type DESC";*/
                    /*20140428GB-INT110-END*/  
                    /*20140428GB-INT110-BEGIN add new column for select rename file path*/
                    swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  tu.earlier_version AS \
                                                                old_version, tu.update_type, tu.old_node_name, tu.old_path, tu.old_tmp_path FROM t_user_mas AS tum \
                                                                LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
                                                                WHERE tum.user_id_pk = ? AND tu.update_available = 1 ORDER BY  update_type DESC";
                    /*20140428GB-INT110-END*/  
                }
                var swqryop = connection.query(swqry,swfields, function(swerr, swrow) {  
                    response.forceUdt = new Array, response.manualUdt = new Array;
                    if(swerr===null) {
                        if(swrow.length > 0) {
                            for(var i in swrow) {
                                if(swrow[i].update_type==0) {
                                    response.manualUdt.push({
                                        "fid":swrow[i].node_id_fk, 
                                        "fname":swrow[i].node_name, 
                                        "restore_path":swrow[i].path, 
                                        "download_path":swrow[i].tmp_path, 
                                        "mode":swrow[i].oprMode, 
                                        "new_version":swrow[i].new_version, 
                                        "old_version":swrow[i].old_version, 
                                        "updated":false
                                    });
                                } else {
                                    /*20140428GB-INT110-BEGIN add new column for select rename file path so commented*/
                                    /*response.forceUdt.push({
                                        "fid":swrow[i].node_id_fk, 
                                        "fname":swrow[i].node_name, 
                                        "restore_path":swrow[i].path, 
                                        "download_path":swrow[i].tmp_path, 
                                        "mode":swrow[i].oprMode, 
                                        "new_version":swrow[i].new_version, 
                                        "old_version":swrow[i].old_version, 
                                        "updated":false
                                    });*/
                                    /*20140428GB-INT110-END*/
                                    /*20140428GB-INT110-BEGIN add new column for select rename file path*/
                                    response.forceUdt.push({
                                        "fid":swrow[i].node_id_fk, 
                                        "fname":swrow[i].node_name, 
                                        "old_node_name":swrow[i].old_node_name, 
                                        "restore_path":swrow[i].path, 
                                        "download_path":swrow[i].tmp_path, 
                                        "old_path":swrow[i].old_path, 
                                        "old_tmp_path":swrow[i].old_tmp_path, 
                                        "mode":swrow[i].oprMode, 
                                        "new_version":swrow[i].new_version, 
                                        "old_version":swrow[i].old_version, 
                                        "updated":false
                                    });
                                    /*20140428GB-INT110-END*/
                                }
                            }
                        } 

                    } else {
                        handle_query_error(swerr);
                    }
                    //console.log(JSON.stringify(response));
                    socket.write(JSON.stringify(response)+"\0", 'utf8');  
                });
                console.log(swqryop.sql);
            //console.log(JSON.stringify(response));
            } else {
                response.result = false;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
        } else {
            handle_query_error(err);
        }
    }); 
//console.log(query.sql);
//connection.end();
                        
};

exports.checkupdates = function (connection,socket, cldata) {
    var response = new Object;
    response.fname = cldata.fname;
    var swfields, swqry;
    if(cldata.OTSetup==0) {
        swfields = [cldata.version,cldata.uid];
        /*20140428GB-INT110-BEGIN add new column for select rename file path so commented*/
        /*swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  vc.current_version AS \
					old_version, tu.update_type FROM t_user_mas AS tum \
					LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
					LEFT JOIN t_version_control_tbl vc ON vc.node_id_fk = tu.node_id_fk \
					LEFT JOIN t_upload_msi_tbl msi ON msi.upload_id_pk = vc.upload_id_fk OR vc.node_id_fk IS NULL \
					WHERE tum.user_id_pk = ? AND msi.version = '"+cldata.version+"' ORDER BY  update_type DESC";*/
        /*20140428GB-INT110-END*/
        /*20140428GB-INT110-BEGIN add new column for select rename file path*/
        swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  vc.current_version AS \
					old_version, tu.update_type, tu.old_node_name, tu.old_path, tu.old_tmp_path FROM t_user_mas AS tum \
					LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
					LEFT JOIN t_version_control_tbl vc ON vc.node_id_fk = tu.node_id_fk \
					LEFT JOIN t_upload_msi_tbl msi ON msi.upload_id_pk = vc.upload_id_fk OR vc.node_id_fk IS NULL \
					WHERE tum.user_id_pk = ? AND msi.version = '"+cldata.version+"' ORDER BY  update_type DESC";
        /*20140428GB-INT110-END*/
    } else {
        swfields = [cldata.uid];
        /*20140428GB-INT110-BEGIN add new column for select rename file path so commented*/
        /*swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  tu.earlier_version AS \
					old_version, tu.update_type FROM t_user_mas AS tum \
					LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
					WHERE tum.user_id_pk = ? AND tu.update_available = 1 ORDER BY  update_type DESC";*/
        /*20140428GB-INT110-END*/
        /*20140428GB-INT110-BEGIN add new column for select rename file path*/
        swqry = "SELECT tu.node_id_fk, tu.node_name, tu.path, tu.tmp_path, tu.type AS oprMode, tu.current_version AS new_version,  tu.earlier_version AS \
					old_version, tu.update_type, tu.old_node_name, tu.old_path, tu.old_tmp_path FROM t_user_mas AS tum \
					LEFT JOIN t_terminal_update_tbl tu ON tu.user_id_fk = tum.user_id_pk \
					WHERE tum.user_id_pk = ? AND tu.update_available = 1 ORDER BY  update_type DESC";
        /*20140428GB-INT110-END*/
    }
    var swqryop = connection.query(swqry,swfields, function(swerr, swrow) {  
        response.forceUdt = new Array, response.manualUdt = new Array;
        if(swerr===null) {
            if(swrow.length > 0) {
                for(var i in swrow) {
                    if(swrow[i].update_type==0) {
                        response.manualUdt.push({
                            "fid":swrow[i].node_id_fk, 
                            "fname":swrow[i].node_name, 
                            "restore_path":swrow[i].path, 
                            "download_path":swrow[i].tmp_path, 
                            "mode":swrow[i].oprMode, 
                            "new_version":swrow[i].new_version, 
                            "old_version":swrow[i].old_version, 
                            "updated":false
                        });
                    } else {
                        /*20140428GB-INT110-BEGIN add new column for select rename file path so commented*/
                        /*response.forceUdt.push({
                            "fid":swrow[i].node_id_fk, 
                            "fname":swrow[i].node_name, 
                            "restore_path":swrow[i].path, 
                            "download_path":swrow[i].tmp_path, 
                            "mode":swrow[i].oprMode, 
                            "new_version":swrow[i].new_version, 
                            "old_version":swrow[i].old_version, 
                            "updated":false
                        });*/
                        /*20140428GB-INT110-END*/
                        /*20140428GB-INT110-BEGIN add new column for select rename file path*/
                        response.forceUdt.push({
                            "fid":swrow[i].node_id_fk, 
                            "fname":swrow[i].node_name, 
                            "old_node_name":swrow[i].old_node_name,
                            "restore_path":swrow[i].path, 
                            "download_path":swrow[i].tmp_path, 
                            "old_path":swrow[i].old_path, 
                            "old_tmp_path":swrow[i].old_tmp_path, 
                            "mode":swrow[i].oprMode, 
                            "new_version":swrow[i].new_version, 
                            "old_version":swrow[i].old_version, 
                            "updated":false
                        });
                        /*20140428GB-INT110-END*/
                    }
                }
            } 

        } else {
            handle_query_error(swerr);
        }
        console.log(JSON.stringify(response));
        socket.write(JSON.stringify(response)+"\0", 'utf8');  
    });
};
exports.udtdwnfiles = function (connection,socket, cldata) {
    var response = new Object;
    response.fname = cldata.fname;
    var fields  = [cldata.uid];
    var udtqry = "UPDATE t_terminal_update_tbl SET `update_available` = 0, `earlier_version` = current_version, `last_updated_on` = NOW(), `old_path`=path, `old_tmp_path`=tmp_path WHERE user_id_fk= ? AND node_id_fk IN ("+cldata.fid+")";
    var udtquery = connection.query(udtqry,fields, function(udterr, udtresults) {  
        if(udterr==null) {
            if(udtresults.affectedRows > 0) { 
                response.result = true;
            } else {
                response.result = false;
            }
            socket.write(JSON.stringify(response)+"\0", 'utf8'); 
        } else {
            handle_query_error(udterr);
        }
    });
    console.log(udtquery.sql);
};

exports.remindme = function (connection,socket, cldata) {
    var response = new Object;
    response.fname = cldata.fname;
    var fields  = [cldata.uid];
    var udtqry = "UPDATE t_user_mas SET `remainder_date` = ADDDATE(DATE(NOW()), 1) WHERE user_id_pk= ?;";
    var udtquery = connection.query(udtqry,fields, function(rmerr, rmresults) {  
        if(rmerr==null) {
            if(rmresults.affectedRows > 0) { 
                response.result = true;
            } else {
                response.result = false;
            }
            socket.write(JSON.stringify(response)+"\0", 'utf8'); 
        } else {
            handle_query_error(rmerr);
        }
    });  
};

exports.unregister = function(connection,socket, cldata) {
    var sfields = [cldata.uid,cldata.otp]; 
    var uregqry = "SELECT user_id_pk FROM t_user_mas AS tum WHERE tum.user_id_pk = ? AND tum.OTP = ? AND tum.OTP_status=0 AND DATE(tum.OTP_mtime)=DATE(NOW()) AND ADDTIME(TIME(tum.OTP_mtime),  '00:10:00') >= TIME(NOW());";
    var urquery = connection.query(uregqry,sfields, function(serr, rows) {
        if(serr===null) { 
            var response = new Object;
            response.fname = cldata.fname;
            if(rows.length > 0) {
                var fields  = [rows[0].user_id_pk];
                var cpqry = "UPDATE t_user_mas SET `status` = 1 WHERE user_id_pk= ?;";
                response.result = true;
                var query = connection.query(cpqry,fields, function(err, results) {
                    if(err===null) {
						  
                        if(results.affectedRows > 0) { 
                            response.uresult = true;
                        } else {
                            response.uresult = false;
                        }
                        socket.write(JSON.stringify(response)+"\0", 'utf8');  
                    } else {
                        handle_query_error(err);
                    }
                }); 
            } else {
                response.result = false;
                socket.write(JSON.stringify(response)+"\0", 'utf8');
            }
        } else {
            handle_query_error(serr);
        }
    });
//console.log(urquery.sql);
};

exports.logout = function (connection,socket) {
    //connection.connect();
    var fields  = [socket.brand_id, socket.user_id];
    var udtqry = "UPDATE t_security_audit_trans SET `last_logout` = NOW() WHERE brand_id = ? AND user_id_fk= ?;";
    var udtquery = connection.query(udtqry,fields, function(adterr, adtresults) {  
        if(adterr!==null) {
            handle_query_error(adterr);
        }
    });  
//connection.end();
};
exports.gamedetails = function(connection,socket, cldata) {
    //connection.connect();
    /*20140116GB-C3GT4S1S-BEGIN Select query column changed based on series game*/ 
    /*var regqry = "SELECT bgm.brand_game_id, bgm.game_rate, bgm.prize_value, bgm.game_name, bgm.btn_prop, bgm.button_id, bgm.shortcut_label, gi.interval_time, DATE_FORMAT(gi.interval_time, '%h:%i %p') AS display_time, lr.result, gi.interval_id, bgm.game_symbols, bgm.game_config, bgm.access_code, bgm.game_id, bgm.layout_id \
                        FROM t_game_terminal_map gtm \
                        LEFT JOIN t_brand_game_map bgm ON gtm.brand_game_id=bgm.brand_game_id \
                        LEFT JOIN t_game_interval gi ON bgm.brand_game_id=gi.brand_game_id \
                        LEFT JOIN lotto_result_mas lr ON gi.interval_id = lr.interval_id AND DATE(lr.result_date_time) = DATE(NOW()) \
                        LEFT JOIN t_game_mas gm ON bgm.game_id = gm.game_id \
                        WHERE gtm.terminal_id = "+cldata.uid+" AND bgm.status = 1;";*/
    /*20140116GB-C3GT4S1S-END*/
    /*20140116GB-C3GT4S1S-BEGIN Select the data based on series game data*/ 
    /*20140214GB-C3PS92-BEGIN Problem in hanging the inactive games*/
    /*var regqry = "SELECT siv.brand_game_id, siv.game_rate, siv.prize_value, siv.game_name, siv.btn_prop, siv.button_id, siv.shortcut_label, gi.interval_time, DATE_FORMAT(gi.interval_time, '%h:%i %p') AS display_time, lr.result, gi.interval_id, siv.game_symbols, siv.game_config, siv.access_code, siv.game_id, siv.layout_id, siv.series_uid, siv.series_name, siv.series_rate, siv.series_prize, siv.series_gm_name \
                            FROM t_game_terminal_map gtm \
                            LEFT JOIN series_info_view AS siv ON siv.brand_game_id = gtm.brand_game_id \
                            LEFT JOIN t_game_interval gi ON siv.brand_game_id=gi.brand_game_id \
                            LEFT JOIN lotto_result_mas lr ON gi.interval_id = lr.interval_id AND DATE(lr.result_date_time) = DATE(NOW()) \
                            LEFT JOIN t_game_mas gm ON siv.game_id = gm.game_id \
                            WHERE gtm.terminal_id = '"+cldata.uid+"'";*/
            
    /*20140214GB-C3PS92-END*/
    /*20140512GB-INT114-BEGIN Loading game taking more so commented*/
    /*20140214GB-C3PS92-BEGIN Filter the inactive games to select the queries*/
    /*var regqry = "SELECT siv.brand_game_id, siv.game_rate, siv.prize_value, siv.game_name, siv.btn_prop, siv.button_id, siv.shortcut_label, gi.interval_time, DATE_FORMAT(gi.interval_time, '%h:%i %p') AS display_time, lr.result, gi.interval_id, siv.game_symbols, siv.game_config, siv.access_code, siv.game_id, siv.layout_id, siv.series_uid, siv.series_name, siv.series_rate, siv.series_prize, siv.series_gm_name \
                            FROM t_game_terminal_map gtm \
                            LEFT JOIN series_info_view AS siv ON siv.brand_game_id = gtm.brand_game_id \
                            LEFT JOIN t_game_interval gi ON siv.brand_game_id=gi.brand_game_id \
                            LEFT JOIN lotto_result_mas lr ON gi.interval_id = lr.interval_id AND lr.result_date_time >= CONCAT(CURDATE(), ' 00:00:00') \
                            LEFT JOIN t_game_mas gm ON siv.game_id = gm.game_id \
                            WHERE gtm.terminal_id = '"+cldata.uid+"' AND siv.status=1;";*/
    /*20140214GB-C3PS92-END*/
    /*20140512GB-INT114-END*/
    /*20140512GB-INT114-BEGIN Optimized query for taking interval and result*/
    var regqry = "SELECT siv.brand_game_id, siv.game_rate, siv.prize_value, siv.game_name, siv.btn_prop, siv.button_id, siv.shortcut_label, gi.interval_time, DATE_FORMAT(gi.interval_time, '%h:%i %p') AS display_time, lr.result, gi.interval_id, siv.game_symbols, siv.game_config, siv.access_code, siv.game_id, siv.layout_id, siv.series_uid, siv.series_name, siv.series_rate, siv.series_prize, siv.series_gm_name  FROM lotto_result_mas lr \
                            LEFT JOIN t_game_terminal_map gtm  ON gtm.brand_game_id = lr.brand_game_map_id \
                            LEFT JOIN series_info_view AS siv ON siv.brand_game_id = gtm.brand_game_id AND siv.status =1 \
                            LEFT JOIN t_game_interval gi ON lr.interval_id=gi.interval_id \
                            LEFT JOIN t_game_mas gm ON siv.game_id = gm.game_id \
                            WHERE gtm.terminal_id ='"+cldata.uid+"' AND lr.result_date_time \
                            between  CONCAT(CURDATE(), ' 00:00:00') AND CONCAT(CURDATE(), ' 23:59:59') order by siv.brand_game_id ,gi.interval_time;";
    /*20140512GB-INT114-END*/
        var query = connection.query(regqry, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            if(rows.length > 0) { 
                response.result = true;
                //response.data = rows

                var gmDetObj = new Array;
                var uid = null, series_rate;
                var counter = -1;
                for(var i in rows) {

                    if(uid!=rows[i].brand_game_id) {
                        counter++;
                        gmDetObj[counter] = new Object;
                        gmDetObj[counter].game_name = rows[i].game_name;
                        gmDetObj[counter].brand_game_id = rows[i].brand_game_id;
                        /*20140116GB-C3GT4S1S-BEGIN Form the json data based on series game*/
                        if(rows[i].series_rate == null) {
                            gmDetObj[counter].game_rate = rows[i].game_rate;
                            gmDetObj[counter].prize_value = rows[i].prize_value;
                        } else {
                            gmDetObj[counter].series_uid = rows[i].series_uid.toString();
                            gmDetObj[counter].series_rate = rows[i].series_rate.toString();
                            gmDetObj[counter].series_prize = rows[i].series_prize.toString();
                            
                            // 20140111AV-C1SWP3-BEGIN 
                            gmDetObj[counter].series_name = rows[i].series_name;
                            gmDetObj[counter].series_gm_name = rows[i].series_gm_name;
                            //END
                            
                            gmDetObj[counter].game_rate = rows[i].series_rate.toString().split(",")[0];
                            gmDetObj[counter].prize_value = rows[i].series_prize.toString().split(",")[0];
                        }
                        /*20140116GB-C3GT4S1S-END*/
                        gmDetObj[counter].game_symbols = rows[i].game_symbols;
                        /*20140227GB-C3GT90-BEGIN The null condider as string in server side so commented*/
                        //gmDetObj[counter].game_config = rows[i].game_config !="" ? JSON.parse(rows[i].game_config): "";
                        /*20140227GB-C3GT90-END*/
                        /*20140227GB-C3GT90-BEGIN The null condider as string in server side so change the condition to check the null values*/
                        
                        gmDetObj[counter].game_config = rows[i].game_config !="NULL" ? JSON.parse(rows[i].game_config): "";
                        /*20140227GB-C3GT90-END*/
                        gmDetObj[counter].access_code = rows[i].access_code;
                        gmDetObj[counter].game_id = rows[i].game_id;
                        gmDetObj[counter].layout_id = rows[i].layout_id;
                        gmDetObj[counter].label = rows[i].shortcut_label;
                        gmDetObj[counter].btn_prop = JSON.parse(rows[i].btn_prop);
                        gmDetObj[counter].button_id = rows[i].button_id;
                        gmDetObj[counter].period = new Array;
                        uid = rows[i].brand_game_id;
                    } 


                    var pDet = new Object;
                    pDet.interval_id = rows[i].interval_id;
                    pDet.interval_time = rows[i].interval_time;
                    pDet.display_time = rows[i].display_time;
                    pDet.result = rows[i].result;
                    gmDetObj[counter].period.push(pDet);



                }

                //gmDetObj.filter(function(val) { return val !== null; }).join(", ")
                response.data = gmDetObj;
                //response.servertime = new Date().getTime();

                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            //console.log(JSON.stringify(response));
            } else {
                response.result = false;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
        } else {
            handle_query_error(err);
        }
    }); 
console.log(query.sql)
//connection.end();            
};

exports.buyticket = function(connection,socket, cldata) {
    //connection.connect();
    //console.log(JSON.stringify(cldata));
    //var ts = new Date().getTime();
    //var bcode = (cldata.brand_id.toString()).substr(0,1)+ (cldata.terminal_id.toString()).substr(0,1)+(ts.toString()).substr(0,12); 
    var bcode = cldata.barcode;
    var calc_details = cldata.calc_detail !="" ? JSON.stringify(cldata.calc_detail) : null;
    var fields  = {
        brand_id: cldata.brand_id, 
        brand_game_map_id: cldata.brand_game_map_id, 
        terminal_id:cldata.terminal_id,
        interval_id:cldata.interval_id,
        trans_date:cldata.trans_date,
        barcode_no:bcode,
        quantity:cldata.quantity, 
        qty_detail:JSON.stringify(cldata.qty_details),
        symbols:cldata.symbols,
        amount:cldata.amount,
        calc_detail:calc_details
    };
            
    var prefix = (typeof (cldata.prefix)!='undefined')? cldata.prefix: "";
			
    var query = connection.query('INSERT INTO t_transaction_mas SET ?', fields, function(err, results) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.ftype = cldata.ftype;
            if(results.affectedRows > 0) { 

                response.result = true;
                response.data = new Array(results.insertId, bcode, cldata.tdate, cldata.ttime,cldata.quantity, cldata.amount,cldata.qty_details, prefix);
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            //socket.end(JSON.stringify(response)+"\0");
            //console.log(JSON.stringify(response));
            } else {
                response.result = false;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
        } else {
            handle_query_error(err);
        }
    }); 
//connection.end();
                        
};

exports.buyallticket = function(connection,socket, cldata) {
    var calc_details;        
    var isql = "INSERT INTO t_transaction_mas(brand_id,brand_game_map_id,terminal_id,interval_id,trans_date,barcode_no,quantity,qty_detail,symbols, amount, calc_detail) VALUES";
    var ivalues = new Array;
    for(var ticket in cldata.tickets) {
        calc_details = cldata.tickets[ticket].calc_detail !="" ? JSON.stringify(cldata.tickets[ticket].calc_detail) : null
        ivalues.push("("+cldata.tickets[ticket].brand_id+","+cldata.tickets[ticket].brand_game_map_id+","+cldata.tickets[ticket].terminal_id+","+cldata.tickets[ticket].interval_id+",'"+cldata.tickets[ticket].trans_date+"','"+cldata.tickets[ticket].barcode+"',"+cldata.tickets[ticket].quantity+",'"+JSON.stringify(cldata.tickets[ticket].qty_details)+"','"+cldata.tickets[ticket].symbols+"',"+cldata.tickets[ticket].amount+", '"+calc_details+"')");
    }
            
    isql += ivalues.join(",");
    //console.log(isql);
    var query = connection.query(isql, function(err, results) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            if(results.affectedRows > 0) { 
                response.result = true;
                response.tickets = cldata.tickets;
                response.totAmount = cldata.totAmount;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            } else {
                response.result = false;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
        } else {
            handle_query_error(err);
        }
    }); 
                       
};

exports.buyintticket = function(connection,socket, cldata) {
    /*20140124GB-C1SWP3-BEGIN Insert the pick3 result calculation, commented line*/        
    //var isql = "INSERT INTO t_transaction_mas(brand_id,brand_game_map_id,terminal_id,interval_id,trans_date,barcode_no,quantity,qty_detail,symbols, amount) VALUES";
    /*20140124GB-C1SWP3-END*/
    /*20140124GB-C1SWP3-BEGIN Insert the pick3 result calculation*/
    var calc_details = cldata.calc_detail !="" ? JSON.stringify(cldata.calc_detail) : null;  
    var isql = "INSERT INTO t_transaction_mas(brand_id,brand_game_map_id,terminal_id,interval_id,trans_date,barcode_no,quantity,qty_detail,symbols, amount, calc_detail) VALUES";
    /*20140124GB-C1SWP3-END*/
    console.log(cldata.calc_detail+"cldata.calc_detail");
    var ivalues = new Array, totAmount = null;
    for(var intvl in cldata.mib) {
        ivalues.push("("+cldata.brand_id+","+cldata.brand_game_map_id+","+cldata.terminal_id+","+cldata.mib[intvl].interval_id+",'"+cldata.trans_date+"','"+cldata.mib[intvl].barcode+"',"+cldata.quantity+",'"+JSON.stringify(cldata.qty_details)+"','"+cldata.symbols+"',"+cldata.amount+",'"+calc_details+"')");
        totAmount += cldata.amount;
                
    }
            
    isql += ivalues.join(",");
    //console.log(isql);
    var query = connection.query(isql, function(err, results) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            if(results.affectedRows > 0) { 
                response.result = true;
                response.data = cldata;
                response.totAmount = totAmount;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            } else {
                response.result = false;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
        } else {
            handle_query_error(err);
        }
    }); 
                       
};

exports.chgpwd = function(connection,socket, cldata) {
    //connection.connect();
    var md5pwd = md5(cldata.pwd);
    var fields  = [md5pwd, cldata.uid];
    var cpqry = "UPDATE t_user_mas SET user_pwd = ? WHERE user_id_pk= ?;";

    var query = connection.query(cpqry,fields, function(err, results) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.pwd = md5pwd;
            if(results.affectedRows > 0) { 
                response.result = true;
            } else {
                response.result = false;
            }

            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }      
    }); 
//connection.end();
                        
};

exports.loadclaimtkt = function(connection,socket, cldata) {
    //connection.connect();
    var fields = [cldata.uid];
    var loadqry = "SELECT ttm.barcode_no AS Barcode, tgi.interval_time AS Draw_Time, TIME(ttm.trans_date) AS Entry_Time, ttm.amount AS Amount, ttm.prize_value AS Prize  \
                            FROM t_transaction_mas ttm \
                            LEFT JOIN t_game_interval tgi ON ttm.interval_id=tgi.interval_id \
                            WHERE DATE(ttm.trans_date)= DATE(NOW()) AND ttm.cancel_ticket=0 AND ttm.claimed=0 AND ttm.status=1 AND ttm.terminal_id = ?;";

    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            if(rows.length > 0) { 
                response.data = rows;
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }      
    });
            
};


exports.claimticket = function(connection,socket, cldata) {
    //connection.connect();
            
    var fields  = [cldata.uid, cldata.barcode];
    var ctktqry = "UPDATE t_transaction_mas SET claimed = 1, claimed_date = NOW() WHERE terminal_id= ? AND barcode_no=?;";
    var query = connection.query(ctktqry,fields, function(err, results) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.barcode = cldata.barcode;
            if(results.affectedRows > 0) { 
                response.result = true; 
            } else {
                response.result = false;
            }
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }     
    });
            
//connection.end();
                        
};

exports.claimbarcode = function(connection,socket, cldata) {
    //connection.connect();
    //AND ttm.cancel_ticket=0 AND ttm.claimed=0 AND ttm.status=1
    var fields  = [cldata.uid, cldata.barcode];
    var cbqry = "SELECT tm.*, lrm.result FROM t_transaction_mas tm LEFT JOIN lotto_result_mas lrm ON tm.brand_game_map_id = lrm.brand_game_map_id AND DATE(lrm.result_date_time)=DATE(tm.trans_date) AND tm.interval_id = lrm.interval_id WHERE tm.terminal_id= ? AND tm.barcode_no=?;";
    var query = connection.query(cbqry,fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            //response.barcode = cldata.barcode;
            if(rows.length > 0) { 
                response.cancel_ticket = rows[0].cancel_ticket;
                response.claimed = rows[0].claimed;
                response.status = rows[0].status;
                response.prize = rows[0].prize_value; 
                response.barcode = rows[0].barcode_no;
                response.draw_result = rows[0].result;
                response.result = true; 
                if(rows[0].cancel_ticket==0 && rows[0].claimed==0 && rows[0].status==1) {
                    var ubqry = "UPDATE t_transaction_mas SET claimed = 1, claimed_date = NOW() WHERE terminal_id= ? AND barcode_no=?;";
                    var query = connection.query(ubqry,fields, function(uberr, ubresults) {
                        if(uberr===null) {
                            if(ubresults.affectedRows > 0) { 
                                response.ubresult = true; 
                            //response.claimed = 1;
                            } else {
                                response.ubresult = false;
                            }
                            socket.write(JSON.stringify(response)+"\0", 'utf8');  
                        } else {
                            handle_query_error(err);
                        }
                    });
                } else {
                    socket.write(JSON.stringify(response)+"\0", 'utf8');  
                }

            } else {
                response.result = false;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
                      
        } else {
            handle_query_error(err);
        }
    });
            
//connection.end();
                        
};



exports.loadcanceltkt = function(connection,socket, cldata) {
    //connection.connect();
    var minute = null, second = null;
    minute = Math.round(cldata.close_time/60);
    second = cldata.close_time%60;
    console.log("min:"+minute+",sec:"+second);
    var fields = [cldata.uid, "00"+":"+('0' + minute).slice(-2)+":"+('0' + second).slice(-2)];
    var loadqry = "SELECT ttm.barcode_no AS Barcode, tgi.interval_time AS Draw_Time, TIME(ttm.trans_date) AS Entry_Time, ttm.amount AS Amount \
                            FROM t_transaction_mas ttm \
                            LEFT JOIN t_game_interval tgi ON ttm.interval_id=tgi.interval_id \
                            WHERE DATE(ttm.trans_date)= DATE(NOW()) AND ttm.cancel_ticket=0 AND ttm.claimed=0 AND ttm.status=0 AND ttm.terminal_id = ? \
                            AND ADDTIME(TIME(NOW()),?) < tgi.interval_time;";

    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {  
            var response = new Object;
            response.fname = cldata.fname;
            if(rows.length > 0) { 
                response.data = rows;
                //response.timer = 
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }
    });
//console.log(query.sql);
            
};


exports.cancelticket = function(connection,socket, cldata) {
    //connection.connect();
    var chkQry = "SELECT count(trans_id_pk) as cTot FROM t_transaction_mas WHERE cancel_ticket=1 AND terminal_id = ? AND DATE(trans_date) = DATE(NOW())";    
    var selQry = connection.query(chkQry,[cldata.uid], function(serr, srows) {
        if(serr===null) {
            var minute = null, second = null, close_time;
            minute = Math.round(cldata.close_time/60);
            second = cldata.close_time%60;
            close_time = "00"+":"+('0' + minute).slice(-2)+":"+('0' + second).slice(-2);
            var response = new Object;
            response.fname = cldata.fname;
            response.barcode = cldata.barcode;
            if(srows[0].cTot < cldata.tot_cancel) {
                response.bresult = false;
                var fields  = [cldata.uid, cldata.barcode, close_time];
                var ctktcountqry = "SELECT count(*) as canTot FROM t_transaction_mas tm LEFT JOIN t_game_interval gi ON gi.interval_id = tm.interval_id \
                                      WHERE tm.terminal_id= ? AND tm.barcode_no=? AND gi.interval_time > ADDTIME(CURTIME(), ?);";
                var ctkquery = connection.query(ctktcountqry, fields, function(err, srows) {
                    if(err===null) {
                        if(srows[0].canTot > 0) {
                            var ctktqry = "UPDATE t_transaction_mas tm LEFT JOIN t_game_interval gi ON gi.interval_id = tm.interval_id \
                                              SET tm.cancel_ticket = 1, cancel_tkt_date = NOW() WHERE tm.terminal_id= ? AND tm.barcode_no=?;";
                            var query = connection.query(ctktqry,fields, function(err, results) {
                                if(err===null) { 
                                    if(results.affectedRows > 0) {
                                        //response.result = true;
                                        response.status = 1; // successfully updated cancel ticket data
                                    } else {
                                        response.status = 0; // Failed to update canel ticket
                                    //response.result = false;
                                    }
                                    socket.write(JSON.stringify(response)+"\0", 'utf8');  
                                } else {
                                    handle_query_error(err);
                                }
                            });
                        } else {
                            response.status = 2; // Cancel close time to be reached
                            //response.result = true;
                            socket.write(JSON.stringify(response)+"\0", 'utf8');  
                        }
                        
                    } else {
                        handle_query_error(err);
                    } 
                });		
					
            } else {
                response.bresult = true;
                response.status = 3; //Maximun limit to be over
                console.log(JSON.stringify(response));
                socket.write(JSON.stringify(response)+"\0", 'utf8'); 
            }
        } else {
            handle_query_error(serr);
        }
    });
            
//connection.end();
                        
};

exports.loadresultrpt = function(connection,socket, cldata) {
    //connection.connect();

    var fields = [cldata.seldate, cldata.brand_game_id];
    var loadqry = "SELECT tbgm.game_name, lrm.result,  DATE_FORMAT(lrm.result_date_time, '%d/%m/%Y') AS draw_date, DATE_FORMAT(lrm.interval_time, '%h:%i %p') AS draw_time, tbgm.game_rate \
                            FROM lotto_result_mas lrm \
                            LEFT JOIN t_brand_game_map tbgm ON lrm.brand_game_map_id= tbgm.brand_game_id \
                            LEFT JOIN t_game_mas tgm ON tbgm.game_id = tgm.game_id \
                            WHERE  DATE(lrm.result_date_time) = ? AND lrm.brand_game_map_id = ? AND tbgm.status = 1 ";
    var cd = new Date();				
    if(cldata.seldate == cd.getFullYear() + "-" + (cd.getMonth()+1) + "-" + cd.getDate())
        loadqry += 	"AND TIME(lrm.interval_time) < TIME(NOW()) ";
                
    loadqry += "ORDER BY  tgm.game_name ASC;";

    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.data = new Array;
            if(rows.length > 0) { 
                for(var i in rows) {
                    var data = new Object;

                    data["Game Name"] = rows[i].game_name;
                    data["Draw Date"] = rows[i].draw_date;
                    data["Draw Time"] = rows[i].draw_time;
                    data["MRP"] = rows[i].game_rate;
                    data["Result"] = rows[i].result;
                    response.data.push(data);
                }

                //response.timer = 
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }     
    });
            
};

exports.loadbarcoderpt = function(connection,socket, cldata) {
    //connection.connect();
    var fields = [cldata.uid, cldata.seldate];
    var loadqry = "SELECT barcode_no, quantity, amount, prize_value, symbols, TIME(trans_date) AS time \
                            FROM   t_transaction_mas \
                            WHERE terminal_id = ? AND cancel_ticket = 0 AND DATE(trans_date) = ?;";

    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.data = new Array;
            if(rows.length > 0) { 
                var totQty = 0, totAmt = 0;
                for(var i in rows) {
                    var data = new Object;

                    data["Barcode"] = rows[i].barcode_no;
                    data["Quantity"] = rows[i].quantity;
                    data["Amount"] = rows[i].amount;
                    data["Prize Value"] = rows[i].prize_value;
                    data["Symbols"] = rows[i].symbols;
                    data["Time"] = rows[i].time;
                    totQty += rows[i].quantity;
                    totAmt += rows[i].amount;
                    response.data.push(data);
                }

                response.data.push({
                    "Barcode":"Grand Total",
                    "Quantity":totQty,
                    "Amount":totAmt, 
                    "Prize Value":"", 
                    "Symbols":"", 
                    "Time":""
                });
                //response.timer = 
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }
    });
            
};

exports.loadcancelrpt = function(connection,socket, cldata) {
    //connection.connect();
    var fields = [cldata.uid, cldata.seldate];
    var loadqry = "SELECT barcode_no, quantity, amount, prize_value, symbols, TIME(trans_date) AS time \
                            FROM   t_transaction_mas \
                            WHERE terminal_id = ? AND cancel_ticket = 1 AND DATE(trans_date) = ?;";

    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.data = new Array;
            if(rows.length > 0) { 
                var totQty = 0, totAmt = 0;
                for(var i in rows) {
                    var data = new Object;

                    data["Barcode"] = rows[i].barcode_no;
                    data["Quantity"] = rows[i].quantity;
                    data["Amount"] = rows[i].amount;
                    data["Prize Value"] = rows[i].prize_value;
                    data["Symbols"] = rows[i].symbols;
                    data["Time"] = rows[i].time;
                    totQty += rows[i].quantity;
                    totAmt += rows[i].amount;
                    response.data.push(data);
                }
                response.data.push({
                    "Barcode":"Grand Total",
                    "Quantity":totQty,
                    "Amount":totAmt, 
                    "Prize Value":"", 
                    "Symbols":"", 
                    "Time":""
                });
                //response.timer = 
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }
    });
            
};


exports.loadtsalesrpt = function(connection,socket, cldata) {
    //connection.connect();
    var fields = [cldata.uid, cldata.seldatefrom, cldata.seldateto, cldata.uid, cldata.seldatefrom, cldata.seldateto];
    /*20140222GB-C3GT88-BEGIN Calculation commision percent is wrong so commented*/
    /*var loadqry = "SELECT sum(tts.quantity) AS qty, ROUND(sum(tts.amount), 2) AS amount, DATE(tts.trans_date) AS ts_date, DATE(tts.claimed_date) AS claimed_date, \
                            SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, \
                            ROUND((SUM(tts.amount)*tbgm.commission_percent/100), 2) AS profit \
                            FROM t_transaction_mas tts LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                            WHERE tts.terminal_id=? AND DATE(tts.trans_date) BETWEEN ? AND ? \
                            AND tts.cancel_ticket=0 GROUP BY DATE(tts.trans_date) \
                            UNION \
                            SELECT '', '', DATE(tts.trans_date) AS ts_date, \
                            DATE(tts.claimed_date) AS claimed_date, \
                            SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, '' \
                            FROM t_transaction_mas tts LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                            WHERE tts.terminal_id=? AND DATE(tts.claimed_date) BETWEEN ? AND ? \
                            AND tts.cancel_ticket=0 GROUP BY DATE(tts.claimed_date) ORDER BY amount ";*/
    /*20140222GB-C3GT88-END*/      
    /*20140222GB-C3GT88-BEGIN Commission percent calculated correct*/
    var loadqry = "SELECT sum(tts.quantity) AS qty, ROUND(sum(tts.amount), 2) AS amount, DATE(tts.trans_date) AS ts_date, DATE(tts.claimed_date) AS claimed_date, \
                            SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, \
                            ROUND(SUM(tts.amount * tbgm.commission_percent/100), 2) AS profit \
                            FROM t_transaction_mas tts LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                            WHERE tts.terminal_id=? AND DATE(tts.trans_date) BETWEEN ? AND ? \
                            AND tts.cancel_ticket=0 GROUP BY DATE(tts.trans_date) \
                            UNION \
                            SELECT '', '', DATE(tts.trans_date) AS ts_date, \
                            DATE(tts.claimed_date) AS claimed_date, \
                            SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, '' \
                            FROM t_transaction_mas tts LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                            WHERE tts.terminal_id=? AND DATE(tts.claimed_date) BETWEEN ? AND ? \
                            AND tts.cancel_ticket=0 GROUP BY DATE(tts.claimed_date) ORDER BY amount ";
    /*20140222GB-C3GT88-END*/
    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.data = new Array;
            if(rows.length > 0) { 
                var totQty = 0, totAmt = 0, totProfit = 0, totPrize = 0, claim_prize = 0;
                var claim_date = new Object();
                for(var i in rows) {
                              
                    if(claim_date[rows[i].ts_date] == undefined) {
                        rows[i].claimed_date !=null ? claim_date[rows[i].claimed_date] = rows[i].prize : "";
                        claim_prize += rows[i].claimed_date !=null ? rows[i].prize : 0;
                        if(rows[i].amount != "") {
                            totQty += parseInt(rows[i].qty);
                            totAmt += parseFloat(rows[i].amount);
                            totProfit += parseFloat(rows[i].profit);
                            totPrize += rows[i].prize != null ? parseFloat(rows[i].prize): 0; 
                        }
                    } else {
                        //prize = claim_date[rows[i].ts_date] == undefined ? rows[i].prize : claim_date[rows[i].ts_date] ;
                        totQty += rows[i].qty!="" ? parseInt(rows[i].qty) : 0 ;
                        totAmt += rows[i].amount !="" ? parseFloat(rows[i].amount) : 0;
                        totProfit += rows[i].profit !="" ? parseFloat(rows[i].profit) : 0;
                        //20140909GB-C2BS6-BEGIN- Claim ticket added twicely when user cliamed so commented
                        //totPrize += claim_prize != null ? parseFloat(claim_prize): 0;
                        //20140909GB-C2BS6-END
                        //20140909GB-C2BS6-BEGIN- Claim ticket price amount addded
                        totPrize += claim_date[rows[i].ts_date] != null ? parseFloat(claim_date[rows[i].ts_date]): 0;
                        //20140909GB-C2BS6-END
                    }
                                  
                }
                         
                totPrize = totPrize == 0 ? claim_prize : totPrize.toFixed(2);
                totAmt = totAmt == 0 ? totAmt : totAmt.toFixed(2);
                totProfit = totProfit == 0 ? totProfit : totProfit.toFixed(2);
                console.log(totPrize);
                          
                response.data.push({
                    "Particulars":"Total Sales",
                    "Quantity":totQty,
                    "Amount":totAmt
                });
                response.data.push({
                    "Particulars":"Total Purchase",
                    "Quantity":"-",
                    "Amount":parseFloat(totAmt)- parseFloat(totProfit)
                });
                response.data.push({
                    "Particulars":"PWT",
                    "Quantity":"-",
                    "Amount":totPrize
                });
                response.data.push({
                    "Particulars":"GP",
                    "Quantity":"-",
                    "Amount":totProfit
                });
                response.data.push({
                    "Particulars":"Net Balance",
                    "Quantity":"-",
                    "Amount":parseFloat(totAmt)- parseFloat(totPrize)-parseFloat(totProfit)
                });
                //response.timer = 
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8'); 
        } else {
            handle_query_error(err);
        }
    });
//console.log(query.sql);
            
};


exports.loadosalesrpt = function(connection,socket, cldata) {
    //connection.connect();
    var fields = [cldata.uid, cldata.seldatefrom, cldata.seldateto, cldata.uid, cldata.seldatefrom, cldata.seldateto];
    /*20140222GB-C3GT88-BEGIN Calculation commision percent is wrong so commented*/
    /*var loadqry = 	"SELECT sum(tts.amount) AS amount, SUM(tts.quantity) as qty, tum1.user_id_pk AS user_id, \
                                    SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, \
                                    (SUM(tts.amount)*tbgm.commission_percent/100) AS profit \
                                    FROM t_transaction_mas tts \
                                    LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                                    LEFT JOIN t_user_mas AS tum ON tum.user_id_pk = tts.terminal_id \
                                    LEFT JOIN t_user_mas AS tum1 ON tum1.user_id_pk = tum.parent_id \
                                    WHERE tts.terminal_id=? AND DATE(tts.trans_date) BETWEEN ? AND ? \
                                    AND tts.cancel_ticket=0 GROUP BY tum1.user_code \
                                    UNION \
                                    SELECT '', '', tum1.user_id_pk AS user_id, SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, \
                                    '' \
                                    FROM t_transaction_mas tts \
                                    LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                                    LEFT JOIN t_user_mas AS tum ON tum.user_id_pk = tts.terminal_id \
                                    LEFT JOIN t_user_mas AS tum1 ON tum1.user_id_pk = tum.parent_id \
                                    WHERE tts.terminal_id=? AND DATE(tts.claimed_date) BETWEEN ? AND ? \
                                    AND tts.cancel_ticket=0 GROUP BY tum1.user_code ORDER BY amount";*/
    /*20140222GB-C3GT88-END*/
    /*20140222GB-C3GT88-BEGIN Commission percent calculated correct*/
    var loadqry = 	"SELECT sum(tts.amount) AS amount, SUM(tts.quantity) as qty, tum1.user_id_pk AS user_id, \
                                    SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, \
                                    SUM(tts.amount * tbgm.commission_percent/100) AS profit \
                                    FROM t_transaction_mas tts \
                                    LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                                    LEFT JOIN t_user_mas AS tum ON tum.user_id_pk = tts.terminal_id \
                                    LEFT JOIN t_user_mas AS tum1 ON tum1.user_id_pk = tum.parent_id \
                                    WHERE tts.terminal_id=? AND DATE(tts.trans_date) BETWEEN ? AND ? \
                                    AND tts.cancel_ticket=0 GROUP BY tum1.user_code \
                                    UNION \
                                    SELECT '', '', tum1.user_id_pk AS user_id, SUM(CASE tts.claimed WHEN 1 THEN tts.prize_value ELSE NULL END)  AS prize, \
                                    '' \
                                    FROM t_transaction_mas tts \
                                    LEFT JOIN t_brand_game_map AS tbgm ON tbgm.brand_game_id = tts.brand_game_map_id \
                                    LEFT JOIN t_user_mas AS tum ON tum.user_id_pk = tts.terminal_id \
                                    LEFT JOIN t_user_mas AS tum1 ON tum1.user_id_pk = tum.parent_id \
                                    WHERE tts.terminal_id=? AND DATE(tts.claimed_date) BETWEEN ? AND ? \
                                    AND tts.cancel_ticket=0 GROUP BY tum1.user_code ORDER BY amount";
    /*20140222GB-C3GT88-END*/
    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.data = new Array;
            var claim_user_id = new Object();
            if(rows.length > 0) { 
                var totQty = 0, totAmt = 0, totProfit = 0, totPrize =0, claim_prize = 0;
                for(var i in rows) {
                    if(claim_user_id[rows[i].user_id] == undefined) {
                        claim_user_id[rows[i].user_id] = rows[i].prize;
                        claim_prize += rows[i].amount == "" ? rows[i].prize : 0;
                        if(rows[i].amount != "") {
                            totQty += parseInt(rows[i].qty);
                            totAmt += parseFloat(rows[i].amount);
                            totProfit += parseFloat(rows[i].profit);
                            totPrize += rows[i].prize!=null ? parseFloat(rows[i].prize): 0;
                        }
                                 
                    } else {
                        //prize = claim_user_id[rows[i].user_id] == undefined ? rows[i].prize : claim_user_id[rows[i].user_id] ;
                        totQty += rows[i].qty !="" ? parseInt(rows[i].qty) : 0;
                        totAmt += rows[i].amount !="" ? parseFloat(rows[i].amount) : 0;
                        totProfit += rows[i].profit != "" ? parseFloat(rows[i].profit) : 0;
                        totPrize += claim_prize != null ? parseFloat(claim_prize): 0;
                    }
                              

                }
                totPrize = totPrize == 0 ? claim_prize : totPrize;
                totAmt = totAmt == 0 ? totAmt : totAmt.toFixed(2);
                totProfit = totProfit == 0 ? totProfit : totProfit.toFixed(2);
                response.data.push({
                    "Particulars":"Total Sales",
                    "Quantity":totQty,
                    "Amount":totAmt
                });
                response.data.push({
                    "Particulars":"PWT",
                    "Quantity":"-",
                    "Amount":totPrize
                });
                response.data.push({
                    "Particulars":"Net Balance",
                    "Quantity":"-",
                    "Amount":parseFloat(totAmt)- parseFloat(totPrize)
                });
                //response.timer = 
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }
    });
            
};

exports.loadadnresultrpt = function(connection,socket, cldata) {
    //connection.connect();

    var fields = [cldata.seldate, cldata.uid];
    var loadqry = "SELECT tbgm.game_name, lrm.result,  DATE_FORMAT(lrm.result_date_time, '%d/%m/%Y') AS draw_date, DATE_FORMAT(lrm.interval_time, '%h:%i %p') AS draw_time, tbgm.game_rate \
                            FROM lotto_result_mas lrm \
                            LEFT JOIN t_brand_game_map tbgm ON lrm.brand_game_map_id= tbgm.brand_game_id \
							LEFT JOIN t_game_terminal_map gtm ON lrm.brand_game_map_id= gtm.brand_game_id \
                            LEFT JOIN t_game_mas tgm ON tbgm.game_id = tgm.game_id \
                            WHERE  DATE(lrm.result_date_time) = ? AND gtm.terminal_id = ?  AND tbgm.status = 1 ";
    if(cldata.type==1)
        loadqry += 	"AND TIME(lrm.interval_time) < TIME(NOW()) ";
                
    loadqry += "ORDER BY  lrm.interval_time ASC;";

    var query = connection.query(loadqry, fields, function(err, rows) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            response.data = new Array;
            if(rows.length > 0) { 
                for(var i in rows) {
                    var data = new Object;

                    data["Game Name"] = rows[i].game_name;
                    data["Draw Date"] = rows[i].draw_date;
                    data["Draw Time"] = rows[i].draw_time;
                    data["MRP"] = rows[i].game_rate;
                    data["Result"] = rows[i].result;
                    response.data.push(data);
                }

                //response.timer = 
                response.result = true;
            } else {
                response.result = false;
            }
            //console.log(JSON.stringify(response));
            socket.write(JSON.stringify(response)+"\0", 'utf8');  
        } else {
            handle_query_error(err);
        }     
    });
// console.log(query.sql)
            
};


exports.manualresult = function(connection,socket, cldata, processResultList) {
    //console.log(JSON.stringify(cldata));
    var response = new Object;
    response.result = false;
    //processResultList[cldata.interval_time].forEach(function (period){
    for(var i =0; i< processResultList[cldata.interval_time].length; i++) {        
        var period = processResultList[cldata.interval_time][i];
        if(period.brand_id==cldata.brand_id && period.brand_game_id==cldata.brand_game_id && period.interval_id==cldata.interval_id) {
            processResultList[cldata.interval_time][i].override = 1;
            processResultList[cldata.interval_time][i].result = cldata.result;
            response.result = true;
            break;
            
        }
    }
    
    //console.log(processResultList);
    
    
    
    socket.write(JSON.stringify(response)+"\0", 'utf8');  
};

exports.dashboard = function(connection,socket, cldata, connectionList) {
    //console.log(JSON.stringify(cldata));
    var response = new Object;
    response.fname = cldata.fname;
    response.block = true;
    
    var connListArr = searchObject(connectionList,"brand_id",cldata.brand_id);
    //console.log(connListArr);                        
      
    for(i in connListArr) {
        if(typeof(connectionList[connListArr[i]]) != 'undefined') { 
            var clsocket = connectionList[connListArr[i]];
            console.log(clsocket.user_id)
            console.log(cldata.users)
            console.log(cldata.users.indexOf(clsocket.user_id));
            if(cldata.users.indexOf(clsocket.user_id)!= -1) {
                clsocket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
        }    
    }
    
};

exports.updatebalance = function(connection,socket, cldata, connectionList) {

    var response = new Object;
    response.fname = cldata.fname;
    response.balance = cldata.balance;
    var connListArr = searchObject(connectionList,"user_id",cldata.user_id);
    //console.log(connListArr);                        
      
    for(i in connListArr) {
        if(typeof(connectionList[connListArr[i]]) != 'undefined') { 
            var clsocket = connectionList[connListArr[i]];
            //console.log(clsocket.user_id)
            
            
            //if(clsocket.user_id==cldata.user_id) {
            clsocket.write(JSON.stringify(response)+"\0", 'utf8');  
        // console.log(JSON.stringify(response))
        //}
        }    
    }
    
};
/*
 * Insert logs for table
 * Created By : Gobi Baskaran
 * Date       : 12-Sep-2013  
 */
exports.insertLogs = function(connection,socket, cldata) {
    //console.log(cldata.logData[0].User_Id);
    var chkQry ;    
    if(cldata.logDate != cldata.curDate) {
        if(cldata.logType == 0) {
            chkQry = "DELETE FROM t_user_logs WHERE DATE(log_date) = ? AND log_source = ? AND user_id= ?";
        } else {
            chkQry = "DELETE FROM t_error_logs WHERE DATE(error_occured_date) = ? AND error_source = ? AND user_id_fk= ?";
        }
        //console.log(chkQry);
        var getCntQry = connection.query(chkQry, [cldata.logDate, 1, cldata.logData[0].User_Id], function(err, rows) {
            if(err===null) {
                insertLogsQry(connection, socket, cldata);
            } else {
                handle_query_error(err);
            }
        });
        
    } else {
        insertLogsQry(connection,socket, cldata);
    }
    
};

exports.pullLogs = function(connection, socket, cldata, connectionList) {
    console.log("pullLogs");
    var response = new Object;
    response.fname = cldata.fname;
    var connList = searchObject(connectionList,"user_id",cldata.user_id);
    //console.log(connListArr);                        
    console.log(cldata.user_id);
    console.log(connList);
    
    if(typeof(connectionList[connList[0]]) != 'undefined') { 
        response.result = true;
        response.logDate = cldata.log_date;
        response.logType = cldata.log_type;
        var clsocket = connectionList[connList[0]];
        clsocket.write(JSON.stringify(response)+"\0", 'utf8');  
        socket.write(JSON.stringify(response)+"\0", 'utf8'); 
            
    }    
    
};
    
searchObject = function(obj, id, find) {
    var arr = Object.keys( obj ).map(function ( key ) { 
        return obj[key][id]== find ? key: null;
    }).filter(function(val) {
        return val !== null
    });
    return arr;
};

function handle_query_error(err) {
    console.log(err);
    console.logger.error(err);
}

function insertLogsQry(connection,socket, cldata) {
    var isql, ivalues;
    if(cldata.logType == 0) {
        isql = "INSERT INTO t_user_logs (user_id, brand_id, task_type, log_date, log_source, description) VALUES";
        ivalues = new Array;
        for(var userLogs in cldata.logData) {
            ivalues.push("("+cldata.logData[userLogs].User_Id+","+cldata.logData[userLogs].Brand_Id+",'"+cldata.logData[userLogs].Task_Type+"','"+cldata.logData[userLogs].Log_Date+"',"+1+",'"+cldata.logData[userLogs].Description+"')");
        }
    } else {
        isql = "INSERT INTO t_error_logs (error_code, user_id_fk, brand_id, error_occured_date, brand_game_map_id, error_source, error_description) VALUES";
        ivalues = new Array;
        for(var errorLogs in cldata.logData) {
            ivalues.push("("+cldata.logData[errorLogs].Error_Id+","+cldata.logData[errorLogs].User_Id+","+cldata.logData[errorLogs].Brand_Id+",'"+cldata.logData[errorLogs].Error_Date+"',"+cldata.logData[errorLogs].Game_Id+","+1+",'"+cldata.logData[errorLogs].Description+"')");
        }
    }
    isql += ivalues.join(",");
    var query = connection.query(isql, function(err, results) {
        if(err===null) {
            var response = new Object;
            response.fname = cldata.fname;
            if(results.affectedRows > 0) { 
                response.result = 1;
                response.logType = cldata.logType;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            } else {
                response.result = 0;
                socket.write(JSON.stringify(response)+"\0", 'utf8');  
            }
        } else {
            handle_query_error(err);
        }
    }); 
    
}
