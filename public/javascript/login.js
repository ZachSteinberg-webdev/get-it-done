// Imports ----------------------------------------------------------------
import {shrinkTextToFitWhenTyping} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './global.js';
import './commonFunctions.js';
import './loginEventHandlers.js';

// Element selections ----------------------------------------------------------------
// Registration button
const registrationButton = document.querySelector('.go-to-registration-button-input');

// Event listeners ----------------------------------------------------------------
// Go to registration page trigger
registrationButton.addEventListener('click', registrationButtonClickEventHandler);

// Text input field font size increase descrease to prevent overflow-x ---------------------
shrinkTextToFitWhenTyping('.login-user-email-input');
shrinkTextToFitWhenTyping('.login-user-password-input');

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	registrationButton
});
