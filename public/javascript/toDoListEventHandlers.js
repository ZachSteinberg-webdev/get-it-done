// Imports ----------------------------------------------------------------
import './toDoList.js';
import {shrinkTextToFitWhenTyping} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './burgerMenu.js';
import './userSettings.js';

// Common function within document ----------------------------------------------------------------
function hideNewListItemEntryPane(){
	newListItemEntryFormContainer.classList.remove('entry-form-container-in-use');
	newListItemEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
	removeInertAttribute(newListItemEntryFormShowButton);
	removeInertAttribute(topBarContainer);
	removeInertAttribute(listItemsContainer);
};

function showNewListItemEntryPane(elementToFocus){
	addInertAttribute(newListItemEntryFormShowButton);
	addInertAttribute(topBarContainer);
	addInertAttribute(listItemsContainer);
	newListItemEntryFormShowButtonContainer.classList.add('entry-form-show-button-container-after-clicked');
	newListItemEntryFormContainer.classList.add('entry-form-container-in-use');
	setTimeout(()=>{
		focusAndSelect(elementToFocus);
	}, 250);
	document.body.addEventListener('click', handleClicksOutsideNewListItemEntryForm);
};

function handleClicksOutsideNewListItemEntryForm(){
	if(userClickedOutsideElement(newListItemEntryFormContainer) && userClickedOutsideElement(newListItemEntryFormShowButtonContainer)) {
		hideNewListItemEntryPane();
	};
};

function listItemSubmitButtonSubmitEventHandler(event){
	const index = this.dataset.index;
	stopPropagationAndPreventDefault(event);
	toggleInertAttribute(listEditModalContainer);
	listItemEditForm[index].classList.remove('list-edit-form-in-use');
	listItemEditModalHeader[index].classList.remove('list-item-edit-modal-form-header-in-use');
	listItemEditModal[index].classList.remove('popup-backdrop-in-use');
	listItemEditForm[index].removeEventListener('submit', listItemSubmitButtonSubmitEventHandler);
	listItemEditCancelButton[index].removeEventListener('click', listItemCancelButtonClickEventHandler);
	document.removeEventListener('keydown', this.inlineEditHandleEscapeKeyBound);
	listItemEditModal[index].removeEventListener('click', inlineEditHandleClicksOutsideElement);
	firstItemEditModalInput[index].removeEventListener('keydown', inlineEditFirstInputFocusTrapping);
	lastItemEditModalInput[index].removeEventListener('keydown', inlineEditLastInputFocusTrapping);
	setTimeout(()=>{
		changeCssProperty(listItemEditModal[index], 'display', 'none');
		listItemEditForm[index].submit();
	}, 250);
};
function listItemCancelButtonClickEventHandler(event){
	const index=this.dataset.index;
	stopPropagationAndPreventDefault(event);
	toggleInertAttribute(listEditModalContainer);
	listItemEditForm[index].classList.remove('list-edit-form-in-use');
	listItemEditModalHeader[index].classList.remove('list-item-edit-modal-form-header-in-use');
	listItemEditModal[index].classList.remove('popup-backdrop-in-use');
	listItemEditForm[index].removeEventListener('submit', listItemSubmitButtonSubmitEventHandler);
	listItemEditCancelButton[index].removeEventListener('click', listItemCancelButtonClickEventHandler);
	document.removeEventListener('keydown', this.inlineEditHandleEscapeKeyBound);
	listItemEditModal[index].removeEventListener('click', inlineEditHandleClicksOutsideElement);
	firstItemEditModalInput[index].removeEventListener('keydown', inlineEditFirstInputFocusTrapping);
	lastItemEditModalInput[index].removeEventListener('keydown', inlineEditLastInputFocusTrapping);
	setTimeout(()=>{
		changeCssProperty(listItemEditModal[index], 'display', 'none');
	}, 250);
};
function inlineEditHandleEscapeKey(event){
	// const index = event.explicitOriginalTarget.dataset.index;
	const index = this.value;
	if(getCssPropertyValue(listItemEditModal[index], 'display')==="block"){
		if(event.key==="Escape"){
			stopPropagationAndPreventDefault(event);
			toggleInertAttribute(listEditModalContainer);
			listItemEditForm[index].classList.remove('list-edit-form-in-use');
			listItemEditModalHeader[index].classList.remove('list-item-edit-modal-form-header-in-use');
			listItemEditModal[index].classList.remove('popup-backdrop-in-use');
			listItemEditForm[index].removeEventListener('submit', listItemSubmitButtonSubmitEventHandler);
			listItemEditCancelButton[index].removeEventListener('click', listItemCancelButtonClickEventHandler);
			document.removeEventListener('keydown', this.inlineEditHandleEscapeKeyBound);
			listItemEditModal[index].removeEventListener('click', inlineEditHandleClicksOutsideElement);
			firstItemEditModalInput[index].removeEventListener('keydown', inlineEditFirstInputFocusTrapping);
			lastItemEditModalInput[index].removeEventListener('keydown', inlineEditLastInputFocusTrapping);
			setTimeout(()=>{
				changeCssProperty(listItemEditModal[index], 'display', 'none');
			}, 250);
		};
	};
};
function inlineEditHandleClicksOutsideElement(event){
	const index = this.dataset.index;
	const clickTarget = event.target;
	if(!listItemEditModalHeaderAndForm[index].contains(clickTarget)) {
		shakeElement(listItemEditModalHeaderAndForm[index]);
	};
};
function inlineEditFirstInputFocusTrapping(event){
	const index = this.dataset.index;
	if(document.activeElement == firstItemEditModalInput[index]){
		if(event.key == "Tab" && event.shiftKey){
			stopPropagationAndPreventDefault(event);
			lastItemEditModalInput[index].focus({focusVisible: true});
		};
	};
};
function inlineEditLastInputFocusTrapping(event){
	const index = this.dataset.index;
	if(document.activeElement == lastItemEditModalInput[index]){
		if(event.key == "Tab" && event.shiftKey){
			stopPropagationAndPreventDefault(event);
			secondToLastItemEditModalInput[index].focus({focusVisible: true});
		}else if(event.key == "Tab"){
			stopPropagationAndPreventDefault(event);
			firstItemEditModalInput[index].focus({focusVisible: true});
		};
	};
};

