var printMsg;
exports.skipwinner = function(connection, socket, cldata, date) {
    printMsg = "";
	
    var udtqry = "UPDATE t_transaction_mas SET status = 1, prize_value = CASE trans_id_pk", transIds = new Array; 
    cldata.skip.forEach(function (trans){
        udtqry += " WHEN "+trans.id+" THEN "+trans.prize;
        transIds.push(trans.id);
    }); 
    udtqry += " END WHERE trans_id_pk IN("+transIds.join(",")+") "
	
    var winqry = connection.query(udtqry, function(winerr, winResults) { 
        if(winerr===null) {
            printMsg += "No error found in updating winner.\n";
            if(winResults.affectedRows > 0) {
                printMsg += "No. of affected rows with winner update:"+winResults.affectedRows+"\n";
            } else {
                printMsg += "Failed to updating winner."+winqry.sql+"\n"; 
            }
        } else {
            printMsg += "Error found in updating winner."+winerr+"\n"; 
            handle_query_error(winerr);
        }
        socket.end(printMsg+"\0", 'utf8');
        console.log(printMsg);
    });
    
};
exports.skip3am = function(connection, socket, cldata, date) {
	
    printMsg = "";
    var selectqry = connection.query("SELECT * FROM lotto_result_mas WHERE DATE(result_date_time) = DATE(NOW());",  function(serr, rows) {
        if(serr===null) {  
            if(rows.length <= 0) { 
				
                var setupqry = "INSERT INTO lotto_result_mas(brand_id, brand_game_map_id, interval_id, prize, result_date_time, interval_time) \
                                SELECT gi.brand_id, gi.brand_game_id, gi.interval_id, bgm.prize_value, NOW(), gi.interval_time \
                                FROM t_game_interval gi \
                                LEFT JOIN t_brand_game_map bgm ON gi.brand_game_id = bgm.brand_game_id \
                                WHERE bgm.status = 1 \
                                ORDER BY gi.interval_time, gi.brand_id;";
				
				
                var query = connection.query(setupqry, function(err, result) {
                    printMsg += "==============================================================================\n";
                    printMsg += "3AM Script run at:"+ date + "\n";
                    printMsg += "==============================================================================\n";
                    if(err===null) {
                        printMsg += "No error found in Select Query.\n";
                        printMsg += "Select Query Total Rows:"+ result.affectedRows + "\n";
                        if(result.affectedRows > 0) { 
                            printMsg += "Updated process @ 3AM Successfully.\n";
                        } else {
                            printMsg += "Failed to update process @ 3AM.\n";
                        }
                        console.log (printMsg); 
                        socket.end(printMsg+"\0", 'utf8');
					  
                    } else {
                        printMsg += "Error found in Insert Query:"+ err + "\n";
                        socket.end(printMsg+"\0", 'utf8');
                        handle_query_error(err);
                    }
					  
									
					  
                }); 
            } else {
                printMsg += "3AM script already ran successfully: " + date;
                socket.end(printMsg+"\0", 'utf8');
            }
        } else {
            printMsg += "Error found in Select Query:"+ serr + "\n";
            socket.end(printMsg+"\0", 'utf8');
            handle_query_error(serr);
        }
        console.log (printMsg); 
    });
    
//connection.end();
};


