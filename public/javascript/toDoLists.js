// Imports ----------------------------------------------------------------
import {shrinkTextToFitWhenTyping} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './toDoListsEventHandlers.js';
import './global.js';
import './burgerMenu.js';
import './userSettings.js';
import './nav.js';

// Element selections ----------------------------------------------------------------
	// Top bar user name input
const topBarContainer = document.querySelector('.to-do-lists-top-bar-container');
const topBarUserNameInput = document.querySelector('.to-do-lists-list-owner-input');
let topBarUserNameInputPlaceholderText;
const originalPlaceholderText = topBarUserNameInput.placeholder;

	// Lists container
const listsContainer = document.querySelector('.to-do-lists-list-container');

	// Lists container inputs
const listsContainerAnchor = document.querySelectorAll('.to-do-lists-list-anchor');
const listsContainerlistNameTextInput = document.querySelectorAll('.to-do-lists-list-name-inline-edit-form-input');
const listsContainerlistNameTextInputUnder400px = document.querySelectorAll('.to-do-lists-list-name-inline-edit-form-input-under-400-px');
const listsContainerlistNameCategoryInput = document.querySelectorAll('.to-do-lists-list-category-inline-edit-form-input');
const listsContainerlistNameViewButton = document.querySelectorAll('.to-do-lists-list-view-button');
const listsContainerlistNameViewButtonIcon = document.querySelectorAll('.to-do-lists-list-view-button-icon');
const listsContainerlistNameEditButton = document.querySelectorAll('.to-do-lists-list-edit-button');
const listsContainerlistNameEditButtonIcon = document.querySelectorAll('.to-do-lists-list-edit-button-icon');
const listsContainerlistNameDeleteForm = document.querySelectorAll('.to-do-lists-list-delete-button-container');
const listsContainerlistNameDeleteButton = document.querySelectorAll('.to-do-lists-list-delete-button');
const listsContainerlistNameDeleteButtonLast = listsContainerlistNameDeleteButton[listsContainerlistNameDeleteButton.length-1];
const listsContainerlistNameDeleteButtonUnder400px = document.querySelectorAll('.to-do-lists-list-delete-button-under-400-px-width');
const listsContainerlistNameDeleteButtonUnder400pxLast = listsContainerlistNameDeleteButtonUnder400px[listsContainerlistNameDeleteButtonUnder400px.length-1];
const listsContainerlistNameDeleteButtonIcon = document.querySelectorAll('.to-do-lists-list-delete-button-icon');
const listsContainerlistNameDeleteConfirmationContainerBackdrop = document.querySelectorAll('.to-do-lists-delete-confirmation-container-backdrop');
const listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px = document.querySelectorAll('.to-do-lists-delete-confirmation-container-backdrop-under-400-px-width');
const listsContainerlistNameDeleteConfirmationContainer = document.querySelectorAll('.to-do-lists-delete-confirmation-container');
const listsContainerlistNameDeleteConfirmationContainerUnder400px = document.querySelectorAll('.to-do-lists-delete-confirmation-container-under-400-px-width');
const listsContainerlistNameDeleteConfirmationCancelButton = document.querySelectorAll('.to-do-lists-list-delete-confirmation-cancel-button');
const listsContainerlistNameDeleteConfirmationCancelButtonUnder400px = document.querySelectorAll('.to-do-lists-list-delete-confirmation-cancel-button-under-400-px');

	// New list entry form
