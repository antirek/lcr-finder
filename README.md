# lcr-finder
Least cost route finder (for Asterisk)


## Requirements

1. Mongo
2. Asterisk


## Fast start

use lcr-finder-app for fast-start
https://github.com/antirek/lcr-finder-app


## Start

### install

> npm install lcr-finder [--save]


### prepare app.js

`````

var config = require('./config');
var Server = require('lcr-finder');

var server = new Server(config);
server.start();

`````


### use config.js

`````
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
        syslog: {
            host: 'localhost'
        },
        file: {
            filename: '/var/log/lcr-finder.log',
            json: false
        }
    }
};

`````


### start app

> node app.js 

or use pm2



### configure data

open http://localhost:3007 and add providers, directions and prices

![lcr-finder web-interface](https://raw.githubusercontent.com/antirek/lcr-web/master/images/lcr-web.png)



### configure asterisk

write extensions.conf like

`````
exten=_X.,1,AGI(agi://localhost:3000)
exten=_X.,n,Dial(SIP/${LCR_RESULT}/${EXTEN})

`````

also you can view additional data

`````
exten=_X.,1,AGI(agi://localhost:3000)
exten=_X.,n,Verbose(${LCR_RESULT})
exten=_X.,n,Verbose(${LCR_STATUS})
exten=_X.,n,Verbose(${LCR_SEQUENCE})
exten=_X.,n,Dial(SIP/${LCR_RESULT}/${EXTEN})

`````



## Bugs? Questions? Any more?

email: serge.dmitriev@gmail.com
