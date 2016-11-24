'use strict';

var _ = require('lodash'),
    glob = require('glob');

module.exports = {
	app: {
		title: 'Case Tracker',
		description: 'Case Tracker',
		keywords: 'Case Tracker'
	},
	port: process.env.PORT || 8095,
	ip: '',	
	db:{
		uri: 'mongodb://10.9.15.149/rokuct_UAT',
		// uri: 'mongodb://10.9.17.150/rokuct_UAT',
		options: {
			user: '',
			pass: ''
		}
	},
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'rokuapi',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: { 
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: null,
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		options: {
			stream: 'access.log'
		}
	}	
};


/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
    // For context switching
    var _this = this;

    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            glob(globPatterns, {
                sync: true
            }, function(err, files) {
                if (removeRoot) {
                    files = files.map(function(file) {
                        return file.replace(removeRoot, '');
                    });
                }
                output = _.union(output, files);
            });
       }
    }

    return output;
};
