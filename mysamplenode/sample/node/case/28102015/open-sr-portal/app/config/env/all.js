'use strict';

module.exports = {
	app: {
		title: 'Analytics',
		description: 'Analytics',
		keywords: 'Analytics'
	},
	port: process.env.PORT || 8091,
	ip: '',
	templateEngine: 'ejs',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'servicereadiness',
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
	},
	assets: {
		lib: {
			css: [],
			js: []
		},
		css: [],
		js: [],
		// rulemodules: [
		// 	'app/public/rules/**/*.js'
		// ],
		// tests: [
		// 	'app/lib/angular-mocks/angular-mocks.js',
		// 	'app/modules/*/tests/*.js'
		// ]
	}
};
