// Imports ----------------------------------------------------------------
import {shrinkTextToFitWhenTyping} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './toDoListEventHandlers.js';
import './global.js';
import './burgerMenu.js';
import './userSettings.js';
import './nav.js';
import initializeGuestMode from './guestModeRuntime.js';

// Element selections ----------------------------------------------------------------
	// Top bar list name input
const topBarContainer = document.querySelector('.to-do-list-top-bar-container');
const topBarListNameInput = document.querySelector('.to-do-list-name-inline-edit-form-input');
const topBarListNameInputCurrentValue = topBarListNameInput.value;

	// Lists container
const listItemsContainer = document.querySelector('.to-do-list-items-container');

	// List items container inline inputs
const listItemContainer = document.querySelectorAll('.to-do-list-details-container');
const listItemContainerItemCompletedInput = document.querySelectorAll('.to-do-list-item-completed-inline-edit-form-input');
const listItemContainerItemTextInput = document.querySelectorAll('.to-do-list-item-text-inline-edit-form-input');
const listItemContainerDueDateInput = document.querySelectorAll('.to-do-list-item-due-date-inline-edit-form-input');
const listItemContainerDueDateInputShowPickerButton = document.querySelectorAll('.to-do-list-item-due-date-inline-edit-form-input-picker-show-button');
const listItemContainerPriorityForm = document.querySelectorAll('.to-do-list-item-priority-inline-edit-form');
const listItemContainerPriorityInputContainer = document.querySelectorAll('.to-do-list-item-priority-inline-edit-container');
const listItemContainerPriorityInput = document.querySelectorAll('.to-do-list-item-priority-inline-edit-input');
const listItemContainerPriorityInputShowButton = document.querySelectorAll('.to-do-list-item-priority-inline-edit-show-button');
const listItemEditButton = document.querySelectorAll('.to-do-list-item-edit-button');
const listItemEditButtonIcon = document.querySelectorAll('.to-do-list-item-edit-button-icon');
const listItemDeleteForm = document.querySelectorAll('.to-do-list-item-delete-button-container');
const listItemDeleteButton = document.querySelectorAll('.to-do-list-item-delete-button');
const listItemDeleteButtonLast = listItemDeleteButton[listItemDeleteButton.length-1];
const listItemDeleteButtonIcon = document.querySelectorAll('.to-do-list-item-delete-button-icon');
const listItemDeleteConfirmationContainerBackdrop = document.querySelectorAll('.to-do-list-item-delete-confirmation-container-backdrop');
const listItemDeleteConfirmationContainerBackdropUnder400px = document.querySelectorAll('.to-do-list-item-delete-confirmation-container-backdrop-under-400-px-width');
const listItemDeleteConfirmationContainer = document.querySelectorAll('.to-do-list-item-delete-confirmation-container');
const listItemDeleteConfirmationContainerUnder400px = document.querySelectorAll('.to-do-list-item-delete-confirmation-container-under-400-px-width');
const listItemDeleteConfirmationButton = document.querySelectorAll('.to-do-list-item-delete-confirmation-button');
const listItemDeleteConfirmationCancelButton = document.querySelectorAll('.to-do-list-item-delete-confirmation-cancel-button');

const guestModeActive = initializeGuestMode({ page: 'list' });

	// New list item entry form
const newListItemEntryFormShowButtonContainer = document.querySelector('.entry-form-show-button-container');
const newListItemEntryFormShowButton = document.querySelector('.entry-form-show-button');
const newListItemEntryFormContainer = document.querySelector('.to-do-list-entry-form-container');
const newListItemEntryForm = document.querySelector('.to-do-list-entry-form');
const newListItemEntryFormUnder700px = document.querySelector('.to-do-list-entry-form-under-700-px-width');
const newListItemEntryFormNameInput = document.querySelector('.to-do-list-entry-form-item-text-input');
const newListItemEntryFormNameInputUnder700px = document.querySelector('.to-do-list-entry-form-item-text-input-under-700-px-width');
const listItemEntryDateInput = document.querySelectorAll('.to-do-list-entry-form-item-due-date-input');
const listItemEntryDateInputShowPickerButton = document.querySelectorAll('.to-do-list-entry-form-item-due-date-picker-show-button');
const newListItemEntryFormPriorityInput = document.querySelectorAll('.to-do-list-entry-form-item-priority-container');
const newListItemEntryFormPriorityInputStar1 = document.querySelectorAll('.to-do-list-entry-form-item-priority-container #star1');
const newListItemEntryFormPriorityInputStar1Under700px = document.querySelectorAll('.to-do-list-entry-form-item-priority-container #star1Under700px');
const newListItemEntryFormSubmitButton = document.querySelectorAll('.to-do-list-entry-form-item-submit-button-input');

	// Edit list item modal
