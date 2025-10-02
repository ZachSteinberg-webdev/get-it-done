// Imports ----------------------------------------------------------------
import './login.js';
import {shrinkTextToFitWhenTyping} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import {readGuestData} from './guestModeClient.js';

// Event handlers ----------------------------------------------------------------
function registrationButtonClickEventHandler(event){
	window.location.href = '/register';
};

function guestModeButtonClickEventHandler(event){
	if(event){
		event.preventDefault();
	}
	const button = event?.currentTarget;
	if(button){
		button.disabled = true;
	}
	const guestData = readGuestData();
	fetch('/guest/start', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ guestData })
	})
		.then(async(response)=>{
			const data = await response.json().catch(()=>({}));
			return data;
		})
		.then((data)=>{
			const redirectTarget = data && data.redirect ? data.redirect : '/lists';
			window.location.href = redirectTarget;
		})
		.catch(()=>{
			window.location.href = '/lists';
		});
};

globalizeVariables({
	registrationButtonClickEventHandler,
	guestModeButtonClickEventHandler
});
