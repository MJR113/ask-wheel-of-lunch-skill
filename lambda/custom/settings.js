'use strict';

module.exports = Object.freeze({
    SKILL_NAME: "Wheel of Lunch",

    // Skill App ID
    skillId: process.env.SKILL_ID || '',
    yelpKey: process.env.YELP_KEY || '',

    DEFAULT_SEARCH_TERM: process.env.DEFAULT_SEARCH_TERM || 'lunch',
    RESULTS_LIMIT: process.env.RESULTS_LIMIT || 20,

    DEBUG: true
});