const newListEntryFormShowButtonContainer = document.querySelector('.entry-form-show-button-container');
const newListEntryFormShowButton = document.querySelector('.entry-form-show-button');
const newListEntryFormContainer = document.querySelector('.to-do-lists-list-entry-form-container');
const newListEntryForm = document.querySelector('.to-do-lists-list-entry-form');
const newListEntryFormUnder400px = document.querySelector('.to-do-lists-list-entry-form-under-400-px-width');
const newListEntryFormNameInput = document.querySelector('.to-do-lists-list-entry-form-list-name-input');
const newListEntryFormNameInputUnder400px = document.querySelector('.to-do-lists-list-entry-form-list-name-input-under-400-px-width');
const newListEntryFormCategoryShowButton = document.querySelector('.to-do-lists-list-entry-form-list-category-show-button');
const newListEntryFormCategoryShowButtonIcon = document.querySelector('.to-do-lists-list-entry-form-list-category-input-icon');
const newListEntryFormCategoryInputContainer = document.querySelector('.to-do-lists-list-entry-form-list-category-container');
const newListEntryFormCategoryInput = document.querySelector('.to-do-lists-list-entry-form-list-category-input');
const newListEntryFormCategoryInputUnder400px = document.querySelector('.to-do-lists-list-entry-form-list-category-input-under-400-px-width');
const newListEntryFormSubmitButton = document.querySelectorAll('.to-do-lists-list-entry-form-list-submit-button-input');

	// Edit list modal
const listEditModalHeaderAndForm = document.querySelectorAll('.list-edit-modal-header-and-form-container');
const listEditModalHeader = document.querySelectorAll('.list-edit-modal-form-header');
const editListEntryFormNameInput = document.querySelectorAll('.to-do-lists-list-edit-form-list-name-input');
const listEditForm = document.querySelectorAll('.to-do-list-edit-form');
const firstListEditModalInput = document.querySelectorAll('.to-do-lists-list-edit-form-list-name-input');
const secondToLastListEditModalInput = document.querySelectorAll('.to-do-lists-list-edit-form-list-submit-button-input');
const lastListEditModalInput = document.querySelectorAll('.to-do-lists-list-edit-form-list-cancel-button-input');
const listEditModal = document.querySelectorAll('.list-edit-modal-backdrop');
const listEditModalContainer = document.querySelector('.to-do-lists-container');
const listEditSubmitButton = document.querySelectorAll('.to-do-lists-list-edit-form-list-submit-button-input');
const listEditCancelButton = document.querySelectorAll('.to-do-lists-list-edit-form-list-cancel-button-input');

// Event listeners ----------------------------------------------------------------
	// If tab key is pressed while no element is focused, focus is forced to tabindex="1"
document.addEventListener('keydown', tabKeyOnDocumentEventHandler);

	// New list form focus first input on keyboard combo
		// Also hides new list entry show button and shows entry form if form is hidden on smaller screen sizes
document.addEventListener('keydown', focusFirstInput);

	// Lists container page load listener - to build out blank/dummy lists and separators, if needed
window.addEventListener('DOMContentLoaded', addDummyLists);

	// Main page focus trapping (looping from last inline delete button back to new list name input)
if(isObjectAndNotNull(listsContainerlistNameDeleteButtonLast)){
	listsContainerlistNameDeleteButtonLast.addEventListener('keydown', listsContainerlistNameDeleteButtonLastKeydownEventHandler);
	listsContainerlistNameDeleteButtonUnder400pxLast.addEventListener('keydown', listsContainerlistNameDeleteButtonUnder400pxLastKeydownEventHandler);
};

	// Top bar user name input focus, blur and keydown listeners
topBarUserNameInput.addEventListener('focus', topBarUserNameInputFocusEventHandler);


	// List entry inline display section inputs
		// List name
listsContainerlistNameTextInput.forEach((item)=>{
	item.addEventListener('focus', listsContainerlistNameTextInputFocusEventHandler);
}); // Also sets up 'blur' and 'keydown' listeners within the 'focus' listener

		// List category
listsContainerlistNameCategoryInput.forEach((item)=>{
	item.addEventListener('change', listsContainerlistNameCategoryInputChangeEventListener);
});

		// List edit button
listsContainerlistNameEditButton.forEach((item)=>{
	item.addEventListener('click', listsContainerlistNameEditButtonClickEventHandler);
});

		// List delete button
listsContainerlistNameDeleteButton.forEach((item)=>{
	item.addEventListener('click', listsContainerlistNameDeleteButtonClickEventHandler);
});

