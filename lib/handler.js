'use strict';

var path = require('path'),
    Q = require('q'),
    ContextWrapper = require('./contextWrapper');

var Handler = function (finder, config) {

    var counter = 1;
    var logger;
    

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

        var contextWrapper = new ContextWrapper(context);

        var extractAgiResultVarName = function (agiVariables) {
            console.log(config, agiVariables);
            number = agiVariables[config.asterisk.agiParamName];
            console.log(number);
            log('number from dialplan', number);
        };

        var findCode = function () {
            console.log('findCode', number);
            return finder.findCodeForNumber(number);
        };


        contextWrapper.on('variables')
            .then(function (variables) {
                log('-- start processing');
                log('variables', JSON.stringify(variables));
                extractAgiResultVarName(variables);
            })
            .then(findCode)
            .then(function (result) {
                console.log(result);
            });

        contextWrapper.on('error')
            .then(function () {
                log('-- error');
                return stepFinish();
            });

        contextWrapper.on('close')
            .then(function () {
                log('-- close');
            });

        contextWrapper.on('hangup')
            .then(function () {
                log('-- hangup');
                return stepFinish();
            });
    };
};

module.exports = Handler;