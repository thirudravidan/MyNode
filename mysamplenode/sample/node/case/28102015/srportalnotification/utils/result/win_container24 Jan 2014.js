//var config = require('../../config');
//var settings = config.settings()
//var permute = require(settings.npm.path+'permute'); 
exports.result = function(period, rows) {
    var lotto = new Object;
    lotto.result = new Array;
    lotto.tot_qty = new Array;
    lotto.min_amt = new Array;
    lotto.tsv = new Array;
    lotto.winner = new Array;
    lotto.container = period.container;
    lotto.prev_container = period.container;
    lotto.cur_container = null;
    // 20140111AV-C1SWP3-BEGIN 
    if(period.game_id == 1 || period.game_id == 2 || period.game_id == 3 || period.game_id == 4 || period.game_id == 5 || period.game_id == 6 || period.game_id == 7 || period.game_id == 9) { //For game 120C, 12C, 16C, 20C, 52C, 1D, 2D, 24C
        var msymObj = new Object;
        rsymArr = msymArr = period.symbols.split(",");
        msymArr.forEach(function(sym) {
            msymObj[sym] = new Object;
            msymObj[sym].amount = null;
            msymObj[sym].qty = null;
            msymObj[sym].details = new Array;
            msymObj[sym].users = new Array;
        });
        if(rows.length > 0) {  
            var symArr = new Array, resultUser = new Array, totQty = 0, tsv = null;
            for(var i in rows) {
                symArr = JSON.parse(rows[i].qty_detail);
                symArr.forEach(function(qtyd) {
                    msymObj[qtyd.symbols].amount += parseInt(qtyd.qty)*period.prize_value;
                    totQty += parseInt(qtyd.qty);
                    msymObj[qtyd.symbols].qty += parseInt(qtyd.qty)
                    msymObj[qtyd.symbols].details.push({
                        'terminal_id':rows[i].terminal_id,
                        'qty':qtyd.qty,
                        'prize_value':period.prize_value,
                        'transId':rows[i].trans_id_pk, 
                        "totPrize": Number(qtyd.qty) * Number(qtyd.prize)
                        });
                //msymObj[qtyd.symbols].users.push(rows[i].terminal_id);
                });
            }
            if(period.override!=1) {
                var min;
                lotto.min_amt[0] = min = findMinObject(msymObj);       
                lotto.tsv[0] = tsv = (parseFloat(period.payout_percent)/100) * (parseFloat(period.game_rate)*totQty);
                lotto.tot_qty[0] = totQty;	
                lotto.container += tsv;
					  
                if(parseFloat(min) <= parseFloat(tsv)) {
                    var nr = findNearestObject(msymObj, tsv);
                    var searchArr = searchObject(msymObj,"amount",nr);
                    lotto.container -= nr;
                    lotto.result[0] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];  
                } else {
                    var cls = findClosestObject(msymObj,lotto.container);
                    if(parseFloat(cls) <= parseFloat(lotto.container)) {
                        var searchArr = searchObject(msymObj,"amount",cls);
                        lotto.result[0] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                        lotto.container -=  cls;
                    } else {	
                        if( (((parseFloat(cls)-parseFloat(lotto.container))/parseFloat(cls))*100) <= (100-parseFloat(period.payout_percent)) ) {
                            var searchArr = searchObject(msymObj,"amount",cls);
                            lotto.result[0] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                            lotto.container -=  cls;
                        } else {
                            var searchNArr = searchObject(msymObj,"amount",null);
                            if(searchNArr.length >0) {
                                lotto.result[0] = searchNArr[Math.floor((Math.random()*searchNArr.length)+0)];
                            } else {
                                lotto.result[0] = rsymArr[Math.floor((Math.random()*rsymArr.length)+0)];
                            }
                        }
                    } 
                }
                lotto.cur_container += lotto.container;
            } else {
                lotto.result[0] = period.override_result;
            }
        } else { // no rows
            if(period.override!=1) 
                lotto.result[0] = msymArr[Math.floor((Math.random()*msymArr.length)+0)];
            else 
                lotto.result[0] = period.override_result;
        }
        if(msymObj[lotto.result[0]].details.length > 0)
            lotto.winner[0] = msymObj[lotto.result[0]];
    } else if(period.game_id == 8){ //For 4 Digit Game Caculation
        console.log("-----------------------------------")
        var config = JSON.parse(period.config);
        var mFObj = new Object,totQty = new Object;
        rsymArr  = period.symbols.split(",");
        config["V"].forEach(function(m) {
            var oPrefix = config["F"]+m;  
            mFObj[oPrefix] = new Object;
            totQty[oPrefix] = null;
            config["H"].forEach(function(h) {
                config["V"].forEach(function(v) {
                    //console.log(config["F"]+m+h+v)

                    var iPrefix = config["F"]+m+h+v;
                    mFObj[oPrefix][iPrefix] = new Object;
                    mFObj[oPrefix][iPrefix].amount = null;
                    mFObj[oPrefix][iPrefix].qty = null;
                    mFObj[oPrefix][iPrefix].details = new Array;
                    mFObj[oPrefix][iPrefix].users = new Array;
                });
            });
        });
        if(rows.length > 0) {         
            var symArr = new Array;
            for(var i in rows) {
                symArr = JSON.parse(rows[i].qty_detail);
                symArr.forEach(function(qtyd) {
                    var oPrefix = qtyd.symbols.substr(0,2);

                    mFObj[oPrefix][qtyd.symbols].amount += parseInt(qtyd.qty)*period.prize_value;
                    mFObj[oPrefix][qtyd.symbols].qty += parseInt(qtyd.qty)
                    totQty[oPrefix] += parseInt(qtyd.qty);
                    mFObj[oPrefix][qtyd.symbols].details.push({
                        'terminal_id':rows[i].terminal_id,
                        'qty':qtyd.qty,
                        'prize_value':period.prize_value,
                        'transId':rows[i].trans_id_pk,
                        "totPrize": Number(qtyd.qty) * Number(qtyd.prize)
                        });
                //mFObj[oPrefix][qtyd.symbols].users.push(rows[i].terminal_id);
                });
            }
            //console.log(mFObj);
            if(period.override==1)
                var orslt = period.override_result.split(",");
            config["V"].forEach(function(v) {
                if(period.override!=1) {
                    var oPrefix = config["F"]+""+v, tsv = null, min;  
                    lotto.min_amt[v] = min = findMinObject(mFObj[oPrefix]);       
                    lotto.tsv[v] = tsv = (parseFloat(period.payout_percent)/100) * (parseFloat(period.game_rate)*totQty[oPrefix]);
                    lotto.tot_qty[v] = totQty[oPrefix];
                    lotto.container += tsv;

                    if(parseFloat(min) <= parseFloat(tsv)) {
                        var nr = findNearestObject(mFObj[oPrefix], tsv);
                        var searchArr = searchObject(mFObj[oPrefix],"amount",nr);
                        lotto.container -= nr;
                        lotto.result[v] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];  
                    } else {
                        var cls = findClosestObject(mFObj[oPrefix],lotto.container);
                        if(parseFloat(cls) <= parseFloat(lotto.container)) {
                            var searchArr = searchObject(mFObj[oPrefix],"amount",cls);
                            lotto.result[v] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                            lotto.container -=  cls;
                        } else {	
                            if( (((parseFloat(cls)-parseFloat(lotto.container))/parseFloat(cls))*100) <= (100-parseFloat(period.payout_percent)) ) {
                                var searchArr = searchObject(mFObj[oPrefix],"amount",cls);
                                lotto.result[v] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                                lotto.container -=  cls;
                            } else {
                                var searchNArr = searchObject(mFObj[oPrefix],"amount",null);
                                if(searchNArr.length >0) {
                                    lotto.result[v] = searchNArr[Math.floor((Math.random()*searchNArr.length)+0)];
                                } else {
                                    lotto.result[v] = rsymArr[Math.floor((Math.random()*rsymArr.length)+0)];
                                }
                            }
                        } 
                    }
                    lotto.cur_container += lotto.container;
                } else {
                    lotto.result[v] = orslt[v];
                }    

            });
            //console.log(lotto.result);
            console.log("-----------------------------------")
        } else { //no rows
            if(period.override==1) 
                var orslt = period.override_result.split(",");
            config["V"].forEach(function(v) {
                if(period.override!=1) {
                    var oPrefix = config["F"]+""+v; 
                    var rand= ('0' + Math.floor(Math.random()*100)).slice(-2)
                    lotto.result[v] = oPrefix+rand;
                } else {
                    lotto.result[v] = orslt[v];
                }
            });
        }
		 
        config["V"].forEach(function(v) {
            var oPrefix = config["F"]+""+v; 
            if(mFObj[oPrefix][lotto.result[v]].details.length > 0)
                lotto.winner.push(mFObj[oPrefix][lotto.result[v]]);
        });
    } else if(period.game_id == 10){ //For 4 Digit Series Game Caculation
        console.log("-----------------------------------")
        var config = JSON.parse(period.config);
        var mFObj = new Object,totQty = new Object, smrpArr = new Array;
        rsymArr  = period.symbols.split(",");
        console.log(period.series_rate);
        smrpArr = period.series_rate.split(",");
        config["V"].forEach(function(m) {
            var oPrefix = config["F"]+m;  
            mFObj[oPrefix] = new Object;
            totQty[oPrefix] = null;
            totQty[oPrefix] = new Object;
            smrpArr.forEach(function(sr) {
                totQty[oPrefix][sr] = null;
            });
			  
            config["H"].forEach(function(h) {
                config["V"].forEach(function(v) {
                    //console.log(config["F"]+m+h+v)

                    var iPrefix = config["F"]+m+h+v;
                    mFObj[oPrefix][iPrefix] = new Object;
                    mFObj[oPrefix][iPrefix].amount = null;
                    mFObj[oPrefix][iPrefix].qty = null;
                    mFObj[oPrefix][iPrefix].details = new Array;
                    mFObj[oPrefix][iPrefix].users = new Array;
                });
            });
        });
        //console.log(mFObj);
        if(rows.length > 0) {         
            var symArr = new Array;
            for(var i in rows) {
                symArr = JSON.parse(rows[i].qty_detail);
                symArr.forEach(function(qtyd) {
                    var oPrefix = qtyd.symbols.substr(0,2);
                    mFObj[oPrefix][qtyd.symbols].amount += parseInt(qtyd.qty)*qtyd.prize;
                    mFObj[oPrefix][qtyd.symbols].qty += parseInt(qtyd.qty)
                    totQty[oPrefix][qtyd.rate] += parseInt(qtyd.qty);
                    mFObj[oPrefix][qtyd.symbols].details.push({
                        'terminal_id':rows[i].terminal_id,
                        'qty':qtyd.qty,
                        'prize_value': qtyd.prize,
                        'transId':rows[i].trans_id_pk,
                        "totPrize": Number(qtyd.qty) * Number(qtyd.prize)
                        });
                });
            }
				  
            if(period.override==1)
                var orslt = period.override_result.split(",");
            config["V"].forEach(function(v) {
                if(period.override!=1) {
                    var oPrefix = config["F"]+""+v, tsv = null, min, stsv = null, stot=null;  
                    lotto.min_amt[v] = min = findMinObject(mFObj[oPrefix]);
						   
						  
                    for(var rt in totQty[oPrefix]) {
                        stsv += parseFloat(rt)*totQty[oPrefix][rt];
                        stot += totQty[oPrefix][rt];
                    }
                    console.log(stsv);
                    lotto.tsv[v] = tsv = (parseFloat(period.payout_percent)/100) * stsv;
                    lotto.tot_qty[v] = stot;
                    lotto.container += tsv;

                    if(parseFloat(min) <= parseFloat(tsv)) {
                        var nr = findNearestObject(mFObj[oPrefix], tsv);
                        var searchArr = searchObject(mFObj[oPrefix],"amount",nr);
                        lotto.container -= nr;
                        lotto.result[v] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];  
                    } else {
                        var cls = findClosestObject(mFObj[oPrefix],lotto.container);
                        if(parseFloat(cls) <= parseFloat(lotto.container)) {
                            var searchArr = searchObject(mFObj[oPrefix],"amount",cls);
                            lotto.result[v] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                            lotto.container -=  cls;
                        } else {	
                            if( (((parseFloat(cls)-parseFloat(lotto.container))/parseFloat(cls))*100) <= (100-parseFloat(period.payout_percent)) ) {
                                var searchArr = searchObject(mFObj[oPrefix],"amount",cls);
                                lotto.result[v] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                                lotto.container -=  cls;
                            } else {
                                var searchNArr = searchObject(mFObj[oPrefix],"amount",null);
                                if(searchNArr.length >0) {
                                    lotto.result[v] = searchNArr[Math.floor((Math.random()*searchNArr.length)+0)];
                                } else {
                                    lotto.result[v] = rsymArr[Math.floor((Math.random()*rsymArr.length)+0)];
                                }
                            }
                        } 
                    }
                    lotto.cur_container += lotto.container;
                } else {
                    lotto.result[v] = orslt[v];
                }    

            });
            //console.log(lotto.result);
            console.log("-----------------------------------")
        } else { //no rows
            if(period.override==1) 
                var orslt = period.override_result.split(",");
            config["V"].forEach(function(v) {
                if(period.override!=1) {
                    var oPrefix = config["F"]+""+v; 
                    var rand= ('0' + Math.floor(Math.random()*100)).slice(-2)
                    lotto.result[v] = oPrefix+rand;
                } else {
                    lotto.result[v] = orslt[v];
                }
            });
        }
        /*20140121GB-C3GT4S-BEGIN Calcualting total prize amount*/
	var prize_update = new Object(), details_obj;	 
        config["V"].forEach(function(v) {
            var oPrefix = config["F"]+""+v; 
            if(mFObj[oPrefix][lotto.result[v]].details.length > 0) {
                for(var d1s_res =0; d1s_res < mFObj[oPrefix][lotto.result[v]].details.length; d1s_res++ ) {
                    details_obj = mFObj[oPrefix][lotto.result[v]].details[d1s_res];
                    if(prize_update.hasOwnProperty(details_obj.transId)) {
                        prize_update[details_obj.transId].details[0].totPrize += Number(details_obj.totPrize);
                        prize_update[details_obj.transId].details[0].prize_value += Number(details_obj.prize_value);
                        prize_update[details_obj.transId].details[0].qty += Number(details_obj.qty);
                    } else {
                        prize_update[details_obj.transId] = new Object();
                        prize_update[details_obj.transId].details = new Array();
                        prize_update[details_obj.transId].details.push({
                            "prize_value":Number(details_obj.prize_value),
                            "qty":Number(details_obj.qty),
                            "terminal_id":details_obj.terminal_id, 
                            "transId":details_obj.transId, 
                            "totPrize": details_obj.totPrize
                            });
                    }
                }
            }
        });
        for (var d4s_obj in prize_update) {
            lotto.winner.push(prize_update[d4s_obj]);
        }
        /*20140121GB-C3GT4S-END*/
    } else if(period.game_id == 11) { //For game 1D Series
        var msymObj = new Object, totQty = new Object;
        rsymArr = msymArr = period.symbols.split(",");
        snmArr = period.series_name.split(",");
        srtArr = period.series_rate.split(",");
        snmArr.forEach(function(sn) { 
            msymObj[sn] = new Object;
            totQty[sn] = null;
            msymArr.forEach(function(sym) {
                msymObj[sn][sym] = new Object;
                msymObj[sn][sym].amount = null;
                msymObj[sn][sym].qty = null;
                msymObj[sn][sym].details = new Array;
                msymObj[sn][sym].users = new Array;
            });
        });
        if(rows.length > 0) {  
            var symArr = new Array, resultUser = new Array,  tsv = null, scnt=0;
            for(var i in rows) {
                symArr = JSON.parse(rows[i].qty_detail);
                symArr.forEach(function(qtyd) {
                    msymObj[qtyd.type][qtyd.symbols].amount += parseInt(qtyd.qty)*qtyd.prize;
                    totQty[qtyd.type] += parseInt(qtyd.qty);
                    msymObj[qtyd.type][qtyd.symbols].qty += parseInt(qtyd.qty)
                    msymObj[qtyd.type][qtyd.symbols].details.push({
                        'terminal_id':rows[i].terminal_id,
                        'qty':qtyd.qty,
                        'prize_value': qtyd.prize,
                        'transId':rows[i].trans_id_pk, 
                        "totPrize": Number(qtyd.qty) * Number(qtyd.prize)
                    });
                //msymObj[qtyd.symbols].users.push(rows[i].terminal_id);
                });
            }
				  
            //console.log(msymObj);
            //console.log(totQty);
            snmArr.forEach(function(sn) { 
                if(period.override!=1) {
					
                    var min;
                    lotto.min_amt[scnt] = min = findMinObject(msymObj[sn]);       
                    lotto.tsv[scnt] = tsv = (parseFloat(period.payout_percent)/100) * (parseFloat(srtArr[scnt])*totQty[sn]);
                    lotto.tot_qty[scnt] = totQty[sn];	
                    lotto.container += tsv;
					  
                    if(parseFloat(min) <= parseFloat(tsv)) {
                        var nr = findNearestObject(msymObj[sn], tsv);
                        var searchArr = searchObject(msymObj[sn],"amount",nr);
                        lotto.container -= nr;
                        lotto.result[scnt] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];  
                    } else {
                        var cls = findClosestObject(msymObj[sn],lotto.container);
                        if(parseFloat(cls) <= parseFloat(lotto.container)) {
                            var searchArr = searchObject(msymObj[sn],"amount",cls);
                            lotto.result[scnt] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                            lotto.container -=  cls;
                        } else {	
                            if( (((parseFloat(cls)-parseFloat(lotto.container))/parseFloat(cls))*100) <= (100-parseFloat(period.payout_percent)) ) {
                                var searchArr = searchObject(msymObj[sn],"amount",cls);
                                lotto.result[scnt] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                                lotto.container -=  cls;
                            } else {
                                var searchNArr = searchObject(msymObj[sn],"amount",null);
                                if(searchNArr.length >0) {
                                    lotto.result[scnt] = searchNArr[Math.floor((Math.random()*searchNArr.length)+0)];
                                } else {
                                    lotto.result[scnt] = rsymArr[Math.floor((Math.random()*rsymArr.length)+0)];
                                }
                            }
                        } 
                    }
                    lotto.cur_container += lotto.container;
					
                } else {
                    lotto.result[scnt] = period.override_result;
                }
                scnt++;
            });	  
        } else { // no rows
            if(period.override==1) 
                var orslt = period.override_result.split(",");
            scnt=0;	
            snmArr.forEach(function(sn) { 
                if(period.override!=1) 
                    lotto.result[scnt] = msymArr[Math.floor((Math.random()*msymArr.length)+0)];
                else 
                    lotto.result[scnt] = orslt[scnt];
                scnt++;	 
            });	 
        }
                  
        scnt=0;
        /*20140121GB-C3GT1S-BEGIN Calcualting total prize amount*/
        var prize_update = new Object(), details_obj;
        snmArr.forEach(function(sn) { 
            if(msymObj[sn][lotto.result[scnt]].details.length > 0) {
                for(var d1s_res =0; d1s_res < msymObj[sn][lotto.result[scnt]].details.length; d1s_res++ ) {
                    details_obj = msymObj[sn][lotto.result[scnt]].details[d1s_res];
                    if(prize_update.hasOwnProperty(details_obj.transId)) {
                        prize_update[details_obj.transId].details[0].totPrize += Number(details_obj.totPrize);
                        prize_update[details_obj.transId].details[0].prize_value += Number(details_obj.prize_value);
                        prize_update[details_obj.transId].details[0].qty += Number(details_obj.qty);
                    } else {
                        prize_update[details_obj.transId] = new Object();
                        prize_update[details_obj.transId].details = new Array();
                        prize_update[details_obj.transId].details.push({
                            "prize_value":Number(details_obj.prize_value),
                            "qty":Number(details_obj.qty),
                            "terminal_id":details_obj.terminal_id, 
                            "transId":details_obj.transId, 
                            "totPrize": details_obj.totPrize
                            });
                    }
                }
            }
				
        });
        for (var d1s_obj in prize_update) {
            lotto.winner[scnt] = (prize_update[d1s_obj]);
            scnt++;	
        }
        /*20140121GB-C3GT1S-END*/                
                        
    } /*else if(period.game_id == 12) { //For game Pick 3
		var msymObj = new Object;
		msymArr = period.symbols.split(",");
		msymArr.forEach(function(sym) {
			msymObj[sym] = new Object;
			msymObj[sym].amount = null;
			msymObj[sym].qty = null;
			msymObj[sym].details = new Array;
			msymObj[sym].users = new Array;
		});
		
		if(rows.length > 0) {  
				  var symArr = new Array, resultUser = new Array,  tsv = null, totQty=null, peer = new Array(0,1,2,3,4,5,6,7,8,9);
				  for(var i in rows) {
						symArr = JSON.parse(rows[i].qty_detail);
						symArr.forEach(function(qtyd) {
							console.log(qtyd.symbols);
							console.log(qtyd.type);
							switch(qtyd.type) {
								case "ST":
									msymObj[qtyd.symbols].amount += parseInt(qtyd.qty)*qtyd.prize;
									msymObj[qtyd.symbols].details.push({'terminal_id':rows[i].terminal_id,'qty':qtyd.qty, 'transId':rows[i].trans_id_pk});
								break;
								case "AT":
								case "BX":
									msymObj[qtyd.symbols].amount += parseInt(qtyd.qty)*qtyd.prize;
									msymObj[qtyd.symbols].details.push({'terminal_id':rows[i].terminal_id,'qty':qtyd.qty, 'transId':rows[i].trans_id_pk});
									var seq = qtyd.symbols.split("");
									seq.sort();
									while (permute(seq)) {
										console.log(seq);
										msymObj[qtyd.symbols].amount += parseInt(qtyd.qty)*qtyd.prize;		
										msymObj[qtyd.symbols].details.push({'terminal_id':rows[i].terminal_id,'qty':qtyd.qty, 'transId':rows[i].trans_id_pk});
									}
								break;
								case "FP":
									peer.forEach(function(p) {
										msymObj[qtyd.symbols+p].amount += parseInt(qtyd.qty)*qtyd.prize;
										msymObj[qtyd.symbols+p].details.push({'terminal_id':rows[i].terminal_id,'qty':qtyd.qty, 'transId':rows[i].trans_id_pk});
									});
								break;
								case "BP":
									peer.forEach(function(p) {
										msymObj[p+qtyd.symbols].amount += parseInt(qtyd.qty)*qtyd.prize;
										msymObj[p+qtyd.symbols].details.push({'terminal_id':rows[i].terminal_id,'qty':qtyd.qty, 'transId':rows[i].trans_id_pk});
									});
								break;
								case "RG":
									
								break;
							}
							
							totQty += parseInt(qtyd.qty);
							
							//msymObj[qtyd.symbols].qty += parseInt(qtyd.qty);
							
						});
				  }
				  if(period.override!=1) {
					  var min;
					  lotto.min_amt[0] = min = findMinObject(msymObj);       
					  lotto.tsv[0] = tsv = (parseFloat(period.payout_percent)/100) * (parseFloat(period.game_rate)*totQty);
					  lotto.tot_qty[0] = totQty;	
					  lotto.container += tsv;
					  
					  if(parseFloat(min) <= parseFloat(tsv)) {
							var nr = findNearestObject(msymObj, tsv);
							var searchArr = searchObject(msymObj,"amount",nr);
							lotto.container -= nr;
							lotto.result[0] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];  
					  } else {
							var cls = findClosestObject(msymObj,lotto.container);
							if(parseFloat(cls) <= parseFloat(lotto.container)) {
								var searchArr = searchObject(msymObj,"amount",cls);
								lotto.result[0] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
								lotto.container -=  cls;
							} else {	
								if( (((parseFloat(cls)-parseFloat(lotto.container))/parseFloat(cls))*100) <= (100-parseFloat(period.payout_percent)) ) {
									var searchArr = searchObject(msymObj,"amount",cls);
									lotto.result[0] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
									lotto.container -=  cls;
								} else {
									var searchNArr = searchObject(msymObj,"amount",null);
									if(searchNArr.length >0) {
										lotto.result[0] = searchNArr[Math.floor((Math.random()*searchNArr.length)+0)];
									} else {
										lotto.result[0] = rsymArr[Math.floor((Math.random()*rsymArr.length)+0)];
									}
								}
							} 
					  }
					  lotto.cur_container += lotto.container;
				  } else {
					  lotto.result[0] = period.override_result;
				  }
		} else { // no rows
			  if(period.override!=1) 
				 lotto.result[scnt] = msymArr[Math.floor((Math.random()*msymArr.length)+0)];
			  else 
				 lotto.result[scnt] = orslt[scnt];
			  
		}
	}*/
        
    return lotto;
//END
};