exports.skipresult = function(connection, socket, cldata, date) {
   
    console.log("==============================================================================");
    console.log("Result Calculation at:"+ date);
    console.log("==============================================================================");
    /*var selIntqry = "SELECT lrm.result_id_pk, bm.brand_id, bm.brand_name, bm.payout_percent, bm.result_type_fn, bgm.brand_game_id, bgm.game_name, bgm.game_rate, bgm.game_id, bgm.prize_value, \
                    bgm.commission_percent, bgm.game_symbols AS symbols, bgm.game_config AS config, lrm.interval_id, lrm.interval_time, lrm.override, lrm.override_result \
                    FROM lotto_result_mas lrm \
                    LEFT JOIN t_brand_game_map bgm ON lrm.brand_game_map_id = bgm.brand_game_id \
                    LEFT JOIN t_brand_mas bm ON lrm.brand_id = bm.brand_id \
                    WHERE bgm.status = 1 AND DATE(lrm.result_date_time) = DATE(NOW()) AND TIME(lrm.interval_time) < TIME(NOW()) AND lrm.status = 0  \
                    ORDER BY lrm.interval_time,lrm.brand_id;";*/
    var selIntqry = "SELECT lrm.result_id_pk, bm.brand_id, bm.brand_name, bm.payout_percent, bm.result_type_fn, siv.brand_game_id, siv.game_name, siv.game_rate, siv.series_rate, siv.game_id, siv.prize_value, siv.series_prize, siv.series_name,  \
                    siv.commission_percent, siv.game_symbols AS symbols, siv.game_config AS config, lrm.interval_id, lrm.interval_time, lrm.override, lrm.override_result \
                    FROM lotto_result_mas lrm \
                    LEFT JOIN series_info_view siv ON lrm.brand_game_map_id = siv.brand_game_id \
                    LEFT JOIN t_brand_mas bm ON lrm.brand_id = bm.brand_id \
                    WHERE siv.status = 1 AND DATE(lrm.result_date_time) = DATE(NOW()) AND TIME(lrm.interval_time) < TIME(NOW()) AND lrm.status = 0  \
                    ORDER BY lrm.interval_time,lrm.brand_id;";
				
    var intQuery = connection.query(selIntqry,  function(intErr, intRows) {
        if(intErr===null) {
            console.log("No error in selecting interval query.");
            if(intRows.length > 0) { 
                var trBrandId = null , loopCnt = 0, sqlCnt = 0, gmContainer = new Object;
	
                console.log("No. of rows returned in interval query:"+ intRows.length);
                intRows.forEach(function (period){
				
                    if(trBrandId!=period.brand_id) {
                        //throwResult[period.brand_id] = new Object;  
                        trBrandId = period.brand_id;
                    }
                    var processqry = "SELECT * FROM t_transaction_mas WHERE interval_id = ? AND DATE(trans_date) = DATE(NOW()) AND cancel_ticket = 0;";

                    var query = connection.query(processqry,period.interval_id,  function(err, rows) {
                        // Calculation based on games 
                        if(err===null) {
                            if(typeof gmContainer[period.brand_game_id] == 'undefined')  gmContainer[period.brand_game_id] = 0;
							
                            console.log(typeof gmContainer[period.brand_game_id]);
                            console.log("brand_game_id:"+ period.brand_game_id);
                            console.log(gmContainer[period.brand_game_id]);
                            period.container =  parseFloat(gmContainer[period.brand_game_id]);
                            var rcalcType = require('./result/'+ period.result_type_fn);
                            var lotto = rcalcType.result(period, rows);
                            console.log("return"+lotto.winner.length);
                            console.log(parseFloat(gmContainer[period.brand_game_id]) +"+"+ parseFloat(lotto.container));
                            gmContainer[period.brand_game_id] = parseFloat(lotto.container);
                            console.log(gmContainer[period.brand_game_id]);
                            var fields  = [lotto.result.join(","), period.payout_percent, lotto.tot_qty.join(","), lotto.min_amt.join(","), lotto.tsv.join(","), lotto.prev_container, lotto.cur_container, period.result_id_pk];
							
                            var lrmquery = connection.query('UPDATE lotto_result_mas lrm SET lrm.result=?,lrm.result_date_time = CONCAT_WS(" ",DATE(lrm.result_date_time), CURTIME()), lrm.status = 1, lrm.payout=?,lrm.tot_qty=?, lrm.min_amt=?,lrm.tsv=?, lrm.prev_container=?, lrm.cur_container=? WHERE lrm.result_id_pk = ?', fields, function(ierr, results) { 
                                if(ierr===null) {
                                    console.log("\t+++++++++++++Loop:"+sqlCnt+"+++++++++++++");
                                    console.log("\tNo Errors found in updating the result");
                                    if(results.affectedRows > 0) {
										  
										  
                                        console.log("\tNo. of affected rows with result update:"+results.affectedRows);
                                        console.log("\tBrand Name:" + period.brand_name +"(Id:"+period.brand_id+"), Game Name:"+period.game_name+"(Id:"+period.brand_game_id+"), Interval Time:"+period.interval_time+"(Id:"+period.interval_id+"), Result:" + lotto.result.join(","));
                                          
                                        sqlCnt++;
                                          
                                        if(lotto.winner.length>0) {
                                            var udtqry = "UPDATE t_transaction_mas SET status = 1, prize_value = CASE trans_id_pk", transIds = new Array; 
                                            for(var r=0; r<lotto.winner.length; r++) {
                                                lotto.winner[r].details.forEach( function(prize) {
                                                    udtqry += " WHEN "+prize.transId+" THEN "+prize.qty*period.prize_value;
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
                                            console.log("Updating container...")
                                            udtContainer(gmContainer);
                                            socket.end("Processed..., Please check the data in control panel"+"\0", 'utf8');  
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
                        //console.log(lrmquery.sql);

                        } else {
                            console.log("Error found with selecting transaction query."+ err);
                            handle_query_error(err);
                        }
                  
                    }); 


                    loopCnt++; 
                });
            } else {
                console.log("No rows found for the interval:" + date);
                socket.end("No rows found for the interval:" + date +"\0", 'utf8');  
			
            }	
        } else {
            console.log("Found error in selecting interval query");
            socket.end("Found error in selecting interval query"+"\0", 'utf8');  
            handle_query_error(intErr);
        }		
    });
    
};


udtContainer = function (containerList) {
    var udtqry = "UPDATE t_brand_game_map SET container = container + CASE brand_game_id", bgmIds = new Array; 
   
    for(ibgm in containerList) {
        udtqry += " WHEN "+ibgm+" THEN "+ Math.round(parseFloat(containerList[ibgm]) *100)/100 ;
        bgmIds.push(ibgm);
    }
    udtqry += " END WHERE brand_game_id IN("+bgmIds.join(",")+")"	
		   
    var cntqry = connection.query(udtqry, function(cnterr, cntResults) { 
        if(cnterr===null) {
            console.log("\t\tNo Errors found in updating the winner list");
            if(cntResults.affectedRows > 0) {
                console.log("\t\tNo. of affected rows with winner update:"+cntResults.affectedRows);
            } else {
                console.log("\t\tFailed to updating winner."+ cntqry.sql); 
            }
        } else {
            console.log("\t\tError found in updating winner."+ cnterr); 
            handle_query_error(cnterr);
        }
		
    });	
    console.log(cntqry.sql);
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
        return obj[key][id]== find ? key: null;
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