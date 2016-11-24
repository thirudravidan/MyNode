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
    if(period.game_id != 8 && period.game_id !=10) { //For all games except 4 Digit
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
                        'transId':rows[i].trans_id_pk
                        });
                //msymObj[qtyd.symbols].users.push(rows[i].terminal_id);
                });
            }
            if(period.override!=1) {
                var min;
                lotto.min_amt[0] = min = findMinObject(msymObj);       
                lotto.tsv[0] = tsv = (parseFloat(period.payout_percent)/100) * (parseFloat(period.game_rate)*totQty);
                lotto.tot_qty[0] = totQty;	
					 
                //console.log("Min:"+min+",TSV:"+tsv);
                if(parseFloat(min) < parseFloat(tsv)) {
                    var nr = findNearestObject(msymObj, tsv);
                    var searchArr = searchObject(msymObj,"amount",nr);
                    lotto.result[0] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];  
                } else {
                    lotto.container += tsv;
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
                            }
                        }
                    } 
                    lotto.cur_container += lotto.container;
                }
            } else {
                lotto.result[0] = period.override_result;
            }
        } else { // no rows
            if(period.override!=1) 
                lotto.result[0] = msymArr[Math.floor((Math.random()*msymArr.length)+0)];
            else 
                lotto.result[0] = period.override_result;
        }
        //console.log(msymObj);
        //console.log(lotto.result[0]);
        if(msymObj[lotto.result[0]].details.length > 0)
            lotto.winner[0] = msymObj[lotto.result[0]];
    } else { //For 4 Digit Game Caculation
        console.log("-----------------------------------")
        var config = JSON.parse(period.config);
        var mFObj = new Object,totQty = new Object;
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
                        'transId':rows[i].trans_id_pk
                        });
                //mFObj[oPrefix][qtyd.symbols].users.push(rows[i].terminal_id);
                });
            }
            //console.log(mFObj);
            var orslt = period.override_result.split(",");
            config["V"].forEach(function(v) {
                if(period.override!=1) {
                    var oPrefix = config["F"]+""+v, tsv = null, min;  
                    lotto.min_amt[v] = min = findMinObject(mFObj[oPrefix]);       
                    lotto.tsv[v] = tsv = (parseFloat(period.payout_percent)/100) * (parseFloat(period.game_rate)*totQty[oPrefix]);
                    lotto.tot_qty[v] = totQty[oPrefix];
						  
                    if(parseFloat(min) <= parseFloat(tsv)) {
                        var nr = findNearestObject(mFObj[oPrefix], tsv);
                        var searchArr = searchObject(mFObj[oPrefix],"amount",nr);
                        lotto.result[v] = searchArr[Math.floor((Math.random()*searchArr.length)+0)];
                    } else {
                        lotto.container += tsv;
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
                                }
                            }
                        } 
                        lotto.cur_container += lotto.container;	
                    }
						  
                } else {
                    lotto.result[v] = orslt[v];
                }    

            });
            //console.log(lotto.result);
            console.log("-----------------------------------")
        } else { //no rows
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
            if(mFObj[v][lotto.result[v]].details.length > 0)
                lotto.winner.push(mFObj[v][lotto.result[v]]);
        });
    } 
    return lotto;
};
