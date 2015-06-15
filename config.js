module.exports = {
    agi: {
        port: 3000
    },
    web: {
        port: 3007
    },
    asterisk: {
    	dialplanVars: {
    		status: 'LCR_STATUS',
    		result: 'LCR_RESULT',
    		sequence: 'LCR_SEQUENCE'
    	},
    	agiParamName: 'agi_extension'
    },
    mongo: {
    	collection: 'providers',
    	connectionString: 'mongodb://localhost/lcr'
    },
    logger: {
        console: {
            colorize: true
        },
        file: {
            filename: '/var/log/lcr-finder.log',
            json: false
        }
    }
};