function showInlineEditModal(index){
	stopPropagationAndPreventDefault(event);
		toggleInertAttribute(listEditModalContainer);
		toggleCssDisplayPropertyBetweenNoneAndBlock(listItemEditModal[index]);
		setTimeout(()=>{
			listItemEditModalHeaderAndForm[index].classList.add('list-item-edit-modal-header-and-form-container-show')
			listItemEditModal[index].classList.add('popup-backdrop-in-use');
			setTimeout(()=>{
				focusAndSelect(editListItemEntryFormNameInput[index]);
			}, 250);
		}, 250);
};

function addInlineEditModalEventListeners(index, thisObject){
	thisObject.inlineEditHandleEscapeKeyBound = inlineEditHandleEscapeKey.bind(thisObject);
		listItemEditForm[index].addEventListener('submit', listItemSubmitButtonSubmitEventHandler);
		listItemEditCancelButton[index].addEventListener('click', listItemCancelButtonClickEventHandler);
		document.addEventListener('keydown', thisObject.inlineEditHandleEscapeKeyBound);
		listItemEditModal[index].addEventListener('click', inlineEditHandleClicksOutsideElement);
		firstItemEditModalInput[index].addEventListener('keydown', inlineEditFirstInputFocusTrapping);
		lastItemEditModalInput[index].addEventListener('keydown', inlineEditLastInputFocusTrapping);
};

