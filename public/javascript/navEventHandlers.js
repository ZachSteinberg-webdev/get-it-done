// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './nav.js';

// Event handlers ----------------------------------------------------------------
function userLogoutButtonClickEventHandler(event){
	toggleCssDisplayPropertyBetweenNoneAndBlock(goodbyeBackdrop);
	setTimeout(()=>{
		goodbyeContainer.classList.add('goodbye-container-in-use');
		setTimeout(()=>{
			window.location.href = '/to-do-list/logout';
		}, 2500);
	}, 250);
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	userLogoutButtonClickEventHandler
});
