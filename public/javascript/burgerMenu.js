// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './burgerMenuEventHandlers.js';

// Element selections ----------------------------------------------------------------
// Hamburger menu
const burgerMenu = document.querySelector(".user-button");
const burgerMenuTop = document.querySelector('.user-button-top');
const burgerMenuBottom = document.querySelector('.user-button-bottom');
const navigationSmall = document.querySelector(".navigation-small");
const navLinks = document.querySelectorAll(".nav-link");
const lastNavLink = document.querySelector('.user-logout-button');
const bodyClickArea = document.querySelector('body');

// Top bar
const topBarInput = document.querySelector('.top-bar-input');

// Hamburger menu
burgerMenu.addEventListener("click", burgerMenuClickEventHandler);

burgerMenu.addEventListener('mouseenter', burgerMenuMouseEnterEventHandler);

burgerMenu.addEventListener('focusin', burgerMenuFocusInEventHandler);

burgerMenu.addEventListener('mouseleave', burgerMenuMouseLeaveEventHandler);

burgerMenu.addEventListener('focusout', (event)=>{
	burgerMenuTop.classList.remove('user-button-top-partially-expanded');
	burgerMenuBottom.classList.remove('user-button-bottom-partially-expanded');
});

burgerMenu.addEventListener('keydown', burgerMenuKeyDownEventHandler);

lastNavLink.addEventListener('keydown', lastNavLinkKeyDownEventHandler);

navLinks.forEach((item)=>{
	item.addEventListener('click', navLinkClickEventHandler);
});

bodyClickArea.addEventListener('click', bodyClickEventHandler);

document.addEventListener('keydown', handleEscapeKey);

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	burgerMenu,
	burgerMenuTop,
	burgerMenuBottom,
	navigationSmall,
	navLinks,
	lastNavLink,
	bodyClickArea,
	topBarInput
});