function listItemDeleteButtonEscapeKeydownEventHandler(event){
	const index = this.value;
	if(event.key==='Escape'){
		removeInertAttribute(topBarContainer);
		listItemContainerItemTextInput.forEach((item)=>{
			removeInertAttribute(item);
		});
		listItemContainerDueDateInput.forEach((item)=>{
			removeInertAttribute(item);
		});
		listItemEditButton.forEach((item)=>{
			removeInertAttribute(item);
		});
		listItemDeleteButton.forEach((item)=>{
			removeInertAttribute(item);
		});
		removeInertAttribute(newListItemEntryFormContainer);
		document.removeEventListener('keydown', this.listItemDeleteButtonEscapeKeydownEventHandlerBound, false);
		document.body.removeEventListener('click', this.listItemDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound, false);
		listItemDeleteConfirmationCancelButton[index].removeEventListener('click', this.listItemDeleteConfirmationCancelButtonClickEventHandlerBound, false);
		listItemDeleteConfirmationContainer[index].classList.remove('to-do-list-item-delete-confirmation-container-show');
		listItemDeleteConfirmationContainerBackdrop[index].classList.remove('to-do-list-item-delete-confirmation-container-backdrop-in-use');
		setTimeout(()=>{
			toggleCssDisplayPropertyBetweenNoneAndBlock(listItemDeleteConfirmationContainerBackdrop[index]);
		}, 250);
	}else if(event.key==='Enter'){
		listItemDeleteForm[index].submit();
	};
};

function listItemDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandler(event){
	const clickTarget = event.target;
	const index = this.value;
	if(!listItemDeleteConfirmationContainer[index].contains(clickTarget)) {
		shakeElement(listItemDeleteConfirmationContainer[index]);
	};
};

function listItemDeleteConfirmationCancelButtonClickEventHandler(event){
	const index = this.value;
	removeInertAttribute(topBarContainer);
	listItemContainerItemTextInput.forEach((item)=>{
		removeInertAttribute(item);
	});
	listItemContainerDueDateInput.forEach((item)=>{
		removeInertAttribute(item);
	});
	listItemEditButton.forEach((item)=>{
		removeInertAttribute(item);
	});
	listItemDeleteButton.forEach((item)=>{
		removeInertAttribute(item);
	});
	removeInertAttribute(newListItemEntryFormContainer);
	document.removeEventListener('keydown', this.listItemDeleteButtonEscapeKeydownEventHandlerBound, false);
	document.body.removeEventListener('click', this.listItemDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound, false);
	listItemDeleteConfirmationCancelButton[index].removeEventListener('click', this.listItemDeleteConfirmationCancelButtonClickEventHandlerBound, false);
	listItemDeleteConfirmationContainer[index].classList.remove('to-do-list-item-delete-confirmation-container-show');
	listItemDeleteConfirmationContainerBackdrop[index].classList.remove('to-do-list-item-delete-confirmation-container-backdrop-in-use');
	setTimeout(()=>{
		toggleCssDisplayPropertyBetweenNoneAndBlock(listItemDeleteConfirmationContainerBackdrop[index]);
	}, 250);
};

function showInlineDeleteConfirmationContainer(index){
	toggleCssDisplayPropertyBetweenNoneAndBlock(listItemDeleteConfirmationContainerBackdrop[index]);
		addInertAttribute(topBarContainer);
		listItemContainerItemTextInput.forEach((item)=>{
			addInertAttribute(item);
		});
		listItemContainerDueDateInput.forEach((item)=>{
			addInertAttribute(item);
		});
		listItemEditButton.forEach((item)=>{
			addInertAttribute(item);
		});
		listItemDeleteButton.forEach((item)=>{
			addInertAttribute(item);
		});
		addInertAttribute(newListItemEntryFormContainer);
		setTimeout(()=>{
			listItemDeleteConfirmationContainerBackdrop[index].classList.add('to-do-list-item-delete-confirmation-container-backdrop-in-use');
			listItemDeleteConfirmationContainer[index].classList.add('to-do-list-item-delete-confirmation-container-show');
		}, 250);
};

