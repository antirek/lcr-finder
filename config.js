module.exports = {
    agi: {
        port: 3000
    },
    web: {
        port: 3007
    },
    asterisk: {
    	dialplanVarLCRStatus: 'LCR_STATUS',
    	dialplanVarLCRResult: 'LCR_RESULT',
    	agiParamName: 'agi_arg_1'
    },
    mongo: {
    	collection: 'providers',
    	connectionString: 'mongodb://localhost/lcr'
    },
    logger: {
        console: {
            colorize: true
        },
        syslog: {
            host: 'localhost'
        },
        file: {
            filename: '/var/log/lcr-finder.log',
            json: false
        }
    }
};