const editListItemEntryFormNameInput = document.querySelectorAll('.to-do-list-edit-form-item-text-input');
const editListItemEntryFormDateInput = document.querySelectorAll('.to-do-list-edit-form-item-due-date-input');
const firstItemEditModalInput = document.querySelectorAll('.to-do-list-edit-form-item-text-input');
const secondToLastItemEditModalInput = document.querySelectorAll('.to-do-list-edit-form-item-submit-button-input');
const lastItemEditModalInput = document.querySelectorAll('.to-do-list-edit-form-item-cancel-button-input');
const listItemEditModalHeaderAndForm = document.querySelectorAll('.list-item-edit-modal-header-and-form-container');
const listItemEditModalHeader = document.querySelectorAll('.list-item-edit-modal-form-header');
const listItemEditModal = document.querySelectorAll('.popup-backdrop');
const listItemEditForm = document.querySelectorAll('.to-do-list-edit-form');
const listEditModalContainer = document.querySelector('.to-do-list-container');
const listItemEditSubmitButton = document.querySelectorAll('.to-do-list-edit-form-item-submit-button-input');
const listItemEditCancelButton = document.querySelectorAll('.to-do-list-edit-form-item-cancel-button-input');

	// First item priority radio option
const listItemEntryPriorityStar1 = document.querySelectorAll('#star1');
const listItemEntryPriorityStar1Under700px = document.querySelectorAll('#star1Under700px');

	// Back button to lists
const listBackButton = document.querySelector('.to-do-list-back-button');

// Event listeners ----------------------------------------------------------------
	// If tab key is pressed while no element is focused, focus is forced to tabindex="1"
document.addEventListener('keydown', tabKeyOnDocumentEventHandler);

	// New list form focus first input on keyboard combo
		// Also hides new list entry show button and shows entry form if form is hidden on smaller screen sizes
document.addEventListener('keydown', focusFirstInput);

	// List items container page load listener - to build out blank/dummy list items and separators, if needed
window.addEventListener('DOMContentLoaded', addDummyListItems);

	// Main page focus trapping (looping from last inline delete button back to new list name input)
if(isObjectAndNotNull(listItemDeleteButtonLast)){
	listItemDeleteButtonLast.addEventListener('keydown', deleteButtonLastKeydownEventHandler);
};

	// Top bar list name input
topBarListNameInput.addEventListener('focus', topBarUserNameInputFocusEventHandler);

	// List item inline edit display section inputs
		// Item completed
listItemContainerItemCompletedInput.forEach((item) => {
	item.addEventListener('change', listItemContainerItemCompletedInputChangeEventHandler);
});

		// Item text
listItemContainerItemTextInput.forEach((item)=>{
	item.addEventListener('focus', listItemContainerItemTextInputFocusEventHadler);
});

		// Item due date
listItemContainerDueDateInputShowPickerButton.forEach((item)=>{
	const index = item.value;
	const [year, month, day] = listItemContainerDueDateInput[index].value.split('-');
	const displayDay = day;
	const displayMonth = convertMonthNumberToLetterAbbreviation(month);
	item.innerHTML = `
		<div class="to-do-list-item-due-date-inline-edit-form-input-picker-show-button-month-day-display-container">
			<div class="to-do-list-item-due-date-inline-edit-form-input-picker-show-button-month-container">
				<span class="to-do-list-item-due-date-inline-edit-form-input-picker-show-button-month">${displayMonth}</span>
			</div>
			<div class="to-do-list-item-due-date-inline-edit-form-input-picker-show-button-day-container">
				<span class="to-do-list-item-due-date-inline-edit-form-input-picker-show-button-day">${displayDay}</span>
			</div>
		</div>
		`;
	item.addEventListener('click', listItemContainerDueDateInputShowPickerButtonClickEventHandler);
});

listItemContainerDueDateInput.forEach((item)=>{
	item.addEventListener('change', listItemContainerDueDateInputChangeEventListener);
	item.addEventListener('blur', listItemContainerDueDateInputBlurEventListener);
	item.addEventListener('keydown', listItemContainerDueDateInputKeydownEventHandler);
});

		// Item priority
listItemContainerPriorityInputShowButton.forEach((item)=>{
	item.addEventListener('click', listItemContainerPriorityInputShowButtonClickEventHandler);
});

listItemContainerPriorityInputContainer.forEach((item)=>{
	item.addEventListener('blur', listItemContainerPriorityInputContainerBlurEventHandler);
});