function addInlineDeleteConfirmationEventListeners(index, thisObject){
	thisObject.listItemDeleteButtonEscapeKeydownEventHandlerBound = listItemDeleteButtonEscapeKeydownEventHandler.bind(thisObject);
		thisObject.listItemDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound = listItemDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandler.bind(thisObject);
		thisObject.listItemDeleteConfirmationCancelButtonClickEventHandlerBound = listItemDeleteConfirmationCancelButtonClickEventHandler.bind(thisObject);
		document.addEventListener('keydown', thisObject.listItemDeleteButtonEscapeKeydownEventHandlerBound, false);
		document.body.addEventListener('click', thisObject.listItemDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound, false);
		listItemDeleteConfirmationCancelButton[index].addEventListener('click', thisObject.listItemDeleteConfirmationCancelButtonClickEventHandlerBound, false);
};

function handleClicksOutsideNewListItemEntryFormContainer(event){
	const clickTarget = event.target;
	if(!newListItemEntryFormContainer.contains(clickTarget) && !newListItemEntryFormShowButtonContainer.contains(clickTarget)) {
		newListItemEntryFormContainer.classList.remove('entry-form-container-in-use');
		newListItemEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
		removeInertAttribute(newListItemEntryFormShowButton);
		removeInertAttribute(topBarContainer);
		removeInertAttribute(listItemsContainer);
		document.body.removeEventListener('click', handleClicksOutsideNewListItemEntryFormContainer);
		newListItemEntryFormUnder700px.removeEventListener('submit', newListItemEntryFormUnder700pxSubmitEventHandler);
	};
};

function handleNewListItemEscapeKey(event){
	if(event.key==='Escape'){
		newListItemEntryFormContainer.classList.remove('entry-form-container-in-use');
		newListItemEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
		removeInertAttribute(newListItemEntryFormShowButton);
		removeInertAttribute(topBarContainer);
		removeInertAttribute(listItemsContainer);
		document.body.removeEventListener('click', handleClicksOutsideNewListItemEntryFormContainer);
		document.removeEventListener('keydown', handleNewListItemEscapeKey);
		newListItemEntryForm.removeEventListener('submit', newListItemEntryFormUnder700pxSubmitEventHandler);
	};
};

function newListItemEntryFormUnder700pxSubmitEventHandler(event){
	event.preventDefault();
	newListItemEntryFormContainer.classList.remove('entry-form-container-in-use');
	newListItemEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
	removeInertAttribute(newListItemEntryFormShowButton);
	removeInertAttribute(topBarContainer);
	removeInertAttribute(listItemsContainer);
	document.body.removeEventListener('click', handleClicksOutsideNewListItemEntryFormContainer);
	newListItemEntryFormUnder700px.removeEventListener('submit', newListItemEntryFormUnder700pxSubmitEventHandler);
	setTimeout(()=>{
		newListItemEntryFormUnder700px.submit();
	}, 250);
};

