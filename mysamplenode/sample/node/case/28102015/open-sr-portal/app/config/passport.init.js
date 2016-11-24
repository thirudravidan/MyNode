'use strict';

var util=require('util');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var fsDomain = require('../config/domainUtil.js');
var db;
var die = function(msg){
    process.exit(1);
} ;

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //console.log('serializing user: ');console.log(user);
        done(null, user.user_id_pk);
    });

    passport.deserializeUser(function(id, done) {

        db.query('SELECT *,UPM.project_id_fk FROM t_user_mas AS UM LEFT JOIN  t_user_project_map AS UPM ON UPM.user_id_fk =UM.user_id_pk WHERE UM.user_id_pk =? LIMIT 1', [id] , function(err, user) {
            if(util.isArray(user) && user.length > 0) {
                done(err, user[0]);
            } else {
                done(err, user);
            }
        });
        
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not
            mysqldb.connectToServer( function( err ) {
                db = mysqldb.getDb();
                db.query('SELECT * FROM t_user_mas WHERE email = ? AND password = ?', [username, password] , function(err, user) {
                    if (err)
                        return done(err);

                    if(util.isArray(user) && user.length > 0) {
                        if(user[0].status!==1){
                            return done(null, false, req.flash('message', 'Not a active user')); // redirect back to login page
                        }
                    } else {
                        return done(null, false, req.flash('message', 'Invalid Username or Password')); // redirect back to login page
                    } 
                    /*if(sessionStore.hasOwnProperty(user._id)) {
                        console.log('User Already Logged In');
                        return done(null, false, req.flash('message', 'User Already Logged In')); // redirect back to login page
                    }*/
                    /*if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        //die(password);
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }*/

                    return done(null, user[0]);
                });
            });
        })
    );


    var isValidPassword = function(user, password){
        if(password == user.password) {
            return true;
        }
        //return bCrypt.compareSync(password, user.password);
    };

};