listItemContainerPriorityInput.forEach((item)=>{
	item.addEventListener('change', listItemContainerPriorityInputChangeEventHandler);
});

		// Item edit button
listItemEditButton.forEach((item)=>{
	item.addEventListener('click', listItemEditButtonClickEventHandler);
});

		// Item delete button
listItemDeleteButton.forEach((item)=>{
	item.addEventListener('click', listItemDeleteButtonClickEventHandler);
});

	// List item entry container
		// New list form hidden until show button is clicked
newListItemEntryFormShowButton.addEventListener('click', newListItemEntryFormShowButtonClickEventHandler);

		// New list item entry submit button under 700px width
newListItemEntryFormUnder700px.addEventListener('submit', newListItemEntryFormUnder700pxSubmitEventHandler);

		// List entry due date watcher - if value is "", style picker button with icon, else style with month and day
listItemEntryDateInput.forEach((item)=>{
	item.addEventListener('change', listItemEntryDateInputChangeEventHandler);
});

		// Show date input picker when date input picker button is clicked
listItemEntryDateInputShowPickerButton.forEach((item)=>{
	item.addEventListener('click', listItemEntryDateInputShowPickerButtonClickEventHandler);
});

	// Automatically select first item priority radio option when focus is given to it ---------------------
listItemEntryPriorityStar1.forEach((item)=>{
	item.addEventListener('focus', listItemEntryPriorityStar1FocusEventHandler);
});
listItemEntryPriorityStar1Under700px.forEach((item)=>{
	item.addEventListener('focus', listItemEntryPriorityStar1FocusEventHandler);
});

	// New list entry focus trapping
newListItemEntryFormNameInput.addEventListener('keydown', newListItemEntryFormNameInputKeydownEventHandler);

newListItemEntryFormNameInputUnder700px.addEventListener('keydown', newListItemEntryFormNameInputUnder700pxKeydownEventHandler);

newListItemEntryFormSubmitButton.forEach((item)=>{
	item.addEventListener('keydown', newListItemEntryFormSubmitButtonKeydownEventHandler);
});

	// Back button to lists
listBackButton.addEventListener('click', listBackButtonClickEventHandler);

// Text input field font size increase descrease to prevent overflow-x -------------------------------------------
shrinkTextToFitWhenTyping('.to-do-list-entry-form-item-text-input');
shrinkTextToFitWhenTyping('.to-do-list-edit-form-item-text-input');
shrinkTextToFitWhenTyping('.to-do-list-name-inline-edit-form-input');
shrinkTextToFitWhenTyping('.to-do-list-item-text-inline-edit-form-input');
shrinkTextToFitWhenTyping('.user-edit-user-name-input');
shrinkTextToFitWhenTyping('.user-edit-user-email-input');
shrinkTextToFitWhenTyping('.user-edit-user-current-password-input');
shrinkTextToFitWhenTyping('.user-edit-user-new-password-input');

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	burgerMenu,
	navigationSmall,
	navLinks,
	bodyClickArea,
	topBarContainer,
	topBarListNameInput,
	topBarListNameInputCurrentValue,
	listItemsContainer,
	listItemContainerItemTextInput,
	listItemContainerDueDateInput,
	listItemContainerPriorityInput,
	listItemDeleteButton,
	listItemDeleteConfirmationContainerBackdrop,
	listItemDeleteConfirmationContainerBackdropUnder400px,
	listItemDeleteConfirmationContainer,
	listItemDeleteConfirmationCancelButton,
	newListItemEntryFormContainer,
	newListItemEntryFormNameInput,
	newListItemEntryFormNameInputUnder700px,
	newListItemEntryForm,
	newListItemEntryFormUnder700px,
	newListItemEntryFormPriorityInputStar1,
	newListItemEntryFormShowButtonContainer,
	newListItemEntryFormShowButton,
	newListItemEntryFormSubmitButton,
	editListItemEntryFormNameInput,
	editListItemEntryFormDateInput,
	firstItemEditModalInput,
	secondToLastItemEditModalInput,
	lastItemEditModalInput,
	listItemEditModal,
	listItemEditModalHeaderAndForm,
	listItemEditModalHeader,
	listItemEditForm,
	listItemEditButton,
	listEditModalContainer,
	listItemEditSubmitButton,
	listItemEditCancelButton,
	listBackButton,
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
	listItemEntryPriorityStar1,
	listItemEntryDateInput,
	listItemEntryDateInputShowPickerButton,
	listItemContainerDueDateInputShowPickerButton,
	listItemContainerPriorityForm,
	listItemContainerPriorityInputShowButton,
	listItemContainerPriorityInputContainer
});