// Event handlers ----------------------------------------------------------------
// Build/insert dummy list items/separators if not enough list items exist to reach listItemsContainer client height
function addDummyListItems(event){
	if(listItemsContainer.scrollHeight<=listItemsContainer.clientHeight){
		while(listItemsContainer.scrollHeight<=listItemsContainer.clientHeight){
			const dummyListItem=document.createElement('div');
			dummyListItem.classList.add('to-do-list-item-container');
			const dummyFormCompletedAndName=document.createElement('div');
			dummyFormCompletedAndName.classList.add('to-do-list-item-completed-form-and-item-text-container');
			const dummyFormCompleted=document.createElement('form');
			dummyFormCompleted.classList.add('to-do-list-item-completed-form');
			dummyFormCompletedAndName.appendChild(dummyFormCompleted);
			const dummyVerticalHr=document.createElement('hr');
			dummyVerticalHr.classList.add('to-do-list-vertical-hr');
			dummyFormCompletedAndName.appendChild(dummyVerticalHr);
			const dummyFormName=document.createElement('form');
			dummyFormName.classList.add('to-do-list-item-text-inline-edit-form');
			dummyFormCompletedAndName.appendChild(dummyFormName);
			const dummyDetailsContainer=document.createElement('div');
			dummyDetailsContainer.classList.add('to-do-list-details-container');
			const dummyDetailsDueDate=document.createElement('form');
			dummyDetailsDueDate.classList.add('to-do-list-item-due-date-inline-edit-form');
			dummyDetailsContainer.appendChild(dummyDetailsDueDate);
			const dummyDetailsPriority=document.createElement('form');
			dummyDetailsPriority.classList.add('to-do-list-item-priority-inline-edit-form');
			dummyDetailsContainer.appendChild(dummyDetailsPriority);
			const dummyDetailsEdit=document.createElement('div');
			dummyDetailsEdit.classList.add('to-do-list-item-edit-button-container');
			dummyDetailsContainer.appendChild(dummyDetailsEdit);
			const dummyDetailsDelete=document.createElement('form');
			dummyDetailsDelete.classList.add('to-do-list-item-delete-button-container');
			dummyDetailsContainer.appendChild(dummyDetailsDelete);
			dummyListItem.appendChild(dummyFormCompletedAndName);
			dummyListItem.appendChild(dummyDetailsContainer);
			const dummySeparator=document.createElement('hr');
			dummySeparator.classList.add('to-do-list-list-separator');
			const dummySeparatorLifted=document.createElement('hr');
			dummySeparatorLifted.classList.add('to-do-list-list-separator-lifted');
			listItemsContainer.appendChild(dummyListItem);
			listItemsContainer.appendChild(dummySeparator);
			listItemsContainer.appendChild(dummySeparatorLifted);
		};
	};
};

// If tab key is pressed while no element is focused, focus is forced to tabindex="1"
function tabKeyOnDocumentEventHandler(event){
	if(event.key==='Tab'){
		if(document.activeElement===document.body){
			event.preventDefault();
			const newListItemEntryFormShowButtonDisplayValue = getCssPropertyValue(newListItemEntryFormShowButtonContainer, 'display');
			const newListItemEntryFormShowButtonPositionPixelValue = getCssPropertyValueAndTrimUnit(newListItemEntryFormShowButtonContainer, 'right');
			if(displayNotEqualToNone(newListItemEntryFormShowButtonDisplayValue)){
				if(elementIsVisible(newListItemEntryFormShowButtonPositionPixelValue)){
					newListItemEntryFormShowButton.focus({focusVisible: true});
				}else{
					newListItemEntryFormUnder700px.querySelector('[tabindex="1"]').focus();
				};
			}else{
				newListItemEntryForm.querySelector('[tabindex="1"]').focus();
			};
		};
	};
};

// New list item form focus first input on keyboard combo
	// Also hides new list entry show button and shows entry form if form is hidden on smaller screen sizes
function focusFirstInput(event){
	if((event.altKey)&&(event.code=="KeyN")){
		stopPropagationAndPreventDefault(event);
		const newListItemEntryFormDisplayValue = getCssPropertyValue(newListItemEntryForm, 'display');
		const newListItemEntryFormShowButtonPositionPixelValue = getCssPropertyValueAndTrimUnit(newListItemEntryFormShowButtonContainer, 'right');
		if(displayNotEqualToNone(newListItemEntryFormDisplayValue)){
			if(elementIsVisible(newListItemEntryFormShowButtonPositionPixelValue)){
				showNewListItemEntryPane(newListItemEntryFormNameInput);
			}else{
				focusAndSelect(newListItemEntryFormNameInput);
			};
		}else{
			if(elementIsVisible(newListItemEntryFormShowButtonPositionPixelValue)){
				showNewListItemEntryPane(newListItemEntryFormNameInputUnder700px);
			}else{
				focusAndSelect(newListItemEntryFormNameInputUnder700px);
			};
		};
	};
};

