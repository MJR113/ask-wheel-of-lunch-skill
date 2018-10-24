'use strict';

const errorHandlers = {
    GetLunchError : {
        canHandle(handlerInput, error) {
            return error.name === 'ServiceError';
        },
        handle(handlerInput, error) {
            let { attributesManager, responseBuilder } = handlerInput;
            let ctx = attributesManager.getRequestAttributes();

            if (error.statusCode === 403) {
                var speechOutput = ctx.t('NOTIFY_MISSING_PERMISSIONS');
                return responseBuilder
                    .speak(speechOutput)
                    .withAskForPermissionsConsentCard(PERMISSIONS)
                    .getResponse();
            }

            var speechOutput = ctx.t('LOCATION_FAILURE');
            return responseBuilder
                .speak(speechOutput)
                .reprompt(speechOutput)
                .getResponse();
        },
    }
};

module.exports = errorHandlers;