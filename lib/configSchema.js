'use strict';

var Joi = require('joi');

var ConfigSchema = Joi.object().keys({
    agi: Joi.object().keys({
        port: Joi.number().integer().min(1).max(65535).required()
    }).required(),
    web: Joi.object().keys({
        port: Joi.number().integer().min(1).max(65535).required()
    }).required(),
    asterisk: Joi.object().keys({
        port: Joi.number().integer().min(1).max(65535).required()
    }).required(),
    logger: Joi.object().keys({
        console: Joi.object().keys({
            colorize: Joi.boolean().default(true)
        }),
        syslog: Joi.object().keys({
            host: Joi.string().required()
        }),
        file: Joi.object().keys({
            filename: Joi.string().required(),
            json: Joi.boolean().default(false)
        }),
    })
});

module.exports = ConfigSchema;