// Main page focus trapping (looping from last inline delete button back to new list name input)
function deleteButtonLastKeydownEventHandler(event){
	if(event.key==='Tab'){
		event.preventDefault();
		const newListItemEntryFormContainerVisibility = getCssPropertyValue(newListItemEntryFormContainer, 'visibility');
		const newListItemEntryFormDisplayValue = getCssPropertyValue(newListItemEntryForm, 'display');
		const newListItemEntryFormShowButtonDisplayValue = getCssPropertyValue(newListItemEntryFormShowButtonContainer, 'display');
		if(displayNotEqualToNone(newListItemEntryFormShowButtonDisplayValue)){
			newListItemEntryFormShowButton.focus({focusVisible: true});
		}else{
			if(displayNotEqualToNone(newListItemEntryFormDisplayValue)){
				focusAndSelect(newListItemEntryFormNameInput);
			}else{
				focusAndSelect(newListItemEntryFormNameInputUnder400px);
			};
		};
	};
};

// Top bar user name input focus, blur and keydown listeners
function topBarUserNameInputFocusEventHandler(event){
	topBarListNameInput.select();
	function topBarUserNameInputBlurEventListener(event){
		topBarListNameInput.value = topBarListNameInputCurrentValue;
		topBarListNameInput.removeEventListener('blur', topBarUserNameInputBlurEventListener);
		topBarListNameInput.removeEventListener('keydown', topBarUserNameInputKeydownEventHandler);
	};
	function topBarUserNameInputKeydownEventHandler(event){
		if(event.key==='Escape'){
			topBarListNameInput.blur();
		};
	};
	topBarListNameInput.addEventListener('blur', topBarUserNameInputBlurEventListener);
	topBarListNameInput.addEventListener('keydown', topBarUserNameInputKeydownEventHandler);
};

// List item entry inline display section inputs
	// Inline item completed
function listItemContainerItemCompletedInputChangeEventHandler(event){
	event.preventDefault();
	if(event.target.checked===true){
		event.target.value=true;
	}else if(event.target.checked===false){
		event.target.value=false;
	};
	this.form.submit();
};
	// Inline text
function listItemContainerItemTextInputFocusEventHadler(event){
	this.select();
	var currentValue = this.value;
	function listItemContainerItemTextInputBlurEventHandler(event){
		this.value = currentValue;
		this.removeEventListener('blur', listItemContainerItemTextInputBlurEventHandler);
		this.removeEventListener('keydown', listItemContainerItemTextInputKeydownEventHandler);
	};
	function listItemContainerItemTextInputKeydownEventHandler(event){
		if(event.key==='Escape'){
			this.blur();
		};
	};
	this.addEventListener('blur', listItemContainerItemTextInputBlurEventHandler);
	this.addEventListener('keydown', listItemContainerItemTextInputKeydownEventHandler);
};

	// Inline due date
function listItemContainerDueDateInputShowPickerButtonClickEventHandler(event){
	const index = this.value;
	listItemContainerDueDateInput[index].showPicker();
};

function listItemContainerDueDateInputChangeEventListener(event){
	this.form.submit();
};

function listItemContainerDueDateInputBlurEventListener(event){
	this.value = currentValue;
};

function listItemContainerDueDateInputKeydownEventHandler(event){
	if(event.key==='Escape'){
		this.blur();
	}else if(event.key==='Enter'){
		this.form.submit();
	};
};

	// Inline priority
