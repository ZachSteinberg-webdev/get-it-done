// Imports ----------------------------------------------------------------
import './toDoLists.js';
import {shrinkTextToFitWhenTyping} from './textShrinker.js';
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './burgerMenu.js';
import './userSettings.js';

// Common functions within document ----------------------------------------------------------------
function showNewListEntryPane(){
	function handleClicksOutsideElement (event){
		if(userClickedOutsideElement(newListEntryFormContainer)) {
			newListEntryFormContainer.classList.remove('entry-form-container-in-use');
			newListEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
			removeInertAttribute(topBarContainer);
			removeInertAttribute(listsContainer);
			document.body.removeEventListener('click', handleClicksOutsideElement);
		};
	};
	addInertAttribute(topBarContainer);
	addInertAttribute(listsContainer);
	newListEntryFormShowButtonContainer.classList.add('entry-form-show-button-container-after-clicked');
	newListEntryFormContainer.classList.add('entry-form-container-in-use');
	setTimeout(()=>{
		focusAndSelect(element2);
	}, 250);
	document.body.addEventListener('click', handleClicksOutsideElement);
};

function hideNewListEntryPane(){
	newListEntryFormContainer.classList.remove('entry-form-container-in-use');
	newListEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
	removeInertAttribute(newListEntryFormShowButton);
	removeInertAttribute(topBarContainer);
	removeInertAttribute(listsContainer);
	document.body.removeEventListener('click', handleClicksOutsideNewListEntryForm);
	document.removeEventListener('keydown', handleEscapeKey);
	newListEntryForm.removeEventListener('submit', handleNewListSubmitEvent);
};

function handleClicksOutsideNewListEntryForm(event){
	if(userClickedOutsideElement(newListEntryFormContainer) && userClickedOutsideElement(newListEntryFormShowButtonContainer)) {
		hideNewListEntryPane();
	};
};

function handleNewListSubmitEvent(event){
	event.preventDefault();
		newListEntryFormContainer.classList.remove('entry-form-container-in-use');
		newListEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
		removeInertAttribute(newListEntryFormShowButton);
		removeInertAttribute(topBarContainer);
		removeInertAttribute(listsContainer);
		document.body.removeEventListener('click', handleClicksOutsideNewListEntryForm);
		document.removeEventListener('keydown', handleEscapeKey);
		newListEntryForm.removeEventListener('submit', handleNewListSubmitEvent);
		setTimeout(()=>{
			newListEntryForm.submit();
		}, 250);
};

function handleNewListEscapeKey(event){
	if(event.key==='Escape'){
		newListEntryFormContainer.classList.remove('entry-form-container-in-use');
		newListEntryFormShowButtonContainer.classList.remove('entry-form-show-button-container-after-clicked');
		removeInertAttribute(newListEntryFormShowButton);
		removeInertAttribute(topBarContainer);
		removeInertAttribute(listsContainer);
		document.body.removeEventListener('click', handleClicksOutsideNewListEntryForm);
		document.removeEventListener('keydown', handleNewListEscapeKey);
		newListEntryForm.removeEventListener('submit', handleNewListSubmitEvent);
	};
};

