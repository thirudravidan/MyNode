'use strict';

var MongoClient = require( 'mongodb' ).MongoClient
, configDB = require('./config/config.js')
, option = {}, _db;
option = {  
    db:{
        numberOfRetries : 5,
        native_parser: false
    },
    server: {
        auto_reconnect: true,
        poolSize : 40,
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    replSet: {},
    mongos: {}
};

module.exports = {
    connectToServer: function( domain, callback ) {
        if(MongoClients.hasOwnProperty('rokuapi')) {
            console.log('##### db already connected #######');
            _db = MongoClients['rokuapi'];
            callback();
        } else {
            MongoClient.connect( configDB.db.uri, option, function( err, db ) {
                console.log('***********db newly connected*******');
                MongoClients['rokuapi'] = db;  
                _db = db;
                callback( err );
            });
        }
    },
    getDb: function() {
        return _db;
    },

    closeDb: function() {
        MongoClients=[];
  	     _db.close();
    }
};