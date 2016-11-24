var config = require('../config');
var settings = config.settings(), printMsg;

var nodemailer = require(settings.npm.path+"nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: settings.mail.host, // hostname
    secureConnection: false, // use SSL
    port: settings.mail.port, // port for secure SMTP
    auth: {
        user: settings.mail.user,
        pass: settings.mail.pwd
    }
});

exports.setupCalc = function(connection, date) {
    printMsg = "";
    var selectqry = connection.query("SELECT * FROM lotto_result_mas WHERE DATE(result_date_time) = DATE(NOW());",  function(serr, rows) {
        if(serr===null) {
            if(rows.length <= 0) { 
                var setupqry = "INSERT INTO lotto_result_mas(brand_id, brand_game_map_id, interval_id, prize, result_date_time, interval_time) \
                                SELECT gi.brand_id, gi.brand_game_id, gi.interval_id, bgm.prize_value, NOW(), gi.interval_time \
                                FROM t_game_interval gi \
                                LEFT JOIN t_brand_game_map bgm ON gi.brand_game_id = bgm.brand_game_id \
                                WHERE bgm.status = 1 \
                                ORDER BY gi.interval_time, gi.brand_id; ";
                var query = connection.query(setupqry, function(err, result) {
                    printMsg += "==============================================================================\n";
                    printMsg += "3AM Script run at:"+ date + "\n";
                    printMsg += "==============================================================================\n";
                    if(err===null) {
                        var resetQry = connection.query('UPDATE t_brand_game_map SET container=0', function(rsterr,rstResult) {});
                        printMsg += "No error found in Select Query.\n";
                        printMsg += "Select Query Total Rows:"+ result.affectedRows + "\n";
                        if(result.affectedRows > 0) { 
                            printMsg += "Updated process @ 3AM Successfully.\n";
                        } else {
                            printMsg += "Failed to update process @ 3AM.\n";
                        }
                    } else {
                        printMsg += "Error found in Insert Query:"+ err + "\n";
                        handle_query_error(err);
                    }
					  
                    smtpTransport.sendMail({
                        from: settings.mail.sender, // sender address
                        to: [settings.mail.receiver1,settings.mail.receiver2], // comma separated list of receivers
                        subject: "3AM Script Status - Reg", // Subject line
                        text: printMsg // plaintext body
                    }, function(error, response){
                        if(error){
                            printMsg += "Mail Sent Error:"+error+ "\n";
                        }else{
                            printMsg += "Mail Sent Successfully: " + response.message + "\n";
                        }
                        console.log (printMsg); 
                    });		  
                }); 
            } else {
                printMsg += "3AM script already ran successfully: " + date;
            //processCalc (connection, date, connectionList=null);
            }
        } else {
            printMsg += "Error found in Select Query:"+ serr + "\n";
            handle_query_error(serr);
        }
        console.log (printMsg); 
    });
    
//connection.end();
};


