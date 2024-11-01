// Imports
import {globalizeVariables} from './globalizeVariables.js';

// focusAndSelect ----------------------------------------------------------------
const focusAndSelect = (element)=>{
	element.focus();
	element.select();
};

// focusOneOrTheOther ----------------------------------------------------------------
const focusOneOrTheOther = (valueVariable, value, element1, element2)=>{
	if(valueVariable!==value){
		focusAndSelect(element1);
	}else{
		focusAndSelect(element2);
	};
};

// toggleInertAttribute ----------------------------------------------------------------
const toggleInertAttribute = (element)=>{
	if(element.inert == true){
		element.inert = false;
	}else if(element.inert == false){
		element.inert = true;
	};
};

// addInertAttribute ----------------------------------------------------------------
const addInertAttribute = (element)=>{
	element.inert = true;
};

// removeInertAttribute ----------------------------------------------------------------
const removeInertAttribute = (element)=>{
	element.inert = false;
};

// changeCssProperty ----------------------------------------------------------------
const changeCssProperty = (element, property, newValue)=>{
	element.style.setProperty(property, newValue);
};

// toggleCssDisplayPropertyBetweenNoneAndBlock ----------------------------------------------------------------
const toggleCssDisplayPropertyBetweenNoneAndBlock = (element)=>{
	const displayValue = window.getComputedStyle(element).getPropertyValue('display');
	if(displayValue == "block"){
		element.style.display = "none";
	}else if(displayValue == "none"){
		element.style.display = "block";
	}
};

// stopPropagation ----------------------------------------------------------------
const stopPropagation = async(eventArg)=>{
	eventArg.stopPropagation();
};

// preventDefault ----------------------------------------------------------------
const preventDefault = async(eventArg)=>{
	eventArg.preventDefault();
};

// stopPropagationAndPreventDefault ----------------------------------------------------------------
const stopPropagationAndPreventDefault = async(eventArg)=>{
	eventArg.stopPropagation();
	eventArg.preventDefault();
};

// getCssPropertyValue ----------------------------------------------------------------
const getCssPropertyValue = (element, property)=>{
	const value = window.getComputedStyle(element).getPropertyValue(property);
	return value;
};

// getCssPropertyValueAndTrimUnit ----------------------------------------------------------------
const getCssPropertyValueAndTrimUnit = (element, property)=>{
	const value = Number(window.getComputedStyle(element).getPropertyValue(property).replaceAll(/[a-zA-Z]+/g,""));
	return value;
};

// getDisplayValue ----------------------------------------------------------------
const getDisplayValue = (element)=>{
	const displayValue = window.getComputedStyle(element).getPropertyValue('display');
	return displayValue;
};

// getVisibilityValue ----------------------------------------------------------------
const getVisibilityValue = (element)=>{
	const visibilityValue = window.getComputedStyle(element).getPropertyValue('visibility');
	return visibilityValue;
};

// getPositionPixelValue ----------------------------------------------------------------
const getPositionPixelValue = (element, positionProperty)=>{
	const pixelValue = Number(window.getComputedStyle(element).getPropertyValue(positionProperty).replaceAll(/[a-zA-Z]+/g,""));
	return pixelValue;
};

// shakeElement ----------------------------------------------------------------
const shakeElement = (element)=>{
	element.style.animation = "shake 0.25s";
	setTimeout(()=>{
		element.style.animation = "";
	}, 250);
};

// convertMonthNumberToLetterAbbreviation ----------------------------------------------------------------
const convertMonthNumberToLetterAbbreviation = (month)=>{
	if(month==='01'){
		displayMonth='Jan';
	}else if(month==='02'){
		return 'Feb';
	}else if(month==='03'){
		return 'Mar';
	}else if(month==='04'){
		return 'Apr';
	}else if(month==='05'){
		return 'May';
	}else if(month==='06'){
		return 'Jun';
	}else if(month==='07'){
		return 'Jul';
	}else if(month==='08'){
		return 'Aug';
	}else if(month==='09'){
		return 'Sep';
	}else if(month==='10'){
		return 'Oct';
	}else if(month==='11'){
		return 'Nov';
	}else if(month==='12'){
		return 'Dec';
	};
};

const isObjectAndNotNull = (value)=>{
	if(typeof value === 'object' && value !== null){
		return true;
	}else{
		return false;
	};
};

const displayEqualToNone = (element)=>{
	if(element==='none'){
		return true;
	}else{
		return false;
	};
};

const displayNotEqualToNone = (element)=>{
	if(element!=='none'){
		return true;
	}else{
		return false;
	};
};

const elementIsVisible = (element)=>{
	if(element>0){
		return true;
	}else{
		return false;
	};
};

const userClickedOutsideElement = (element)=>{
	if(!element.contains(event.target)){
		return true;
	};
};

globalizeVariables({
	focusAndSelect,
	focusOneOrTheOther,
	toggleInertAttribute,
	addInertAttribute,
	removeInertAttribute,
	toggleCssDisplayPropertyBetweenNoneAndBlock,
	changeCssProperty,
	stopPropagation,
	preventDefault,
	stopPropagationAndPreventDefault,
	getCssPropertyValue,
	getCssPropertyValueAndTrimUnit,
	getDisplayValue,
	getVisibilityValue,
	getPositionPixelValue,
	shakeElement,
	convertMonthNumberToLetterAbbreviation,
	displayEqualToNone,
	displayNotEqualToNone,
	isObjectAndNotNull,
	elementIsVisible,
	userClickedOutsideElement
});
