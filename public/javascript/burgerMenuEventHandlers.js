// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './burgerMenu.js';

// Event handlers ----------------------------------------------------------------
function burgerMenuClickEventHandler(event){
	event.stopPropagation();
	navigationSmall.classList.toggle("show");
	if(navigationSmall.classList.contains("show")){
		navigationSmall.inert = false;
		burgerMenuTop.classList.add("user-button-top-expanded");
		burgerMenuBottom.classList.add("user-button-bottom-expanded");
	}else{
		navigationSmall.inert = true;
		burgerMenuTop.classList.remove("user-button-top-expanded");
		burgerMenuBottom.classList.remove("user-button-bottom-expanded");
	};
};

function burgerMenuMouseEnterEventHandler(event){
	burgerMenuTop.classList.add('user-button-top-partially-expanded');
	burgerMenuBottom.classList.add('user-button-bottom-partially-expanded');
};

function burgerMenuFocusInEventHandler(event){
	burgerMenuTop.classList.add('user-button-top-partially-expanded');
	burgerMenuBottom.classList.add('user-button-bottom-partially-expanded');
};

function burgerMenuMouseLeaveEventHandler(event){
	burgerMenuTop.classList.remove('user-button-top-partially-expanded');
	burgerMenuBottom.classList.remove('user-button-bottom-partially-expanded');
};

function burgerMenuFocusOutEventHandler(event){
	burgerMenuTop.classList.remove('user-button-top-partially-expanded');
	burgerMenuBottom.classList.remove('user-button-bottom-partially-expanded');
};

function burgerMenuKeyDownEventHandler(event){
	if(navigationSmall.classList.contains('show')){
		if(event.key == "Tab" && event.shiftKey){
			navigationSmall.inert = true;
			navigationSmall.classList.remove('show');
			burgerMenuTop.classList.remove("user-button-top-expanded");
			burgerMenuBottom.classList.remove("user-button-bottom-expanded");
		};
	};
};

function lastNavLinkKeyDownEventHandler(event){
	if(event.key == "Tab" && !event.shiftKey){
		navigationSmall.classList.remove('show');
		burgerMenuTop.classList.remove("user-button-top-expanded");
		burgerMenuBottom.classList.remove("user-button-bottom-expanded");
		event.preventDefault();
		topBarInput.focus();
		navigationSmall.inert = true;
	};
};

function navLinkClickEventHandler(event){
	navigationSmall.inert = true;
	navigationSmall.classList.toggle("show");
	burgerMenuTop.classList.remove("user-button-top-expanded");
	burgerMenuBottom.classList.remove("user-button-bottom-expanded");
};

function bodyClickEventHandler(event){
	event.stopPropagation();
	if(navigationSmall.classList.contains('show')) {
		navigationSmall.inert = true;
		navigationSmall.classList.remove('show');
		burgerMenuTop.classList.remove("user-button-top-expanded");
		burgerMenuBottom.classList.remove("user-button-bottom-expanded");
	};
};

function handleEscapeKey(event){
	if(navigationSmall.classList.contains('show')){
		if(event.key==="Escape"){
			navigationSmall.inert = true;
			navigationSmall.classList.remove('show');
			burgerMenuTop.classList.remove("user-button-top-expanded");
			burgerMenuBottom.classList.remove("user-button-bottom-expanded");
		};
	};
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	burgerMenuClickEventHandler,
	burgerMenuMouseEnterEventHandler,
	burgerMenuFocusInEventHandler,
	burgerMenuMouseLeaveEventHandler,
	burgerMenuFocusOutEventHandler,
	burgerMenuKeyDownEventHandler,
	lastNavLinkKeyDownEventHandler,
	navLinkClickEventHandler,
	bodyClickEventHandler,
	handleEscapeKey
});
