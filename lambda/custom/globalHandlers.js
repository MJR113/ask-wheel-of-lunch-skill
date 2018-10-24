'use strict';

const Yelp = require('yelp-fusion');

const Settings = require('./settings');

const PERMISSIONS = ['read::alexa:device:all:address'];

const globalHandlers = {
    LaunchHandler: {
        canHandle(handlerInput) {
          return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
        },
        handle(handlerInput) {
          let { attributesManager } = handlerInput;
          let ctx = attributesManager.getRequestAttributes();
      
          const speechOutput = ctx.t('WELCOME');
          const reprompt = ctx.t('WHAT_DO_YOU_WANT');
          return handlerInput.responseBuilder.speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
        },
    },
    CancelHandler: {
        canHandle(handlerInput) {
          const { request } = handlerInput.requestEnvelope;
      
          return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
        },
        handle(handlerInput) {
          let { attributesManager, responseBuilder } = handlerInput;
          let ctx = attributesManager.getRequestAttributes();
      
          var speechOutput = ctx.t('GOODBYE');
          return responseBuilder
            .speak(speechOutput)
            .getResponse();
        },
    },
    FallbackHandler: {
        canHandle(handlerInput) {
            const { request } = handlerInput.requestEnvelope;
    
            return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
        },
        handle(handlerInput) {
            let { attributesManager, responseBuilder } = handlerInput;
            let ctx = attributesManager.getRequestAttributes();
            
            var speechOutput = ctx.t('FALLBACK_MESSAGE');
            var reprompt = ctx.t('FALLBACK_REPROMPT');
            return responseBuilder
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
        },
    },
    GetLunchHandler: {
        canHandle(handlerInput) {
            const { request } = handlerInput.requestEnvelope;
    
            return request.type === 'IntentRequest' && request.intent.name === 'GetLunchIntent';
        },
        async handle(handlerInput) {
            const { attributesManager, requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;
            let ctx = attributesManager.getRequestAttributes();
    
            const consentToken = requestEnvelope.context.System.user.permissions
                && requestEnvelope.context.System.user.permissions.consentToken;
            
            if (!consentToken) {
                var speechOutput = ctx.t('NOTIFY_MISSING_PERMISSIONS');
                return responseBuilder
                    .speak(speechOutput)
                    .withAskForPermissionsConsentCard(PERMISSIONS)
                    .getResponse();
            }
    
            try {
                const { deviceId } = requestEnvelope.context.System.device;
                const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
                const address = await deviceAddressServiceClient.getFullAddress(deviceId);
    
                console.log('DEBUG: Address successfully retrieved.');
    
                let response;
                if (address.addressLine1 === null && address.stateOrRegion === null) {
                    var speechOutput = ctx.t('NO_ADDRESS');
                    response = responseBuilder.speak(speechOutput).getResponse();
                } else {
                    const SEARCH_STRING = `${address.addressLine1}, ${address.stateOrRegion}, ${address.postalCode}`;
                    console.log('DEBUG: ' + SEARCH_STRING);
    
                    // Search 
                    const client = Yelp.client(Settings.yelpKey);
                    let randomResult;
                    await client.search({
                        term: Settings.DEFAULT_SEARCH_TERM,
                        location: SEARCH_STRING,
                        limit: Settings.RESULTS_LIMIT
                    }).then(response => {
                        console.log(`DEBUG: Returned ${response.jsonBody.businesses.length} results.`);
    
                        randomResult = response.jsonBody.businesses[Math.floor(Math.random() * response.jsonBody.businesses.length)]
    
                        console.log('DEBUG: Selected ' + randomResult.name);
                    }).catch(e => {
                        console.log(e);
                    });
            
                    var businessName = randomResult.name.replace(/&/g, 'and');
                    const RESULT_MESSAGE = `${ctx.t('RESULT_AVAILABLE') + businessName}. I've sent the restaurant details to your Alexa App. <say-as interpret-as="interjection">Bon appetit</say-as>!`;
                    const CARD = `${businessName}\n${randomResult.location.address1}\n${randomResult.location.city}, ${randomResult.location.state} ${randomResult.location.zip_code}\nPhone: ${randomResult.phone}`;
                    
                    response = responseBuilder.speak(RESULT_MESSAGE).withSimpleCard(Settings.SKILL_NAME, CARD).getResponse();
                }
    
                return response;
            } catch (error) {
                if (error.name !== 'ServiceError') {
                    var speechOutput = ctx.t('ERROR');
                    const response = responseBuilder.speak(speechOutput).getResponse();
                    return response;
                }
                throw error;
            }
        },
    },
    HelpHandler: {
        canHandle(handlerInput) {
          const { request } = handlerInput.requestEnvelope;
      
          return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
        },
        handle(handlerInput) {
          let { attributesManager, responseBuilder } = handlerInput;
          let ctx = attributesManager.getRequestAttributes();
      
          var speechOutput = ctx.t('HELP');
          return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
        },
    },
    SessionEndedHandler: {
        canHandle(handlerInput) {
          return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
        },
        handle(handlerInput) {
          console.log(`DEBUG: Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
      
          return handlerInput.responseBuilder.getResponse();
        },
    },
    StopHandler: {
        canHandle(handlerInput) {
          const { request } = handlerInput.requestEnvelope;
      
          return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
        },
        handle(handlerInput) {
          let { attributesManager, responseBuilder } = handlerInput;
          let ctx = attributesManager.getRequestAttributes();
      
          var speechOutput = ctx.t('STOP');
          return responseBuilder
            .speak(speechOutput)
            .getResponse();
        },
      },
};

module.exports = globalHandlers;