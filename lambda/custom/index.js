/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const Settings = require('./settings');
const ErrorHandlers = require('./errorHandlers');
const GlobalHandlers = require('./globalHandlers');
const GlobalInterceptors = require('./globalInterceptors');

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GlobalHandlers.LaunchHandler,
    GlobalHandlers.GetLunchHandler,
    GlobalHandlers.HelpHandler,
    GlobalHandlers.CancelHandler,
    GlobalHandlers.StopHandler,
    GlobalHandlers.FallbackHandler,
    GlobalHandlers.SessionEndedHandler
  )
  .addRequestInterceptors(GlobalInterceptors.LocalizationInterceptor)
  .addErrorHandlers(ErrorHandlers.GetLunchError)
  .withApiClient(new Alexa.DefaultApiClient())
  .withSkillId(Settings.skillId)
  .lambda();