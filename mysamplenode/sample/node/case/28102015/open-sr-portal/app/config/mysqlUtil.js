//var MongoClient = require( 'mongodb' ).MongoClient;
var mysql      = require('mysql');
var configDB = require('./config.js');
var _db,_cdmdb;
var connectionState=false;
var _this =module.exports;
var mysqlClient = mysql.createConnection({
  host     : configDB.db.host,
  user     : configDB.db.options.user,
  password : configDB.db.options.pass,
  database : configDB.db.options.database,
  multipleStatements: true
});

var mysqCDMlClient = mysql.createConnection({
  host     : configDB.cdmdb.host,
  user     : configDB.cdmdb.options.user,
  password : configDB.cdmdb.options.pass,
  database : configDB.cdmdb.options.database,
  multipleStatements: true
});

mysqlClient.on('unhandledError', function (err) {
  connectionState = false;
});
mysqlClient.on('enqueue', function (err) {
  connectionState = false;
});

mysqlClient.on('error', function (err) {
    if (!err.fatal) {
        //throw err;
    }
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connectionState = false;
    } 
    else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        connectionState = false;
    }
});

var attemptConnection = function (connection) {
        if(!connectionState){
            connection = mysql.createConnection(connection.config);
            connection.connect(function (err) {
                // connected! (unless `err` is set)
                if (err) {
                    //logger.error('mysql db unable to connect: ' + err);
                    connectionState = false;
                } else {
                    //logger.info('mysql connect!');
                    _db = connection;
                    connectionState = true;
                }
            });
             
            connection.on('close', function (err) {
                connectionState = false;
            });
            connection.on('unhandledError', function (err) {
                connectionState = false;
            });
            connection.on('enqueue', function (err) {
                connectionState = false;
            });

            connection.on('error', function (err) {
                //logger.error('mysqldb error: ' + err);
                if (!err.fatal) {
                    //throw err;
                }
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    connectionState = false;
                } 
                else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
                    connectionState = false;
                }
            });
          }else{
            console.log('Connection Alive');
          }
    };

module.exports = {

    connectToServer: function( callback ) {
        if(mysqlClient.threadId!=null) {
            callback();
        } else {
            mysqlClient.connect(function(err) {
                if (!err) {
                    connectionState = true;
                    _db = mysqlClient;
                    // console.log(_db);
                    setInterval(function(){
                        // console.log('SetIUnterval Called'); 
                        // console.log('connectionState ---- ',connectionState); 
                        if(!connectionState){
                            attemptConnection(mysqlClient);
                        }                     
                        
                    }, 300000);//for five minutes
                    callback(err);
                } else {
                    connectionState = false;
                    console.error('error connecting: ' + err.stack);
                    return;
                }
            });
        }
    },
    
    getDb: function() {
        return _db;
    },
    closeDb: function() {
        console.log('closing DB');
        // connectionState = false;
        _db.destroy();
    },
    connectToCDMServer: function( callback ) {
        if(mysqCDMlClient.threadId!=null) {
            callback();
        } else {
            mysqCDMlClient.connect(function(err) {
                if (!err) {
                    _cdmdb = mysqCDMlClient;
                    callback(err);
                } else {
                    console.error('error connecting: ' + err.stack);
                    return;
                }
            });
        }
    },
    getCDMDb: function() {
        return _cdmdb;
    },
    closeCDMDb: function() {
        _cdmdb.close();
    }
};

