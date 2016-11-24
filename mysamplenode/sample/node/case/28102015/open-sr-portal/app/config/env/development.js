'use strict';

module.exports = {
	db: {
		host: '10.40.2.81',
		options: {
			user: 'isteam',
			pass: 'Ictl0g!23',
			database: 'srportal' 
		},
		timeZone: {format:'-08:00', time: 'PST'},
	},
	cdmdb: {
		host: '10.2.1.43',
		options: {
			user: 'csscdm',
			pass: 'cssCdm12',
			database: 'csscdm' 
		},
		timeZone: {format:'-08:00', time: 'PST'},
	},
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			//stream: 'access.log'
		}
	},
	app: {
		title: 'Development Environment'
	}
};
