// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './userSettingsEventHandlers.js';

// Element selections ----------------------------------------------------------------
// User settings modal
const userSettingsButton = document.querySelector('.user-settings-button');
const userLogoutButton = document.querySelector('.user-logout-target');
const userEditModal = document.querySelector('.user-edit-modal-backdrop');
const userEditFormHeaderAndForm = document.querySelector('.user-edit-header-and-form-container');
const userEditFormHeader = document.querySelector('.user-edit-form-header');
const userEditForm = document.querySelector('.user-edit-form');
const firstUserEditFormInput = document.querySelector('.user-edit-user-name-input');
const secondToLastUserEditFormInput = document.querySelector('.user-edit-submit-button-input');
const lastUserEditFormInput = document.querySelector('.user-edit-cancel-button-input');
const userEditFormNameInput = document.querySelector('.user-edit-user-name-input');
const userEditSubmitButton = document.querySelector('.user-edit-submit-button-input');
const userEditCancelButton = document.querySelector('.user-edit-cancel-button-input');

// Event listeners ----------------------------------------------------------------
	// User settings modal trigger
userSettingsButton.addEventListener('click', userSettingsButtonClickEventHandler);

	// User settings modal submit button
userEditSubmitButton.addEventListener('click', userEditSubmitButtonClickEventHandler);

	// User settings modal cancel button
userEditCancelButton.addEventListener('click', userEditCancelButtonClickEventHandler);

document.addEventListener('keydown', handleEscapeKey);

	// User edit modal focus trapping
firstUserEditFormInput.addEventListener('keydown', firstUserEditFormInputKeyDownEventHandler);

lastUserEditFormInput.addEventListener('keydown', lastUserEditFormInputKeyDownEventHandler);

	// User edit modal shake when user clicks outside of modal
userEditModal.addEventListener('click', userEditModalClickEventHandler);

globalizeVariables({
	userSettingsButton,
	userLogoutButton,
	userEditModal,
	userEditFormHeaderAndForm,
	userEditFormHeader,
	userEditForm,
	firstUserEditFormInput,
	secondToLastUserEditFormInput,
	lastUserEditFormInput,
	userEditFormNameInput,
	userEditSubmitButton,
	userEditCancelButton
});
