import {writeGuestData, markGuestAlertDismissed, isGuestAlertDismissed} from './guestModeClient.js';

const BOOTSTRAP_ELEMENT_ID = 'guest-mode-bootstrap-data';
const GUEST_DISABLED_CLASS = 'guest-mode-disabled-control';

const readBootstrapData = ()=>{
	const element = document.getElementById(BOOTSTRAP_ELEMENT_ID);
	if(!element){
		return null;
	}
	try{
		const content = element.textContent || element.innerText;
		return content ? JSON.parse(content) : null;
	}catch(error){
		return null;
	}
};

const disableElement = (element, message)=>{
	if(!element){
		return;
	}
	element.setAttribute('disabled', 'true');
	element.setAttribute('aria-disabled', 'true');
	element.classList.add(GUEST_DISABLED_CLASS);
	if(message){
		element.setAttribute('title', message);
	}
};

const setupGuestAlert = ()=>{
	const alertElement = document.querySelector('[data-role="guest-alert"]');
	if(!alertElement){
		return;
	}
	if(isGuestAlertDismissed()){
		alertElement.remove();
		return;
	}
	const dismissButton = alertElement.querySelector('[data-role="guest-alert-dismiss"]');
	if(dismissButton){
		dismissButton.addEventListener('click', ()=>{
			markGuestAlertDismissed();
			alertElement.remove();
		});
	}
};

const disableAccountOwnerInput = ()=>{
	const ownerInput = document.querySelector('.to-do-lists-list-owner-input');
	if(!ownerInput){
		return;
	}
	if(!ownerInput.value){
		ownerInput.value = ownerInput.placeholder;
	}
	disableElement(ownerInput, 'Guest mode uses a generic name. Create an account to personalize it.');
	const tooltip = document.querySelector('.to-do-lists-top-bar-user-name-change-input-tooltip');
	if(tooltip){
		tooltip.textContent = 'Guest mode uses a generic name. Create an account to personalize it.';
	}
};

const disableUserSettings = ()=>{
	const settingsButton = document.querySelector('.user-settings-button');
	disableElement(settingsButton, 'Guest mode users cannot update settings.');
	const userEditModal = document.querySelector('.user-edit-modal-backdrop');
	if(userEditModal){
		userEditModal.setAttribute('data-guest-disabled', 'true');
	}
};

const tagBodyForGuest = ()=>{
	if(document.body){
		document.body.classList.add('guest-mode-active');
	}
};

export const initializeGuestMode = ({ page } = {})=>{
	const bootstrapData = readBootstrapData();
	if(!bootstrapData){
		return false;
	}
	writeGuestData(bootstrapData);
	tagBodyForGuest();
	setupGuestAlert();
	disableUserSettings();
	if(page === 'lists'){
		disableAccountOwnerInput();
	}
	return true;
};

export default initializeGuestMode;
