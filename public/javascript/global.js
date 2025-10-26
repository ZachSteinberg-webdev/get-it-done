// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './globalEventHandlers.js';

const clearGuestModeStorageIfRequested = ()=>{
	const body = document.body;
	if(!body){
		return;
	}
	const shouldClear = body.dataset.clearGuestStorage === 'true';
	if(!shouldClear){
		return;
	}
	try{
		localStorage.removeItem('guestModeData');
		sessionStorage.removeItem('guestModeAlertDismissed');
	}catch(error){
		// Ignore storage errors (likely Safari private mode).
	}
	delete body.dataset.clearGuestStorage;
};

clearGuestModeStorageIfRequested();

// Element selections ----------------------------------------------------------------
	// Flash
const alertBackdrop = document.querySelector('.flash-alert-backdrop');
const alert = document.querySelectorAll('.flash-alert');
const alertCloseButton = document.querySelectorAll('.btn-close');
	// Credits
const creditsLoggedInButton = document.querySelector('.credits-logged-in-link');
const creditsLoggedOutButton = document.querySelector('.credits-logged-out-link');
const creditsLoggedInBackdrop = document.querySelector('.credits-logged-in-backdrop');
const creditsLoggedInContainer = document.querySelector('.credits-logged-in-container');
const creditsLoggedOutBackdrop = document.querySelector('.credits-logged-out-backdrop');
const creditsLoggedOutContainer = document.querySelector('.credits-logged-out-container');


// #######
// #       #        ##    ####  #    #
// #       #       #  #  #      #    #
// #####   #      #    #  ####  ######
// #       #      ######      # #    #
// #       #      #    # #    # #    #
// #       ###### #    #  ####  #    #

// Event listener ----------------------------------------------------------------
alertCloseButton.forEach((item)=>{
	item.addEventListener('click', alertCloseButtonClickEventHandler);
});


// Close alert after specified delay ----------------------------------------------------------------
alert.forEach((item)=>{
	if(item!==null){
		closeFlashAlertAfterDelay(item);
	};
});

//  #####
// #     # #####  ###### #####  # #####  ####
// #       #    # #      #    # #   #   #
// #       #    # #####  #    # #   #    ####
// #       #####  #      #    # #   #        #
// #     # #   #  #      #    # #   #   #    #
//  #####  #    # ###### #####  #   #    ####

// Event listeners ----------------------------------------------------------------
if(creditsLoggedInButton){
	creditsLoggedInButton.addEventListener('click', creditsLoggedInButtonClickEventHandler);
};
if(creditsLoggedOutButton){
	creditsLoggedOutButton.addEventListener('click', creditsLoggedOutButtonClickEventHandler);
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	alertBackdrop,
	alert,
	alertCloseButton,
	creditsLoggedInButton,
	creditsLoggedOutButton,
	creditsLoggedInBackdrop,
	creditsLoggedInContainer,
	creditsLoggedOutBackdrop,
	creditsLoggedOutContainer
});
