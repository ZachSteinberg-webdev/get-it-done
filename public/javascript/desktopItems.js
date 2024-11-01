// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './desktopItemsEventHandlers.js';

// Element selections
	// All items
const desktopItems = document.querySelectorAll('.desktop-item');
	// Calculator
	const calculator = document.querySelector('#calculator');
	const calculatorDisplay=document.querySelector('.desktop-calculator-display-input');
	const calculatorButtons = document.querySelectorAll('.calculator-button');
	const calculatorPowerSwitchFlipped=document.querySelector('.desktop-calculator-power-switch-flipped');
	let calculatorMemory;
	let firstValueEntered=false;
	let calculatorFirstValue=undefined;
	let calculatorSecondValue=0;
	let lastOperator='unset';
	let startNewNumber=false;
	let clearIsLastButtonPressed=false;
	let decimalActivated=false;
	let squareRootActivated=false;
	let percentActivated=false;
	let calculatorDisplayAtMax=false;
	let calculatorPoweredOn=true;

// #     #                         ###
// ##   ##  ####  #    # ######     #  ##### ###### #    #  ####
// # # # # #    # #    # #          #    #   #      ##  ## #
// #  #  # #    # #    # #####      #    #   #####  # ## #  ####
// #     # #    # #    # #          #    #   #      #    #      #
// #     # #    #  #  #  #          #    #   #      #    # #    #
// #     #  ####    ##   ######    ###   #   ###### #    #  ####

desktopItems.forEach((item, i) => {
	item.addEventListener('mousedown', handleMoveItem);
});

//  #####
// #     #   ##   #       ####  #    # #        ##   #####  ####  #####
// #        #  #  #      #    # #    # #       #  #    #   #    # #    #
// #       #    # #      #      #    # #      #    #   #   #    # #    #
// #       ###### #      #      #    # #      ######   #   #    # #####
// #     # #    # #      #    # #    # #      #    #   #   #    # #   #
//  #####  #    # ######  ####   ####  ###### #    #   #    ####  #    #

document.addEventListener('keydown', handleCalculatorKeyboardEntry);

calculatorButtons.forEach((button, i) => {
	button.addEventListener('click', handleCalculatorKeyClick);
	button.addEventListener('focus', handleCalculatorButtonFocus);
});


function countDecimalPlaces(number){
	if(Math.floor(number)===number){
		return 0;
	}else{
		return (number.toString().split('.')[1].length || 0);
	};
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	calculator,
	calculatorDisplay,
	calculatorPowerSwitchFlipped,
	calculatorMemory,
	firstValueEntered,
	calculatorFirstValue,
	calculatorSecondValue,
	lastOperator,
	startNewNumber,
	clearIsLastButtonPressed,
	decimalActivated,
	squareRootActivated,
	percentActivated,
	countDecimalPlaces,
	calculatorDisplayAtMax,
	calculatorPoweredOn
});