exports.processCalc = function(connection, date, connectionList) {
    //processCalc = function(connection, date, connectionList) {   
    
    var itime = ('0' + date.getHours()).slice(-2)+":"+('0' + date.getMinutes()).slice(-2)+":00";
   // itime = "18:06:00";
    //console.log(itime)
    //console.log(connection)
    
    //if(typeof(processResultList[itime]) != "undefined") {
    //console.log("inside");
    
    console.log("==============================================================================");
    console.log("Result Calculation at:"+ date);
    console.log("==============================================================================");
	// 20140111AV-C1SWP3-BEGIN 
    /*20140319GB-18CRD-BEGIN select new column result_calc_type so commented*/
    /*var selIntqry = "SELECT lrm.result_id_pk, bm.brand_id, bm.brand_name, bm.payout_percent, bm.result_type_fn, siv.brand_game_id, siv.game_name, siv.game_rate, siv.game_id, siv.prize_value, \
					siv.commission_percent, siv.game_symbols AS symbols, siv.game_config AS config, siv.container, siv.series_rate, siv.series_prize, siv.series_name, lrm.interval_id, lrm.interval_time, lrm.override, lrm.override_result, DATE_FORMAT(lrm.interval_time, '%h:%i %p') AS display_time \
					FROM lotto_result_mas lrm \
					LEFT JOIN series_info_view siv ON lrm.brand_game_map_id = siv.brand_game_id \
					LEFT JOIN t_brand_mas bm ON lrm.brand_id = bm.brand_id \
					WHERE siv.status = 1 AND bm.status = 1 AND DATE(lrm.result_date_time) = DATE(NOW()) AND lrm.interval_time = ? \
					ORDER BY lrm.interval_time,lrm.brand_id;";*/
    /*20140319GB-18CRD-END*/
	//END
   /*20140319GB-18CRD-BEGIN select new column result_calc_type*/     
   var selIntqry = "SELECT lrm.result_id_pk, bm.brand_id, bm.brand_name, bm.payout_percent, bm.result_type_fn, siv.brand_game_id, siv.game_name, siv.game_rate, siv.game_id, siv.prize_value, \
					siv.commission_percent, siv.game_symbols AS symbols, siv.game_config AS config, siv.container, siv.series_rate, siv.series_prize, siv.series_name, siv.result_calc_type, lrm.interval_id, lrm.interval_time, lrm.override, lrm.override_result, DATE_FORMAT(lrm.interval_time, '%h:%i %p') AS display_time \
					FROM lotto_result_mas lrm \
					LEFT JOIN series_info_view siv ON lrm.brand_game_map_id = siv.brand_game_id \
					LEFT JOIN t_brand_mas bm ON lrm.brand_id = bm.brand_id \
					WHERE siv.status = 1 AND bm.status = 1 AND DATE(lrm.result_date_time) = DATE(NOW()) AND lrm.interval_time = ? \
                                        ORDER BY lrm.interval_time,lrm.brand_id;";     
    /*20140319GB-18CRD-END*/
    var intQuery = connection.query(selIntqry,itime,  function(intErr, intRows) {
        if(intErr===null) {
            console.log("No error in selecting interval query.");
            if(intRows.length > 0) { 
                var throwResult = new Object, trBrandId = null , loopCnt = 0, sqlCnt = 0;
	
                console.log("No. of rows returned in interval query:"+ intRows.length);
                intRows.forEach(function (period){
				
                    if(trBrandId!=period.brand_id) {
                        throwResult[period.brand_id] = new Object;  
                        trBrandId = period.brand_id;
                    }
                    var processqry = "SELECT * FROM t_transaction_mas WHERE interval_id = ? AND DATE(trans_date) = DATE(NOW()) AND cancel_ticket = 0;";
                    var query = connection.query(processqry,period.interval_id,  function(err, rows) {
                        // Calculation based on games 
                        if(err===null) {
							
                            var rcalcType = require('./result/'+ period.result_type_fn);
                            var lotto = rcalcType.result(period, rows);

                            var fields  = [lotto.result.join(","), period.payout_percent, lotto.tot_qty.join(","), lotto.min_amt.join(","), lotto.tsv.join(","), lotto.prev_container, lotto.cur_container, lotto.container, period.result_id_pk];
                            console.log("fields: "+fields);
                            //var lrmquery = connection.query('UPDATE lotto_result_mas SET result=?, result_date_time = CONCAT_WS(" ",DATE(result_date_time), CURTIME()), status = 1, payout=?, tot_qty=?, min_amt=?, tsv=?  WHERE  result_id_pk = ?', fields, function(ierr, results) { 
                            var lrmquery = connection.query('UPDATE lotto_result_mas lrm, t_brand_game_map bgm SET lrm.result=?,lrm.result_date_time = CONCAT_WS(" ",DATE(lrm.result_date_time), CURTIME()), lrm.status = 1, lrm.payout=?,lrm.tot_qty=?, lrm.min_amt=?,lrm.tsv=?, lrm.prev_container=?, lrm.cur_container=?, bgm.container=? WHERE lrm.brand_game_map_id=bgm.brand_game_id AND lrm.result_id_pk = ?', fields, function(ierr, results) { 
                                if(ierr===null) {
                                    console.log("\t+++++++++++++Loop:"+sqlCnt+"+++++++++++++");
                                    console.log("\tNo Errors found in updating the result");
                                    if(results.affectedRows > 0) {
										  
										  
                                        console.log("\tNo. of affected rows with result update:"+results.affectedRows);
                                        console.log("\tBrand Name:" + period.brand_name +"(Id:"+period.brand_id+"), Game Name:"+period.game_name+"(Id:"+period.brand_game_id+"), Interval Time:"+period.interval_time+"(Id:"+period.interval_id+"), Result:" + lotto.result.join(","));
                                        throwResult[period.brand_id][period.brand_game_id]={
                                            "brand_game_id":period.brand_game_id, 
                                            "interval_id":period.interval_id,
                                            "interval_time": period.interval_time,
                                            "display_time": period.display_time,
                                            "result":lotto.result.join(",")
                                            };
                                        sqlCnt++;
                                          
                                        if(lotto.winner.length>0) {
                                            var udtqry = "UPDATE t_transaction_mas SET status = 1, prize_value = CASE trans_id_pk", transIds = new Array; 
                                            for(var r=0; r<lotto.winner.length; r++) {
                                                lotto.winner[r].details.forEach( function(prize) {
                                                    /*20140121GB-C3GT4S1S-BEGIN This line not suitable for series game so commented*/
                                                    //udtqry += " WHEN "+prize.transId+" THEN "+prize.qty * prize.prize_value;
                                                    /*20140121GB-C3GT4S1S-END*/
                                                    /*20140121GB-C3GT4S1S-BEGIN Updating total prize amount*/
                                                    udtqry += " WHEN "+prize.transId+" THEN "+prize.totPrize;
                                                    /*20140121GB-C3GT4S1S-END*/
                                                    transIds.push(prize.transId);
                                                }); 
													 
                                            }
                                            udtqry += " END WHERE trans_id_pk IN("+transIds.join(",")+")"	
													   
                                            var winqry = connection.query(udtqry, function(winerr, winResults) { 
                                                if(winerr===null) {
                                                    console.log("\t\tNo Errors found in updating the winner list");
                                                    if(winResults.affectedRows > 0) {
                                                        console.log("\t\tNo. of affected rows with winner update:"+winResults.affectedRows);
                                                    } else {
                                                        console.log("\t\tFailed to updating winner."+ winqry.sql); 
                                                    }
                                                } else {
                                                    console.log("\t\tError found in updating winner."+ winerr); 
                                                    handle_query_error(winerr);
                                                }
													
                                            });	
                                        }
                                        //console.log("here")
                                        //console.log(loopCnt +"=="+ sqlCnt);
                                        if(loopCnt == sqlCnt) {
                                            console.log("Sending list to terminals...")
                                            sendResult(connectionList, throwResult);
                                        }
                                            
                                            

                                    } else {
                                        console.log("Failed to updating result."+ lrmquery.sql); 
                                        console.log("Brand Name:" + period.brand_name +"(Id:"+period.brand_id+"), Game Name:"+period.game_name+"(Id:"+period.brand_game_id+"), Interval Time:"+period.interval_time+"(Id:"+period.interval_id+"), Result:" + lotto.result.join(","));
                                        console.logger.info("Failed to publish result."+ lrmquery.sql);
                                    }
                                } else { //ierror
                                    console.log("Error found with update query."+ ierr); 
                                    console.log("Brand Name:" + period.brand_name +"(Id:"+period.brand_id+"), Game Name:"+period.game_name+"(Id:"+period.brand_game_id+"), Interval Time:"+period.interval_time+"(Id:"+period.interval_id+"), Result:" + lotto.result.join(","));
                                    handle_query_error(ierr);
                                }
                            });
                        
               
                  


                        //processCalc(connection, date, processResultList)
                        } else {
                            handle_query_error(err);
                        }
                  
                    }); 


                    loopCnt++; 
                });
            } else {
                console.log("No rows found for the interval:" + date);
            }	
        } else {
            console.log("Found error in selecting interval query");
            handle_query_error(intErr);
        }		
    });
    
//}
//connection.end();
};
exports.archiveDB = function(connection) {
    printMsg = ""; 
    connection.query('CALL archive_res_trans_proc', function(err, results) {
        printMsg += "================================================================================\n";
        printMsg += "ARCHIVE TABLE FOR lotto_res_mas and t_transaction_mas.\n"; 
        if(err === null) {
            //console.log(JSON.stringify(results));
            if(results[0][0].flag == 1) {
                printMsg += "Successfully archived table.\n";
                console.log("results: "+results[0][0].flag);
            } else {
                printMsg += "Failed to archive, Please check it.\n";
                console.log("results: "+results[0][0].flag);
            }
          
        } else {
            printMsg += "Error in archiveDB function: "+err;
            console.log("Error in archiveDB function: "+err);
            handle_query_error(err);
        }
        printMsg += "================================================================================\n";
        smtpTransport.sendMail({
            from: settings.mail.sender, // sender address
            to: [settings.mail.receiver1,settings.mail.receiver2], // comma separated list of receivers
            subject: "Archive Table", // Subject line
            text: printMsg // plaintext body
        },function(error, response){
            if(error){
                printMsg += "Mail Sent Error:"+error+ "\n";
            }else{
                printMsg += "Mail Sent Successfully: " + response.message + "\n";
            }
            console.log (printMsg); 
        });	
    });
  
};

