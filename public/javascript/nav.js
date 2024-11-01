// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './navEventHandlers.js';

// Element selections ----------------------------------------------------------------
const userSettingsButton = document.querySelector('.user-settings-button');
const userInstructionsButton = document.querySelector('.user-instructions-button');
const userLogoutButton = document.querySelector('.user-logout-button');
const goodbyeBackdrop = document.querySelector('.goodbye-backdrop');
const goodbyeContainer = document.querySelector('.goodbye-container');

// Event listeners ----------------------------------------------------------------
userLogoutButton.addEventListener('click', userLogoutButtonClickEventHandler);

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	userSettingsButton,
	userInstructionsButton,
	userLogoutButton,
	goodbyeBackdrop,
	goodbyeContainer
});