function inlineEditSubmitEventHandler(event){
	const listArrayIndex = this.dataset.index;
	stopPropagationAndPreventDefault(event);
	toggleInertAttribute(listEditModalContainer);
	listEditForm[listArrayIndex].classList.remove('list-edit-form-in-use');
	listEditModal[listArrayIndex].classList.remove('list-edit-modal-backdrop-in-use');
	listEditForm[listArrayIndex].removeEventListener('submit', inlineEditSubmitEventHandler);
	listEditCancelButton[listArrayIndex].removeEventListener('click', inlineEditCancelButtonClickEventHandler);
	document.removeEventListener('keydown', this.inlineEditHandleEscapeKeyBound);
	listEditModal[listArrayIndex].removeEventListener('click', handleClicksOutsideInlineEditModal);
	firstListEditModalInput[listArrayIndex].removeEventListener('keydown', inlineEditFirstInputFocusTrapping);
	lastListEditModalInput[listArrayIndex].removeEventListener('keydown', inlineEditLastInputFocusTrapping);
	setTimeout(()=>{
		changeCssProperty(listEditModal[listArrayIndex], 'display', 'none');
		listEditForm[listArrayIndex].submit();
	}, 250);
};
function inlineEditCancelButtonClickEventHandler(event){
	const listArrayIndex=this.dataset.index;
	stopPropagationAndPreventDefault(event);
	toggleInertAttribute(listEditModalContainer);
	listEditForm[listArrayIndex].classList.remove('list-edit-form-in-use');
	listEditModalHeader[listArrayIndex].classList.remove('list-edit-modal-form-header-in-use');
	listEditModal[listArrayIndex].classList.remove('list-edit-modal-backdrop-in-use');
	listEditForm[listArrayIndex].removeEventListener('submit', inlineEditSubmitEventHandler);
	listEditCancelButton[listArrayIndex].removeEventListener('click', inlineEditCancelButtonClickEventHandler);
	document.removeEventListener('keydown', this.inlineEditHandleEscapeKeyBound);
	listEditModal[listArrayIndex].removeEventListener('click', handleClicksOutsideInlineEditModal);
	firstListEditModalInput[listArrayIndex].removeEventListener('keydown', inlineEditFirstInputFocusTrapping);
	lastListEditModalInput[listArrayIndex].removeEventListener('keydown', inlineEditLastInputFocusTrapping);
	setTimeout(()=>{
		changeCssProperty(listEditModal[listArrayIndex], 'display', 'none');
	}, 250);
};
function inlineEditHandleEscapeKey(event){
	const listArrayIndex = this.value;
	if(getCssPropertyValue(listEditModal[listArrayIndex], 'display')=="block"){
		if(event.key==="Escape"){
			stopPropagationAndPreventDefault(event);
			// stopPropagation(event);
			toggleInertAttribute(listEditModalContainer);
			listEditForm[listArrayIndex].classList.remove('list-edit-form-in-use');
			listEditModalHeader[listArrayIndex].classList.remove('list-edit-modal-form-header-in-use');
			listEditModal[listArrayIndex].classList.remove('list-edit-modal-backdrop-in-use');
			listEditForm[listArrayIndex].removeEventListener('submit', inlineEditSubmitEventHandler);
			listEditCancelButton[listArrayIndex].removeEventListener('click', inlineEditCancelButtonClickEventHandler);
			document.removeEventListener('keydown', this.inlineEditHandleEscapeKeyBound);
			listEditModal[listArrayIndex].removeEventListener('click', handleClicksOutsideInlineEditModal);
			firstListEditModalInput[listArrayIndex].removeEventListener('keydown', inlineEditFirstInputFocusTrapping);
			lastListEditModalInput[listArrayIndex].removeEventListener('keydown', inlineEditLastInputFocusTrapping);
			setTimeout(()=>{
				changeCssProperty(listEditModal[listArrayIndex], 'display', 'none');
			}, 250);
		};
	};
};

function handleClicksOutsideInlineEditModal(event){
	const listArrayIndex = this.dataset.index;
	if(userClickedOutsideElement(listEditModalHeaderAndForm[listArrayIndex])) {
		shakeElement(listEditModalHeaderAndForm[listArrayIndex]);
	};
};

function inlineEditFirstInputFocusTrapping(event){
	const listArrayIndex = this.dataset.index;
	if(document.activeElement == firstListEditModalInput[listArrayIndex]){
		if(event.key == "Tab" && event.shiftKey){
			stopPropagationAndPreventDefault(event);
			lastListEditModalInput[listArrayIndex].focus({focusVisible: true});
		};
	};
};

function inlineEditLastInputFocusTrapping(event){
	const index = this.dataset.index;
	if(document.activeElement == lastListEditModalInput[listArrayIndex]){
		if(event.key == "Tab" && event.shiftKey){
			stopPropagationAndPreventDefault(event);
			secondToLastListEditModalInput[listArrayIndex].focus({focusVisible: true});
		}else if(event.key == "Tab"){
			stopPropagationAndPreventDefault(event);
			firstListEditModalInput[listArrayIndex].focus({focusVisible: true});
		};
	};
};

function showInlineEditModal(listArrayIndex){
	toggleInertAttribute(listEditModalContainer);
		changeCssProperty(listEditModal[listArrayIndex], 'display', 'block');
		setTimeout(()=>{
			listEditModal[listArrayIndex].classList.add('list-edit-modal-backdrop-in-use');
			listEditModalHeader[listArrayIndex].classList.add('list-edit-modal-form-header-in-use');
			listEditForm[listArrayIndex].classList.add('list-edit-form-in-use');
			setTimeout(()=>{
				focusAndSelect(firstListEditModalInput[listArrayIndex]);
			}, 250);
		}, 250);
};