listsContainerlistNameDeleteButtonUnder400px.forEach((item)=>{
	item.addEventListener('click', listsContainerlistNameDeleteButtonUnder400pxClickEventHandler);
});

	// New list form hidden until show button is clicked when screen width under 700px
newListEntryFormShowButton.addEventListener('click', newListEntryFormShowButtonClickEventHandler);

	// Outline select show button when select is focused
newListEntryFormCategoryInput.addEventListener('focus', newListEntryFormCategoryInputFocusEventHandler);

	// Remove outline from select show button when select is blurred
newListEntryFormCategoryInput.addEventListener('blur', newListEntryFormCategoryInputBlurEventHandler);

	// New list entry focus trapping
newListEntryFormNameInput.addEventListener('keydown', newListEntryFormNameInputKeydownEventHandler);

newListEntryFormNameInputUnder400px.addEventListener('keydown', newListEntryFormNameInputUnder400pxKeydownEventHandler);

newListEntryFormSubmitButton.forEach((item)=>{
	item.addEventListener('keydown', newListEntryFormSubmitButtonKeydownEventHandler);
});

// Text input field font size increase descrease to prevent overflow-x --------------------------------------------
shrinkTextToFitWhenTyping('.to-do-lists-list-entry-form-list-name-input');
shrinkTextToFitWhenTyping('.to-do-lists-list-edit-form-list-name-input');
shrinkTextToFitWhenTyping('.to-do-lists-list-name-inline-edit-form-input');
shrinkTextToFitWhenTyping('.to-do-lists-list-owner-input');
shrinkTextToFitWhenTyping('.user-edit-user-name-input');
shrinkTextToFitWhenTyping('.user-edit-user-email-input');
shrinkTextToFitWhenTyping('.user-edit-user-current-password-input');
shrinkTextToFitWhenTyping('.user-edit-user-new-password-input');

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	focusAndSelect,
	burgerMenu,
	navigationSmall,
	navLinks,
	bodyClickArea,
	topBarContainer,
	topBarUserNameInput,
	topBarUserNameInputPlaceholderText,
	originalPlaceholderText,
	listsContainer,
	listsContainerAnchor,
	listsContainerlistNameTextInput,
	listsContainerlistNameTextInputUnder400px,
	listsContainerlistNameCategoryInput,
	listsContainerlistNameViewButton,
	listsContainerlistNameEditButton,
	listsContainerlistNameDeleteButton,
	listsContainerlistNameDeleteConfirmationContainerBackdrop,
	listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px,
	listsContainerlistNameDeleteConfirmationContainer,
	listsContainerlistNameDeleteConfirmationContainerUnder400px,
	listsContainerlistNameDeleteConfirmationCancelButton,
	listsContainerlistNameDeleteConfirmationCancelButtonUnder400px,
	listsContainerlistNameDeleteButtonLast,
	listsContainerlistNameDeleteButtonUnder400pxLast,
	newListEntryFormContainer,
	newListEntryFormShowButtonContainer,
	newListEntryFormShowButton,
	newListEntryFormNameInput,
	editListEntryFormNameInput,
	newListEntryFormCategoryShowButtonIcon,
	listEditForm,
	firstListEditModalInput,
	secondToLastListEditModalInput,
	lastListEditModalInput,
	listEditModalHeaderAndForm,
	listEditModalHeader,
	listEditModal,
	listEditModalContainer,
	listEditSubmitButton,
	listEditCancelButton,
	userSettingsButton,
	userLogoutButton,
	userEditModal,
	userEditForm,
	firstUserEditFormInput,
	secondToLastUserEditFormInput,
	lastUserEditFormInput,
	userEditFormNameInput,
	userEditSubmitButton,
	userEditCancelButton,
	newListEntryForm,
	newListEntryFormUnder400px,
	newListEntryFormNameInputUnder400px,
	newListEntryFormCategoryInputContainer,
	newListEntryFormCategoryInput,
	newListEntryFormCategoryInputUnder400px,
	newListEntryFormCategoryShowButton,
	newListEntryFormSubmitButton,
	newListEntryFormShowButtonContainer
});
