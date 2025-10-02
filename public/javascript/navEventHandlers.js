// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './nav.js';

// Event handlers ----------------------------------------------------------------
function userLogoutButtonClickEventHandler(event){
	const action = event?.currentTarget?.dataset?.action || '/logout';
	if(action === '/logout'){
		toggleCssDisplayPropertyBetweenNoneAndBlock(goodbyeBackdrop);
		setTimeout(()=>{
			goodbyeContainer.classList.add('goodbye-container-in-use');
			setTimeout(()=>{
				window.location.href = action;
			}, 2500);
		}, 250);
	}else{
		window.location.href = action;
	}
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	userLogoutButtonClickEventHandler
});
