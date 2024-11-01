// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './global.js';


// Event handlers ----------------------------------------------------------------
function alertCloseButtonClickEventHandler(event){
	const index = Array.from(alertCloseButton).indexOf(this);
	alert[index].classList.add('flash-alert-close-without-click');
	if(alertBackdrop){
		alertBackdrop.classList.add('flash-alert-backdrop-closed');
	};
	alertCloseButton[index].autofocus = false;
	const autofocusElement = document.querySelector('[autofocus]');
	autofocusElement.focus();
};

function closeFlashAlertAfterDelay(item){
	setTimeout(()=>{
		const index = Array.from(alert).indexOf(item);
		if(window.getComputedStyle(item).visibility==='visible'){
			item.classList.add('flash-alert-close-without-click');
			if(alertBackdrop){
				alertBackdrop.classList.add('flash-alert-backdrop-closed');
				setTimeout(()=>{
					alertBackdrop.style.display='none';
				},1100);
			};
			alertCloseButton[index].autofocus = false;
			const activeElement = document.activeElement;
			if(activeElement.form===undefined){
				const autofocusElement = document.querySelector('[autofocus]');
				autofocusElement.focus();
			};
		};
	}, 1500);
};

function creditsLoggedInButtonClickEventHandler(event){
	event.preventDefault();
	toggleCssDisplayPropertyBetweenNoneAndBlock(creditsLoggedInBackdrop);
	setTimeout(()=>{
		creditsLoggedInBackdrop.classList.add('credits-logged-in-backdrop-in-use');
		creditsLoggedInContainer.classList.add('credits-logged-in-container-in-use');
	}, 250);
	const closeCredits=()=>{
		creditsLoggedInBackdrop.classList.remove('credits-logged-in-backdrop-in-use');
		creditsLoggedInContainer.classList.remove('credits-logged-in-container-in-use');
		setTimeout(()=>{
			toggleCssDisplayPropertyBetweenNoneAndBlock(creditsLoggedInBackdrop);
		},1000);
		creditsLoggedInBackdrop.removeEventListener('click', closeCredits);
	};
	creditsLoggedInBackdrop.addEventListener('click', closeCredits);
};
function creditsLoggedOutButtonClickEventHandler(event){
	event.preventDefault();
	toggleCssDisplayPropertyBetweenNoneAndBlock(creditsLoggedOutBackdrop);
	setTimeout(()=>{
		creditsLoggedOutBackdrop.classList.add('credits-logged-out-backdrop-in-use');
		creditsLoggedOutContainer.classList.add('credits-logged-out-container-in-use');
	}, 250);
	const closeCredits=()=>{
		creditsLoggedOutBackdrop.classList.remove('credits-logged-out-backdrop-in-use');
		creditsLoggedOutContainer.classList.remove('credits-logged-out-container-in-use');
		setTimeout(()=>{
			toggleCssDisplayPropertyBetweenNoneAndBlock(creditsLoggedOutBackdrop);
		},1000);
		creditsLoggedOutBackdrop.removeEventListener('click', closeCredits);
	};
	creditsLoggedOutBackdrop.addEventListener('click', closeCredits);
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	alertCloseButtonClickEventHandler,
	closeFlashAlertAfterDelay,
	creditsLoggedInButtonClickEventHandler,
	creditsLoggedOutButtonClickEventHandler
});
