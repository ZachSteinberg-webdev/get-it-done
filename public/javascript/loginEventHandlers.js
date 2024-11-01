// Imports ----------------------------------------------------------------
import './login.js';
import {shrinkTextToFitWhenTyping} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './loginEventHandlers.js';

// Event handlers ----------------------------------------------------------------
function registrationButtonClickEventHandler(event){
	window.location.href = '/register';
};

globalizeVariables({
	registrationButtonClickEventHandler
});