sendResult = function (connectionList, throwResult) {
    //Send Result to Client
    var response = new Object;
    response.fname = "result";
    for(ibrand in throwResult) {
        //console.log(ibrand)
        //console.log(throwResult[ibrand]);
        response.result = throwResult[ibrand];
        var connListArr = searchObject(connectionList,"brand_id", ibrand);

        for(i in connListArr) {
            if(typeof(connectionList[connListArr[i]]) != 'undefined') { 
                var clsocket = connectionList[connListArr[i]];
                clsocket.write(JSON.stringify(response)+"\0", 'utf8');  
            }    
        }
    }
// Send Result End
}
findMinObject = function(obj) {
    var arr = Object.keys( obj ).map(function ( key ) { 
        return obj[key].amount; 
    }).filter(function(val) {
        return val !== null
    });
    
    return Math.min.apply( null, arr );
};

searchObject = function(obj, id, find) {
    var arr = Object.keys( obj ).map(function ( key ) { 
        return obj[key][id]== find ? key : null;
    }).filter(function(val) {
        return val !== null
    });
    return arr;
};

findNearestObject = function (obj, nr) {
    var arr = Object.keys( obj ).map(function ( key ) { 
        return obj[key].amount <= nr ? obj[key].amount: null; 
    }).filter(function(val) {
        return val !== null
    });
			  
    arr.sort(function(a,b){
        return a-b
        });
    return arr.pop();
}  

findClosestObject = function (obj, num) {
    var arr = Object.keys( obj ).map(function ( key ) { 
        return obj[key].amount; 
    }).filter(function(val) {
        return val !== null
    });
    var curr = arr[0];
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;				
}  

function handle_query_error(err) {
    console.log(err);
    console.logger.error(err);
}