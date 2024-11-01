// Imports ----------------------------------------------------------------
import {
	shrinkTextToFitWhenTyping,
	shrinkTextToFitWhenTypingVertical
} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './register.js';

// Event handlers ----------------------------------------------------------------
	// Watch text area div inputs, to switch caret color
function textAreaDivInputEventHandler(event){
	if(event.inputType==='insertParagraph'){
		formPart1.classList.add('registration-form-part-1-after-transition');
		formPart2.classList.add('registration-form-part-2-after-transition');
		emailInput.focus({focusVisible: true});
	};
};

// Watch text area div for focus events to simulate behavior of a standard HTML text input
	// Still trying to get user-entered text highlighted when field tabbed into
function textAreaDivFocusEventHandler(event){
	if(textAreaDiv.innerText === "Your name"){
		textAreaDiv.textContent = '\u0080';
		textAreaDiv.style.color = "black";
	}else if(textAreaDiv.innerText !="Your name"){
		window.getSelection().selectAllChildren(textAreaDiv);
	};
};

// Watch text area div for blur events to simulate behavior of a standard HTML text input
function textAreaDivBlurEventHandler(event){
	if(textAreaDiv.textContent === '\u0080' || textAreaDiv.textContent === '\n' || textAreaDiv.textContent === ''){
		textAreaDiv.textContent = "Your name";
		textAreaDiv.style.color = "grey";
	};
};

// Catch next button clicks, transition out form part 1 and in form part 2
function nextButtonClickEventHandler(event){
	formPart1.classList.add('registration-form-part-1-after-transition');
	formPart2.classList.add('registration-form-part-2-after-transition');
	emailInput.focus({focusVisible: true});
	footer.style.opacity=0;
};

// Catch registration submission, grab text from text area div, clean it, pass it to text area and submit form
function registrationFormSubmitEventHandler(event){
	stopPropagationAndPreventDefault(event);
	let textAreaDivContent = textAreaDiv.textContent.replace(/\u0080+/g, '').replace(/[^0-9a-zA-Z\s]/g, '');
	textArea.textContent = textAreaDivContent;
	registrationForm.submit();
};

// Take user back to login
function loginButtonClickEventHandler(event){
	window.location.href = '/login';
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	textAreaDivInputEventHandler,
	textAreaDivFocusEventHandler,
	textAreaDivBlurEventHandler,
	nextButtonClickEventHandler,
	registrationFormSubmitEventHandler,
	loginButtonClickEventHandler
});