function listItemContainerPriorityInputShowButtonClickEventHandler(event){
	const index = this.value;
	event.stopPropagation();
	this.classList.add('to-do-list-item-priority-inline-edit-show-button-show');
	listItemContainerPriorityForm[index].classList.add('to-do-list-item-priority-inline-edit-form-show');
	listItemContainerPriorityInputContainer[index].classList.add('to-do-list-item-priority-inline-edit-container-show');
	listItemContainerPriorityInputContainer[index].focus();
	function handleEscapeKey(event){
		if(event.key==='Escape') {
			listItemContainerPriorityInputContainer[index].blur();
		};
	};
	listItemContainerPriorityInputContainer[index].addEventListener('keydown', handleEscapeKey);
};

function listItemContainerPriorityInputContainerBlurEventHandler(event){
	const index = this.dataset.index;
	this.classList.remove('to-do-list-item-priority-inline-edit-container-show');
	listItemContainerPriorityForm[index].classList.remove('to-do-list-item-priority-inline-edit-form-show');
	listItemContainerPriorityInputShowButton[index].classList.remove('to-do-list-item-priority-inline-edit-show-button-show');
};

function listItemContainerPriorityInputChangeEventHandler(event){
	this.form.submit();
};

	// Inline edit button
function listItemEditButtonClickEventHandler(event){
	const index = this.value;
	showInlineEditModal(index);
	addInlineEditModalEventListeners(index, this);
};

	// Inline delete button
function listItemDeleteButtonClickEventHandler(event){
	const index = this.value;
	showInlineDeleteConfirmationContainer(index);
	addInlineDeleteConfirmationEventListeners(index, this);
};

// New list item entry section ----------------------------------------------------------------
	// Form show button
function newListItemEntryFormShowButtonClickEventHandler(event){
	newListItemEntryFormShowButtonContainer.classList.add('entry-form-show-button-container-after-clicked');
	newListItemEntryFormContainer.classList.add('entry-form-container-in-use');
	setTimeout(()=>{
		const newListItemEntryFormDisplayValue = window.getComputedStyle(newListItemEntryForm).display;
		if(newListItemEntryFormDisplayValue!=='none'){
			focusAndSelect(newListItemEntryFormNameInput);
		}else{
			focusAndSelect(newListItemEntryFormNameInputUnder700px);
		};
		addInertAttribute(newListItemEntryFormShowButton);
		addInertAttribute(topBarContainer);
		addInertAttribute(listItemsContainer);
	}, 250);
	document.body.addEventListener('click', handleClicksOutsideNewListItemEntryFormContainer);
	document.addEventListener('keydown', handleNewListItemEscapeKey);
	newListItemEntryFormUnder700px.addEventListener('submit', newListItemEntryFormUnder700pxSubmitEventHandler);
};

	// Due date watcher
function listItemEntryDateInputChangeEventHandler(event){
	const index = Array.from(listItemEntryDateInput).indexOf(this);
	if (listItemEntryDateInput[index].value == "") {
		listItemEntryDateInputShowPickerButton[index].innerHTML = `
			<img class="to-do-list-entry-form-item-due-date-picker-show-button-icon" src="/images/calendar-icon-blank.png" alt="Click to enter a due date">
			`;
	} else {
		const [year, month, day] = listItemEntryDateInput[index].value.split('-');
		const displayDay = day;
		const  displayMonth = convertMonthNumberToLetterAbbreviation(month);
		listItemEntryDateInputShowPickerButton[index].innerHTML = `
			<img class="to-do-list-entry-form-item-due-date-picker-show-button-icon" src="/images/calendar-icon-blank.png" alt="Click to enter a due date">
			<div class="to-do-list-entry-form-item-due-date-picker-show-button-month-day-display-container">
				<div class="to-do-list-entry-form-item-due-date-picker-show-button-month-container">
					<span class="to-do-list-entry-form-item-due-date-picker-show-button-month">${displayMonth}</span>
				</div>
				<div class="to-do-list-entry-form-item-due-date-picker-show-button-day-container">
					<span class="to-do-list-entry-form-item-due-date-picker-show-button-day">${displayDay}</span>
				</div>
			</div>
		`;
		setTimeout(()=>{
			const monthDayContainer=document.querySelector('.to-do-list-entry-form-item-due-date-picker-show-button-month-day-display-container');
			monthDayContainer.style.opacity='1';
		},50);
	};
};

	// Show due date picker button
