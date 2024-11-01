// Imports ----------------------------------------------------------------
import {
	shrinkTextToFitWhenTyping,
	shrinkTextToFitWhenTypingVertical
} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './global.js';
import './registerEventHandlers.js';

// Element selections ----------------------------------------------------------------
	// Next button to transition from registration form part 1 to part 2
const formPart1 = document.querySelector('.registration-form-part-1');
const formPart2 = document.querySelector('.registration-form-part-2');
const nextButton = document.querySelector('.registration-next-button-input');
const footer = document.querySelector('.footer');

	// Text area (hidden in HTML form) and contenteditable text area div handling
let textAreaDiv = document.querySelector('.registration-user-name-input-div');
let textArea = document.querySelector('.registration-user-name-input');
const registrationForm = document.querySelector('.registration-form');
const submitButton = document.querySelector('.registration-submit-button-input');

	// Email input
const emailInput = document.querySelector('#registration-user-email');

	// Login button
const loginButton = document.querySelector('.go-to-login-button-input');

// Variables ----------------------------------------------------------------
const textAreaDivScrollHeight = textAreaDiv.scrollHeight;

// Event listeners ----------------------------------------------------------------
	// Watch text area div inputs, to switch caret color and shrink text to avoid scroll
textAreaDiv.addEventListener('input', textAreaDivInputEventHandler);

	// Watch text area div for focus events to simulate behavior of a standard HTML text input
		// Still trying to get user-entered text highlighted when field tabbed into
textAreaDiv.addEventListener('focus', textAreaDivFocusEventHandler);

	// Watch text area div for blur events to simulate behavior of a standard HTML text input
textAreaDiv.addEventListener('blur', textAreaDivBlurEventHandler);

	// Catch next button clicks, transition out form part 1 and in form part 2
nextButton.addEventListener('click', nextButtonClickEventHandler);

	// Catch registration submission, grab text from text area div, clean it, pass it to text area and submit form
registrationForm.addEventListener('submit', registrationFormSubmitEventHandler);

	// Text input field font size increase descrease to prevent overflow-x
shrinkTextToFitWhenTypingVertical('.registration-user-name-input-div', 0);
shrinkTextToFitWhenTyping('.registration-user-email-input');
shrinkTextToFitWhenTyping('.registration-user-password-input');
shrinkTextToFitWhenTyping('.registration-user-password-confirmation-input');

	// Go to login page trigger
loginButton.addEventListener('click', loginButtonClickEventHandler);

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	textAreaDiv,
	textAreaDivScrollHeight,
	textArea,
	registrationForm,
	submitButton,
	nextButton,
	formPart1,
	formPart2,
	emailInput,
	footer
});
