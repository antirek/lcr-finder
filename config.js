module.exports = {
    agi: {
        port: 3000
    },
    web: {
        port: 3007
    },
    asterisk: {
    	port: 3434
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