function listItemEntryDateInputShowPickerButtonClickEventHandler(event){
	const index = Array.from(listItemEntryDateInputShowPickerButton).indexOf(this);
	event.stopPropagation();
	listItemEntryDateInput[index].showPicker();
};

	// First priority radio option automatic selection
function listItemEntryPriorityStar1FocusEventHandler(event){
	stopPropagationAndPreventDefault(event);
	this.checked = true;
};

	// New list entry focus trapping
function newListItemEntryFormNameInputKeydownEventHandler(event){
	if(event.key == "Tab" && event.shiftKey){
		stopPropagationAndPreventDefault(event);
		newListItemEntryFormSubmitButton[0].focus({focusVisible: true});
	};
};

function newListItemEntryFormNameInputUnder700pxKeydownEventHandler(event){
	if(event.key == "Tab" && event.shiftKey){
		stopPropagationAndPreventDefault(event);
		newListItemEntryFormSubmitButton[1].focus({focusVisible: true});
	};
};

function newListItemEntryFormSubmitButtonKeydownEventHandler(event){
	if(event.key=== "Tab" && event.shiftKey){
		stopPropagationAndPreventDefault(event);
		const newListItemEntryFormDisplayValue = window.getComputedStyle(newListItemEntryForm).display;
		if(newListItemEntryFormDisplayValue!=='none'){
			newListItemEntryFormPriorityInputStar1[0].focus();
		}else{
			newListItemEntryFormPriorityInputStar1[1].focus();
		};
	}else if(event.key=== "Tab"){
		stopPropagationAndPreventDefault(event);
		const newListItemEntryFormDisplayValue = window.getComputedStyle(newListItemEntryForm).display;
		if(newListItemEntryFormDisplayValue!=='none'){
			burgerMenu.focus();
		}else{
			focusAndSelect(newListItemEntryFormNameInputUnder700px);
		};
	};
};

function listBackButtonClickEventHandler(event){
	stopPropagationAndPreventDefault(event);
	window.location.href = '/to-do-list/lists';
};

globalizeVariables({
	addDummyListItems,
	tabKeyOnDocumentEventHandler,
	focusFirstInput,
	deleteButtonLastKeydownEventHandler,
	topBarUserNameInputFocusEventHandler,
	listItemContainerItemCompletedInputChangeEventHandler,
	listItemContainerItemTextInputFocusEventHadler,
	listItemContainerDueDateInputShowPickerButtonClickEventHandler,
	listItemContainerDueDateInputChangeEventListener,
	listItemContainerDueDateInputBlurEventListener,
	listItemContainerDueDateInputKeydownEventHandler,
	listItemContainerPriorityInputShowButtonClickEventHandler,
	listItemContainerPriorityInputContainerBlurEventHandler,
	listItemContainerPriorityInputChangeEventHandler,
	listItemEditButtonClickEventHandler,
	listItemDeleteButtonEscapeKeydownEventHandler,
	listItemDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandler,
	listItemDeleteConfirmationCancelButtonClickEventHandler,
	listItemDeleteButtonClickEventHandler,
	newListItemEntryFormShowButtonClickEventHandler,
	newListItemEntryFormUnder700pxSubmitEventHandler,
	listItemEntryDateInputChangeEventHandler,
	listItemEntryDateInputShowPickerButtonClickEventHandler,
	listItemEntryPriorityStar1FocusEventHandler,
	newListItemEntryFormNameInputKeydownEventHandler,
	newListItemEntryFormNameInputUnder700pxKeydownEventHandler,
	newListItemEntryFormSubmitButtonKeydownEventHandler,
	listBackButtonClickEventHandler
});
