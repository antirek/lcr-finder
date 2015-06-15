'use strict';

var path = require('path'),
    Q = require('q');

var Handler = function (finder, config) {

    var counter = 1;
    var logger;
    var dialplanVars = config.asterisk['dialplanVars'];

    var getCallId = function () {
        var length = 7;
        //magic from https://gist.github.com/aemkei/1180489#file-index-js
        var q = function (a, b) {
            return([1e15]+a).slice(-b)
        };
        return q(counter++, length);
    };

    this.setLogger = function (loggerIn) {
        logger = loggerIn;
    };

    this.handle = function (context) {
        
        var callId = getCallId();
        var number;

        function log(message, object) {
            if (logger) {                
                if (object) {
                    logger.info(callId, message, object);
                } else {
                    logger.info(callId, message);
                }
            }
        };

        if (logger) {
            finder.setLogFunction(log);
        }

        var contextWrapper = context;

        var extractAgiResultVarName = function (agiVariables) {
            number = agiVariables[config.asterisk.agiParamName];
            log('number from dialplan', number);
        };

        var stepSetFailedVars = function () {
            log('stepSetFailedVars');
            return contextWrapper.setVariable(dialplanVars['status'], 'FAILED');                
        };

        var stepFindCode = function () {            
            return finder.findCodeForNumber(number);
        };

        var stepResult = function (object) {
            log('stepSuccess', object);
            if (object.provider) {
                log('status success');
                return contextWrapper.setVariable(dialplanVars['status'], 'SUCCESS')
                    .then(function () {
                        return contextWrapper.setVariable(dialplanVars['result'], object.provider);
                    })
                    .then(function () {
                        return contextWrapper.setVariable(dialplanVars['sequence'], object.sequence);
                    });                    
            } else {
                log('status failed');
                return contextWrapper.setVariable(dialplanVars['status'], 'FAILED');
            }
        };

        var stepFinish = function () {
            log('stepFinish');
            return contextWrapper.end();
        };

        contextWrapper.onEvent('variables')
            .then(function (variables) {
                log('-- start processing');
                log('variables', JSON.stringify(variables));
                extractAgiResultVarName(variables);
            })
            .then(stepSetFailedVars)
            .then(stepFindCode)
            .then(stepResult)
            .then(stepFinish)
            .fail(function (error) {
                log('error', error)
                return stepFinish();
            });

        contextWrapper.onEvent('error')
            .then(function () {
                log('-- error');
                return stepFinish();
            });

        contextWrapper.onEvent('close')
            .then(function () {
                log('-- close');
            });

        contextWrapper.onEvent('hangup')
            .then(function () {
                log('-- hangup');
                return stepFinish();
            });
    };
};

module.exports = Handler;