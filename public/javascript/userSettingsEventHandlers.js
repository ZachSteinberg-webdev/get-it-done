// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './userSettings.js';

// Event handlers ----------------------------------------------------------------
	// User settings modal trigger
function userSettingsButtonClickEventHandler(event){
	stopPropagationAndPreventDefault(event);
	toggleInertAttribute(listEditModalContainer);
	toggleCssDisplayPropertyBetweenNoneAndBlock(userEditModal);
	setTimeout(()=>{
		userEditModal.classList.add('user-edit-modal-backdrop-in-use');
		userEditFormHeader.classList.add('user-edit-form-header-in-use');
		userEditForm.classList.add('user-edit-form-in-use');
		focusAndSelect(userEditFormNameInput);
	}, 250);
};

	// User settings modal submit button
function userEditSubmitButtonClickEventHandler(event){
	stopPropagationAndPreventDefault(event);
	toggleInertAttribute(listEditModalContainer);
	userEditForm.classList.remove('user-edit-form-in-use');
	userEditFormHeader.classList.remove('user-edit-form-header-in-use');
	userEditModal.classList.remove('user-edit-modal-backdrop-in-use');
	setTimeout(()=>{
		toggleCssDisplayPropertyBetweenNoneAndBlock(userEditModal);
		userEditForm.submit();
	},250);
};

	// User settings modal cancel button
function userEditCancelButtonClickEventHandler(event){
	stopPropagationAndPreventDefault(event);
	toggleInertAttribute(listEditModalContainer);
	userEditForm.classList.remove('user-edit-form-in-use');
	userEditFormHeader.classList.remove('user-edit-form-header-in-use');
	userEditModal.classList.remove('user-edit-modal-backdrop-in-use');
	setTimeout(()=>{
		toggleCssDisplayPropertyBetweenNoneAndBlock(userEditModal);
	},250);
};

function handleEscapeKey(event){
	if(getDisplayValue(userEditModal) == "block"){
		if(event.key==="Escape"){
			stopPropagationAndPreventDefault(event);
			toggleInertAttribute(listEditModalContainer);
			userEditForm.classList.remove('user-edit-form-in-use');
			userEditFormHeader.classList.remove('user-edit-form-header-in-use');
			userEditModal.classList.remove('user-edit-modal-backdrop-in-use');
			setTimeout(()=>{
				toggleCssDisplayPropertyBetweenNoneAndBlock(userEditModal);
			},250);
		};
	};
};

	// User edit modal focus trapping
function firstUserEditFormInputKeyDownEventHandler(event){
	if(document.activeElement == firstUserEditFormInput){
		if(event.key == "Tab" && event.shiftKey){
			stopPropagationAndPreventDefault(event);
			lastUserEditFormInput.focus({focusVisible: true});
		};
	};
};

function lastUserEditFormInputKeyDownEventHandler(event){
	if(document.activeElement == lastUserEditFormInput){
		if(event.key == "Tab" && event.shiftKey){
			stopPropagationAndPreventDefault(event);
			secondToLastUserEditFormInput.focus({focusVisible: true});
		}else if(event.key == "Tab"){
			stopPropagationAndPreventDefault(event);
			firstUserEditFormInput.focus({focusVisible: true});
		};
	};
};

	// User edit modal shake when user clicks outside of modal
function userEditModalClickEventHandler(event){
	const clickTarget = event.target;
	if(!userEditFormHeaderAndForm.contains(clickTarget)) {
		shakeElement(userEditFormHeaderAndForm);
	};
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	userSettingsButtonClickEventHandler,
	userEditSubmitButtonClickEventHandler,
	userEditCancelButtonClickEventHandler,
	handleEscapeKey,
	firstUserEditFormInputKeyDownEventHandler,
	lastUserEditFormInputKeyDownEventHandler,
	userEditModalClickEventHandler
});