function addInlineEditModalEventListeners(listArrayIndex, thisObject){
	thisObject.inlineEditHandleEscapeKeyBound = inlineEditHandleEscapeKey.bind(thisObject);
	listEditForm[listArrayIndex].addEventListener('submit', inlineEditSubmitEventHandler);
	listEditCancelButton[listArrayIndex].addEventListener('click', inlineEditCancelButtonClickEventHandler);
	document.addEventListener('keydown', thisObject.inlineEditHandleEscapeKeyBound);
	listEditModal[listArrayIndex].addEventListener('click', handleClicksOutsideInlineEditModal);
	firstListEditModalInput[listArrayIndex].addEventListener('keydown', inlineEditFirstInputFocusTrapping);
	lastListEditModalInput[listArrayIndex].addEventListener('keydown', inlineEditLastInputFocusTrapping);
};

function listsContainerlistNameDeleteButtonEscapeKeydownEventHandler(event){
	const index = this.value;
	if(event.key==='Escape'){
		removeInertAttribute(topBarContainer);
		listsContainerlistNameTextInput.forEach((item)=>{
			removeInertAttribute(item);
		});
		listsContainerlistNameCategoryInput.forEach((item)=>{
			removeInertAttribute(item);
		});
		listsContainerlistNameViewButton.forEach((item)=>{
			removeInertAttribute(item);
		});
		listsContainerlistNameEditButton.forEach((item)=>{
			removeInertAttribute(item);
		});
		listsContainerlistNameDeleteButton.forEach((item)=>{
			removeInertAttribute(item);
		});
		removeInertAttribute(newListEntryFormContainer);
		document.removeEventListener('keydown', this.listsContainerlistNameDeleteButtonEscapeKeydownEventHandlerBound, false);
		document.body.removeEventListener('click', this.listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound, false);
		listsContainerlistNameDeleteConfirmationCancelButton[index].removeEventListener('click', this.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
		listsContainerlistNameDeleteConfirmationCancelButtonUnder400px[index].removeEventListener('click', this.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
		listsContainerlistNameDeleteConfirmationContainerBackdrop[index].classList.remove('to-do-lists-delete-confirmation-container-backdrop-in-use');
		listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px[index].classList.remove('to-do-lists-delete-confirmation-container-backdrop-under-400-px-width-in-use');
		listsContainerlistNameDeleteConfirmationContainer[index].classList.remove('to-do-lists-delete-confirmation-container-show');
		listsContainerlistNameDeleteConfirmationContainerUnder400px[index].classList.remove('to-do-lists-delete-confirmation-container-show');
		setTimeout(()=>{
			changeCssProperty(listsContainerlistNameDeleteConfirmationContainerBackdrop[index], 'display', 'none');
			changeCssProperty(listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px[index], 'display', 'none');
		}, 250);
	}else if(event.key==='Enter'){
		listsContainerlistNameDeleteForm[index].submit();
	};
};

function listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandler(event){
	const clickTarget = event.target;
	const index = this.value;
	if(!listsContainerlistNameDeleteConfirmationContainer[index].contains(clickTarget)) {
		shakeElement(listsContainerlistNameDeleteConfirmationContainer[index]);
	};
	if(!listsContainerlistNameDeleteConfirmationContainerUnder400px[index].contains(clickTarget)) {
		shakeElement(listsContainerlistNameDeleteConfirmationContainerUnder400px[index]);
	};
};

function listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandler(event){
	const index = this.value;
	removeInertAttribute(topBarContainer);
	listsContainerlistNameTextInput.forEach((item)=>{
		removeInertAttribute(item);
	});
	listsContainerlistNameCategoryInput.forEach((item)=>{
		removeInertAttribute(item);
	});
	listsContainerlistNameViewButton.forEach((item)=>{
		removeInertAttribute(item);
	});
	listsContainerlistNameEditButton.forEach((item)=>{
		removeInertAttribute(item);
	});
	listsContainerlistNameDeleteButton.forEach((item)=>{
		removeInertAttribute(item);
	});
	removeInertAttribute(newListEntryFormContainer);
	document.removeEventListener('keydown', this.listsContainerlistNameDeleteButtonEscapeKeydownEventHandlerBound, false);
	document.body.removeEventListener('click', this.listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound, false);
	listsContainerlistNameDeleteConfirmationCancelButton[index].removeEventListener('click', this.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
	listsContainerlistNameDeleteConfirmationCancelButtonUnder400px[index].removeEventListener('click', this.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
	listsContainerlistNameDeleteConfirmationContainerBackdrop[index].classList.remove('to-do-lists-delete-confirmation-container-backdrop-in-use');
	listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px[index].classList.remove('to-do-lists-delete-confirmation-container-backdrop-under-400-px-width-in-use');
	listsContainerlistNameDeleteConfirmationContainer[index].classList.remove('to-do-lists-delete-confirmation-container-show');
	listsContainerlistNameDeleteConfirmationContainerUnder400px[index].classList.remove('to-do-lists-delete-confirmation-container-show');
	setTimeout(()=>{
		changeCssProperty(listsContainerlistNameDeleteConfirmationContainerBackdrop[index], 'display', 'none');
		changeCssProperty(listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px[index], 'display', 'none');
	}, 250);
};

function showInlineDeleteConfirmationContainer(index){
	changeCssProperty(listsContainerlistNameDeleteConfirmationContainerBackdrop[index], 'display', 'block');
	addInertAttribute(topBarContainer);
	listsContainerlistNameTextInput.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameCategoryInput.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameViewButton.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameEditButton.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameDeleteButton.forEach((item)=>{
		addInertAttribute(item);
	});
	addInertAttribute(newListEntryFormContainer);
	setTimeout(()=>{
		listsContainerlistNameDeleteConfirmationContainerBackdrop[index].classList.add('to-do-lists-delete-confirmation-container-backdrop-in-use');
		listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px[index].classList.add('to-do-lists-delete-confirmation-container-backdrop-under-400-px-width-in-use');
		listsContainerlistNameDeleteConfirmationContainer[index].classList.add('to-do-lists-delete-confirmation-container-show');
		listsContainerlistNameDeleteConfirmationContainerUnder400px[index].classList.add('to-do-lists-delete-confirmation-container-show');
	}, 250);
};

function addInlineDeleteConfirmationEventListeners(index, thisObject){
	thisObject.listsContainerlistNameDeleteButtonEscapeKeydownEventHandlerBound = listsContainerlistNameDeleteButtonEscapeKeydownEventHandler.bind(thisObject);
		thisObject.listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound = listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandler.bind(thisObject);
		thisObject.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound = listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandler.bind(thisObject);
		document.addEventListener('keydown', thisObject.listsContainerlistNameDeleteButtonEscapeKeydownEventHandlerBound, false);
		document.body.addEventListener('click', thisObject.listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound, false);
		listsContainerlistNameDeleteConfirmationCancelButton[index].addEventListener('click', thisObject.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
		listsContainerlistNameDeleteConfirmationCancelButtonUnder400px[index].addEventListener('click', thisObject.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
};

function showInlineDeleteConfirmationContainerUnder400px(index){
	changeCssProperty(listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px[index], 'display', 'block');
	addInertAttribute(topBarContainer);
	listsContainerlistNameTextInput.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameCategoryInput.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameViewButton.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameEditButton.forEach((item)=>{
		addInertAttribute(item);
	});
	listsContainerlistNameDeleteButton.forEach((item)=>{
		addInertAttribute(item);
	});
	addInertAttribute(newListEntryFormContainer);
	setTimeout(()=>{
		listsContainerlistNameDeleteConfirmationContainerBackdrop[index].classList.add('to-do-lists-delete-confirmation-container-backdrop-in-use');
		listsContainerlistNameDeleteConfirmationContainerBackdropUnder400px[index].classList.add('to-do-lists-delete-confirmation-container-backdrop-under-400-px-width-in-use');
		listsContainerlistNameDeleteConfirmationContainer[index].classList.add('to-do-lists-delete-confirmation-container-show');
		listsContainerlistNameDeleteConfirmationContainerUnder400px[index].classList.add('to-do-lists-delete-confirmation-container-show');
	}, 250);
};

function addInlineDeleteConfirmationEventListenersUnder400px(index, thisObject){
	thisObject.listsContainerlistNameDeleteButtonEscapeKeydownEventHandlerBound = listsContainerlistNameDeleteButtonEscapeKeydownEventHandler.bind(thisObject);
		thisObject.listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound = listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandler.bind(thisObject);
		thisObject.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound = listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandler.bind(thisObject);
		document.addEventListener('keydown', thisObject.listsContainerlistNameDeleteButtonEscapeKeydownEventHandlerBound, false);
		document.body.addEventListener('click', thisObject.listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandlerBound, false);
		listsContainerlistNameDeleteConfirmationCancelButton[index].addEventListener('click', thisObject.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
		listsContainerlistNameDeleteConfirmationCancelButtonUnder400px[index].addEventListener('click', thisObject.listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandlerBound, false);
};

// Event handlers ----------------------------------------------------------------
// Build/insert dummy lists/separators if not enough lists exist to reach listsContainer client height
function addDummyLists(event){
	if(listsContainer.scrollHeight<=listsContainer.clientHeight){
		while(listsContainer.scrollHeight<=listsContainer.clientHeight){
			const dummyList=document.createElement('div');
			dummyList.classList.add('to-do-lists-list');
			const dummyListVerticalHrSpacer=document.createElement('div');
			dummyListVerticalHrSpacer.classList.add('to-do-lists-vertical-hr-spacer');
			dummyList.appendChild(dummyListVerticalHrSpacer);
			const dummyListVerticalHr=document.createElement('hr');
			dummyListVerticalHr.classList.add('to-do-lists-vertical-hr');
			dummyList.appendChild(dummyListVerticalHr);
			const dummyListForm=document.createElement('form');
			dummyListForm.classList.add('to-do-lists-list-name-inline-edit-form');
			dummyList.appendChild(dummyListForm);
			const dummySeparator=document.createElement('hr');
			dummySeparator.classList.add('to-do-lists-list-separator');
			const dummySeparatorLifted=document.createElement('hr');
			dummySeparatorLifted.classList.add('to-do-lists-list-separator-lifted');
			listsContainer.appendChild(dummyList);
			listsContainer.appendChild(dummySeparator);
			listsContainer.appendChild(dummySeparatorLifted);
		};
	};
};

// If tab key is pressed while no element is focused, focus is forced to tabindex="1"
function tabKeyOnDocumentEventHandler(event){
	if(event.key==='Tab'){
		if(document.activeElement===document.body){
			event.preventDefault();
			const newListEntryFormShowButtonDisplayValue = getCssPropertyValue(newListEntryFormShowButtonContainer, 'display');
			const newListEntryFormShowButtonPositionPixelValue = getCssPropertyValueAndTrimUnit(newListEntryFormShowButtonContainer, 'right');
			if(displayNotEqualToNone(newListEntryFormShowButtonDisplayValue)){
				if(elementIsVisible(newListEntryFormShowButtonPositionPixelValue)){
					newListEntryFormShowButton.focus({focusVisible: true});
				}else{
					if(getCssPropertyValue(newListEntryForm, 'display')!=='none'){
						newListEntryForm.querySelector('[tabindex="1"]').focus();
					}else{
						newListEntryFormUnder400px.querySelector('[tabindex="1"]').focus();
					};
				};
			}else{
				newListEntryForm.querySelector('[tabindex="1"]').focus();
			};
		};
	};
};

// New list form focus first input on keyboard combo
	// Also hides new list entry show button and shows entry form if form is hidden on smaller screen sizes
function focusFirstInput(event){
	if((event.altKey)&&(event.code=="KeyN")){
		stopPropagationAndPreventDefault(event);
		const newListEntryFormDisplayValue = getCssPropertyValue(newListEntryForm, 'display');
		const newListEntryFormShowButtonPositionPixelValue = getCssPropertyValueAndTrimUnit(newListEntryFormShowButtonContainer, 'right');
		if(displayNotEqualToNone(newListEntryFormDisplayValue)){
			if(elementIsVisible(newListEntryFormShowButtonPositionPixelValue)){
				showNewListEntryPane();
			}else{
				focusAndSelect(newListEntryFormNameInput);
			};
		}else{
			if(elementIsVisible(newListEntryFormShowButtonPositionPixelValue)){
				showNewListEntryPane();
			}else{
				focusAndSelect(newListEntryFormNameInputUnder400px);
			};
		};
	};
};

// Main page focus trapping (looping from last inline delete button back to new list name input)
function listsContainerlistNameDeleteButtonLastKeydownEventHandler(event){
	if(event.key==='Tab'){
		event.preventDefault();
		const newListEntryFormContainerVisibility = getCssPropertyValue(newListEntryFormContainer, 'visibility');
		const newListEntryFormDisplayValue = getCssPropertyValue(newListEntryForm, 'display');
		const newListEntryFormShowButtonDisplayValue = getCssPropertyValue(newListEntryFormShowButtonContainer, 'display');
		if(displayNotEqualToNone(newListEntryFormShowButtonDisplayValue)){
			newListEntryFormShowButton.focus({focusVisible: true});
		}else{
			newListEntryFormNameInput.focus();
		};
	};
};

function listsContainerlistNameDeleteButtonUnder400pxLastKeydownEventHandler(event){
	if(event.key==='Tab'){
		event.preventDefault();
		const newListEntryFormContainerVisibility = getCssPropertyValue(newListEntryFormContainer, 'visibility');
		const newListEntryFormDisplayValue = getCssPropertyValue(newListEntryForm, 'display');
		const newListEntryFormShowButtonPositionPixelValue = getCssPropertyValueAndTrimUnit(newListEntryFormShowButtonContainer, 'right');
		if(newListEntryFormShowButtonPositionPixelValue>0){
			newListEntryFormShowButton.focus({focusVisible: true});
		}else{
			newListEntryFormNameInputUnder400px.focus();
		};
	};
};

// Top bar user name input focus, blur and keydown listeners
function topBarUserNameInputFocusEventHandler(event){
	topBarUserNameInput.classList.add('grey-placeholder');
	topBarUserNameInput.placeholder = 'Input a new name for yourself and press "Enter"...';
	function topBarUserNameInputBlurEventListener(event){
		topBarUserNameInput.value = "";
		topBarUserNameInput.classList.remove('grey-placeholder');
		topBarUserNameInput.placeholder = originalPlaceholderText;
		topBarUserNameInput.removeEventListener('blur', topBarUserNameInputBlurEventListener);
		topBarUserNameInput.removeEventListener('keydown', topBarUserNameInputKeydownEventHandler);
	};
	function topBarUserNameInputKeydownEventHandler(event){
		if(event.key==='Escape'){
			topBarUserNameInput.blur();
		};
	};
	topBarUserNameInput.addEventListener('blur', topBarUserNameInputBlurEventListener);
	topBarUserNameInput.addEventListener('keydown', topBarUserNameInputKeydownEventHandler);
};

// List entry inline display section inputs
function listsContainerlistNameTextInputFocusEventHandler(event){
	this.select();
	var currentValue = this.value;
	function listsContainerlistNameTextInputBlurEventHandler(event){
		this.value = currentValue;
		this.removeEventListener('blur', listsContainerlistNameTextInputBlurEventHandler);
		this.removeEventListener('keydown', listContainerlistNameTextInputKeydownEventHandler);
	};
	function listContainerlistNameTextInputKeydownEventHandler(event){
		if(event.key==='Escape'){
			this.blur();
		};
	};
	this.addEventListener('blur', listsContainerlistNameTextInputBlurEventHandler);
	this.addEventListener('keydown', listContainerlistNameTextInputKeydownEventHandler);
};

function listsContainerlistNameCategoryInputChangeEventListener(event){
	this.form.submit();
};

// Inline edit button
function listsContainerlistNameEditButtonClickEventHandler(event){
	const listArrayIndex = this.value;
	showInlineEditModal(listArrayIndex);
	addInlineEditModalEventListeners(listArrayIndex, this);
};

// Inline delete button
function listsContainerlistNameDeleteButtonClickEventHandler(event){
	const index = this.value;
	showInlineDeleteConfirmationContainer(index);
	addInlineDeleteConfirmationEventListeners(index, this);
};

function listsContainerlistNameDeleteButtonUnder400pxClickEventHandler(event){
	const index = this.value;
	showInlineDeleteConfirmationContainerUnder400px(index);
	addInlineDeleteConfirmationEventListenersUnder400px(index, this);
};

// New list entry form hidden until clicked
function newListEntryFormShowButtonClickEventHandler(event){
	newListEntryFormShowButtonContainer.classList.add('entry-form-show-button-container-after-clicked');
	newListEntryFormContainer.classList.add('entry-form-container-in-use');
	setTimeout(()=>{
		const newListEntryFormDisplayValue = getCssPropertyValue(newListEntryForm, 'display');
		if(displayNotEqualToNone(newListEntryFormDisplayValue)){
			focusAndSelect(newListEntryFormNameInput);
		}else{
			focusAndSelect(newListEntryFormNameInputUnder400px);
		};
		addInertAttribute(newListEntryFormShowButton);
		addInertAttribute(topBarContainer);
		addInertAttribute(listsContainer);
	}, 250);
	document.body.addEventListener('click', handleClicksOutsideNewListEntryForm);
	document.addEventListener('keydown', handleNewListEscapeKey);
	newListEntryForm.addEventListener('submit', handleNewListSubmitEvent);
};

// Outline select show button when select is focused
function newListEntryFormCategoryInputFocusEventHandler(event){
	newListEntryFormCategoryShowButton.style.outline = '2px solid #007BFF';
	newListEntryFormCategoryShowButton.style.height = '110%';
	newListEntryFormCategoryShowButton.style.width = '100%';
	newListEntryFormCategoryShowButtonIcon.style.height = '72.5%';
};

// Remove outline from select show button when select is blurred
function newListEntryFormCategoryInputBlurEventHandler(event){
	newListEntryFormCategoryShowButton.style.outline = 'none';
	newListEntryFormCategoryShowButton.style.height = '100%';
	newListEntryFormCategoryShowButton.style.width = '95%';
	newListEntryFormCategoryShowButtonIcon.style.height = '80%';
};

// New list entry focus trapping
function newListEntryFormNameInputKeydownEventHandler(event){
	if(event.key == "Tab" && event.shiftKey){
		stopPropagationAndPreventDefault(event);
		newListEntryFormSubmitButton[0].focus({focusVisible: true});
	};
};

function newListEntryFormNameInputUnder400pxKeydownEventHandler(event){
	if(event.key == "Tab" && event.shiftKey){
		stopPropagationAndPreventDefault(event);
		newListEntryFormSubmitButton[1].focus({focusVisible: true});
	};
};

function newListEntryFormSubmitButtonKeydownEventHandler(event){
	if(event.key=== "Tab" && event.shiftKey){
		stopPropagationAndPreventDefault(event);
		const newListEntryFormShowButtonContainerDisplayValue = getCssPropertyValue(newListEntryFormShowButtonContainer, 'display');
		const newListEntryFormDisplayValue = getCssPropertyValue(newListEntryForm, 'display');
		if(displayEqualToNone(newListEntryFormShowButtonContainerDisplayValue)){
			newListEntryFormCategoryInput.focus();
		}else{
			if(displayNotEqualToNone(newListEntryFormDisplayValue)){
				newListEntryFormCategoryInput.focus();
			}else{
				newListEntryFormCategoryInputUnder400px.focus();
			};
		};
	}else if(event.key=== "Tab"){
		stopPropagationAndPreventDefault(event);
		const newListEntryFormShowButtonContainerDisplayValue = getCssPropertyValue(newListEntryFormShowButtonContainer, 'display');
		const newListEntryFormDisplayValue = getCssPropertyValue(newListEntryForm, 'display');
		if(displayEqualToNone(newListEntryFormShowButtonContainerDisplayValue)){
			burgerMenu.focus();
		}else{
			if(displayNotEqualToNone(newListEntryFormDisplayValue)){
				focusAndSelect(newListEntryFormNameInput);
			}else{
				focusAndSelect(newListEntryFormNameInputUnder400px);
			};
		};
	};
};

globalizeVariables({
	addDummyLists,
	tabKeyOnDocumentEventHandler,
	focusFirstInput,
	listsContainerlistNameDeleteButtonLastKeydownEventHandler,
	listsContainerlistNameDeleteButtonUnder400pxLastKeydownEventHandler,
	topBarUserNameInputFocusEventHandler,
	listsContainerlistNameTextInputFocusEventHandler,
	listsContainerlistNameCategoryInputChangeEventListener,
	listsContainerlistNameDeleteButtonEscapeKeydownEventHandler,
	listsContainerlistNameDeleteButtonClicksOutsideDeleteConfirmationContainerEventHandler,
	listsContainerlistNameDeleteButtonClickEventHandler,
	listsContainerlistNameDeleteButtonUnder400pxClickEventHandler,
	listsContainerlistNameDeleteConfirmationCancelButtonClickEventHandler,
	newListEntryFormShowButtonClickEventHandler,
	newListEntryFormCategoryInputFocusEventHandler,
	newListEntryFormCategoryInputBlurEventHandler,
	newListEntryFormNameInputKeydownEventHandler,
	newListEntryFormNameInputUnder400pxKeydownEventHandler,
	newListEntryFormSubmitButtonKeydownEventHandler,
	listsContainerlistNameEditButtonClickEventHandler
});
