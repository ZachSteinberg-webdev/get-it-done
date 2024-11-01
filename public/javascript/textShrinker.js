// Text shrinker
// Accepts a text input, the associated CSS declaration and a rem increment
// Adjusts the input's text size down as necessary to prevent an overflow-x
// Adjusts the input's text size up again until text input is full or original font size is reached
// If increment is set lower than 0.1 it might slow down the page

// Imports
import './commonFunctions.js';

//For horizontal overflows ----------------------------------------------------------------
const shrinkTextToFitWhenTyping=(cssSelector, increment=0.1)=>{
	if(isObjectAndNotNull(cssSelector)){
		const textInputField = document.querySelector(cssSelector);
		const computedStyles = window.getComputedStyle(textInputField);
		const fontSizeNumberOriginal = Number(computedStyles.fontSize.replaceAll(/[a-zA-Z]+/g,""));
		var fontSizeNumberCurrent = fontSizeNumberOriginal;
		var fontSizeNumberMinimum = fontSizeNumberOriginal/2;
		const fontUnit = computedStyles.fontSize.match(/[a-zA-Z]+/g)[0].toString();
		const isOverflown=(textInputField)=>{
			return textInputField.scrollWidth > textInputField.clientWidth;
		};
		const changeFontSize = (textInputField, fontSizeNumberOriginal, fontSizeNumberCurrent, fontSizeNumberMinimum)=>{
			if(isOverflown(textInputField)) {
				while (isOverflown(textInputField) && (fontSizeNumberCurrent>fontSizeNumberMinimum)){
				fontSizeNumberCurrent=(fontSizeNumberCurrent-increment).toFixed(2);
				textInputField.style.fontSize = fontSizeNumberCurrent + fontUnit;
				}
			}else {
				textInputField.style.fontSize = fontSizeNumberOriginal + fontUnit;
				while (isOverflown(textInputField) && (fontSizeNumberCurrent>fontSizeNumberMinimum)){
					fontSizeNumberCurrent=(fontSizeNumberCurrent-increment).toFixed(2);
					textInputField.style.fontSize = fontSizeNumberCurrent + fontUnit;
				};
			};
		};
		textInputField.addEventListener('input', (event)=>{
			changeFontSize(textInputField, fontSizeNumberOriginal, fontSizeNumberCurrent, fontSizeNumberMinimum);
		});
	};
};

// For vertical overflows ----------------------------------------------------------------
const shrinkTextToFitWhenTypingVertical=(cssSelector, minimum, increment=0.01)=>{
	const cssClasses = Array.from(document.styleSheets[0].cssRules);
	const cssDeclarationIndex = cssClasses.findIndex(object=>object.selectorText===cssSelector);
	const textInputField = document.querySelector(cssSelector);
	const cssDeclaration = document.styleSheets[0].cssRules[cssDeclarationIndex].style;
	const fontSizeNumberOriginal = Number(cssDeclaration.getPropertyValue('font-size').replaceAll(/[a-zA-Z]+/g,""));
	var fontSizeNumberCurrent = fontSizeNumberOriginal;
	var fontSizeNumberMinimum = typeof(minimum)==="number" ? minimum : fontSizeNumberOriginal/2;
	const fontUnit = cssDeclaration.getPropertyValue('font-size').match(/[a-zA-Z]+/g)[0].toString();
	const isOverflown=(textInputField)=>{
		return textInputField.scrollHeight > textInputField.clientHeight;
	};
	const changeFontSize = (textInputField, fontSizeNumberOriginal, fontSizeNumberCurrent, fontSizeNumberMinimum)=>{

		if(isOverflown(textInputField)) {
			while (isOverflown(textInputField) && (fontSizeNumberCurrent>fontSizeNumberMinimum)){
				fontSizeNumberCurrent=(fontSizeNumberCurrent-increment).toFixed(2);
				textInputField.style.fontSize = fontSizeNumberCurrent + fontUnit;
			}
		}else {
			textInputField.style.fontSize = fontSizeNumberOriginal + fontUnit;
			while (isOverflown(textInputField) && (fontSizeNumberCurrent>fontSizeNumberMinimum)){
				fontSizeNumberCurrent=(fontSizeNumberCurrent-increment).toFixed(2);
				textInputField.style.fontSize = fontSizeNumberCurrent + fontUnit;
			};
		};
	};
	textInputField.addEventListener('input', (event)=>{
		changeFontSize(textInputField, fontSizeNumberOriginal, fontSizeNumberCurrent, fontSizeNumberMinimum);
	});
};

export {shrinkTextToFitWhenTyping, shrinkTextToFitWhenTypingVertical};
