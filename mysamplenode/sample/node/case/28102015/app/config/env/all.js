'use strict';

module.exports = {
	app: {
		title: 'Case Tracker',
		description: 'Case Tracker',
		keywords: 'Case Tracker'
	},
	port: process.env.PORT || 8091,
	ip: '',
	templateEngine: 'ejs',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'alarm',
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
			css: [
				'app/public/lib/css/bootstrap.css',
				'app/public/lib/css/bootstrap-reset.css',
				'app/public/lib/css/bootstrap-dialog.min.css',
				'app/public/lib/css/bootstrap-datetimepicker.css',
				/*'app/public/lib/css/bootstrap-datepicker3.css',
				'app/public/lib/css/bootstrap-timepicker.min.css',*/
				'app/public/lib/css/font-awesome.min.css',
				'app/public/lib/css/ionicons.min.css',
				'app/public/lib/css/owl.carousel.css',
				'app/public/lib/css/slidebars.css',
				'app/public/lib/css/style-responsive.css',
				'app/public/lib/css/ng-table.css',
				'app/public/lib/css/fullcalendar.css',
				'app/public/lib/css/angular-form-builder.css',
				'app/public/lib/css/pushy.css',
			],
			js: [
				/*<!-- jQuery Version 1.11.1 -->*/
				'app/public/lib/js/jQuery/jquery.js',
				'app/public/lib/js/jQuery/jquery-ui.min.js',
				'app/public/lib/js/jQuery/jquery.accordion.js',
				'app/public/lib/js/jQuery/jquery.knob.js',
				'app/public/lib/js/jQuery/shortcut.js',
				'app/public/lib/js/jQuery/moment.js',
				'app/public/lib/js/jQuery/fullcalendar.js',
				'app/public/lib/js/jQuery/pushy.min.js',
				'app/public/lib/js/alsql/alasql.js',

				/*<!-- Bootstrap Core JavaScript -->*/
				'app/public/lib/js/bootstrap/bootstrap.min.js',
				/*'app/public/lib/js/bootstrap/bootstrap-datepicker.min.js',
				'app/public/lib/js/bootstrap/bootstrap-timepicker.min.js',*/
				'app/public/lib/js/bootstrap/bootstrap-datetimepicker.js',
				'app/public/lib/js/bootstrap/bootstrapValidator.js',
				'app/public/lib/js/bootstrap/bootstrap-dialog.min.js',

				/*<!-- AngularJs Version 1.3.14 -->*/
				'app/public/lib/js/angularjs/angular.js',
				'app/public/lib/js/angularjs/angular-route.js',
				'app/public/lib/js/angularjs/angular-animate.min.js',
				'app/public/lib/js/angularjs/angular-calendar.js',
				'app/public/lib/js/angularjs/angular-dragdrop.min.js',
				'app/public/lib/js/angularjs/angular-sanitize.min.js',
				'app/public/lib/js/angularjs/angular-translate.js',
				'app/public/lib/js/plugin/angular-form-builder.js',
				'app/public/lib/js/plugin/angular-form-builder-components.js',
				'app/public/lib/js/plugin/angular-validator.min.js',
				'app/public/lib/js/plugin/angular-validator-rules.min.js',

				/*<!-- Local Libs -->*/
				'app/public/lib/js/ng-table.js',
				'app/public/lib/js/daterangepicker.js',

				/*<!-- Main Libs -->*/
				'app/public/lib/js/jQuery/owl.carousel.js',
				'app/public/lib/js/jQuery/jquery.customSelect.min.js',
				'app/public/lib/js/jQuery/respond.js',
				'app/public/lib/js/jQuery/slidebars.min.js',
				//'app/public/lib/js/jQuery/common-scripts.js',
				// 'app/public/lib/js/jQuery/amcharts.js',
				// 'app/public/lib/js/jQuery/serial.js',
			]
		},
		css: [
			'app/public/css/style.css',
			'app/public/css/dashboard.css',
		],
		js: [
			'app/public/js/dialogCommon.js',
			'app/public/js/clock.js',
			'app/public/app/header.js',
			'app/public/app/app.js',
			'app/public/app/route.js',
			'app/public/app/services.js',
			'app/public/app/controller/**/*.js',
		],
		jsmodules: [
			'app/views/**/*.js'
		],
		cssmodules: [
			'app/views/**/*.css'
		],
		// tests: [
		// 	'app/lib/angular-mocks/angular-mocks.js',
		// 	'app/modules/*/tests/*.js'
		// ]
	}
};