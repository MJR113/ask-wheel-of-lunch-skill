'use strict';

const i18n = require('i18next');
const messages = require('./messages');
const sprintf = require('i18next-sprintf-postprocessor');

const globalInterceptors = {
    LocalizationInterceptor: {
        process(handlerInput) {
            const localizationClient = i18n.use(sprintf).init({
                lng: handlerInput.requestEnvelope.request.locale,
                overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
                resources: messages,
                returnObjects: true,
            });
    
            const attributes = handlerInput.attributesManager.getRequestAttributes();
            attributes.t = function(...args) {
                return localizationClient.t(...args);
            };
        },
    }
};

module.exports = globalInterceptors;