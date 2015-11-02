'use strict';

var MongoClient = require( 'mongodb' ).MongoClient;
var configDB = require('./config.js');
var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( configDB.db.uri, function( err, db ) {
      _db = db;
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};