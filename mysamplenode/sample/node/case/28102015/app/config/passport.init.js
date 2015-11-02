'use strict';

var objectID = require('mongodb').ObjectID;
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var db = mongodb.getDb();

var die = function(msg){
    console.log(msg);
    process.exit(1);
} ;

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        db.collection('user').findOne({'_id' : objectID(id)}, function(err, user) {
            //console.log('deserializing user:',user);
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not
            db.collection('user').findOne({ $or: [{ 'empID': username }, { 'Email': username }]}, 
                function(err, user) {
                    if (err)
                        return done(err);

                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found'));                 
                    }

                    if(user.password !== password) {
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
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

                    return done(null, user);
                }
            );
        })
    );


    var isValidPassword = function(user, password){
        /*if(password == user.Credentials.Password) {
            return true;
        }*/
        return bCrypt.compareSync(password, user.password);
    };

};