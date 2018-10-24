'use strict';

const Settings = require('./settings');

const languageStrings = {
    "en": {
        "translation": {
            WELCOME: `Welcome to ${Settings.SKILL_NAME}!  This skill will help you make dining choices based on your address.  Just say 'spin the wheel' and a random dining selection will be chosen.`,
            WHAT_DO_YOU_WANT: 'What do you want to ask?',
            NOTIFY_MISSING_PERMISSIONS: 'Please enable Location permissions in the Amazon Alexa app.',
            NO_ADDRESS: 'It looks like you don\'t have an address set. You can set your address from the companion app.',
            RESULT_AVAILABLE: "Here's a restaurant that sounds good, ",
            ERROR: 'Uh Oh. Looks like something went wrong.',
            LOCATION_FAILURE: `There was an error with the ${Settings.SKILL_NAME}. Please try again.`,
            FALLBACK_MESSAGE: 'This skill doesn\'t support that. Please ask something else.',
            FALLBACK_REPROMPT: "You can say 'I'm hungry' or you can say 'cancel'.",
            GOODBYE: `Bye! Thanks for using ${Settings.SKILL_NAME}!`,
            UNHANDLED: 'This skill doesn\'t support that. Please ask something else.',
            HELP: "You can use this skill by asking something like 'what should I eat'? Or you can say 'cancel' to exit.",
            STOP: `Bye! Thanks for using ${Settings.SKILL_NAME}!`,
        }
    }
};

module.exports = languageStrings;