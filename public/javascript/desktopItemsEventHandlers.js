// Imports ----------------------------------------------------------------
import {globalizeVariables} from './globalizeVariables.js';
import './commonFunctions.js';
import './desktopItems.js';

// Event handlers
	// Move desktop item
function handleMoveItem(e){
	if(e.target.classList.contains('desktop-item')){
		const windowElement=e.target;
		const dragHandle=e.target;
		const windowStyles=getComputedStyle(windowElement);
		const windowWidth=window.screen.width;
		const windowHeight=window.screen.height;
		let translateData;
		if(windowStyles.translate==='none' || windowStyles.translate==='0px'){
			translateData='0px 0px';
		}else if(!windowStyles.translate.includes(' ')){
			translateData=`${windowStyles.translate} 0px`;
		}else{
			translateData=windowStyles.translate;
		};
		let translateDataSplit=translateData.split(" ");
		const targetId=e.target.id;
		let movementX=parseInt(translateDataSplit[0]);
		let movementY=parseInt(translateDataSplit[1]);
		let clientWidth=document.body.clientWidth;
		let windowElementWidth=windowElement.getBoundingClientRect().width;
		const handleDrag=(e)=>{
			let windowElementOffsetFromLeft=windowElement.getBoundingClientRect().left;
			movementX=movementX+e.movementX;
			movementY=movementY+e.movementY;
			windowElement.style.translate=`${movementX}px ${movementY}px`;
			if(((windowElementOffsetFromLeft+(windowElementWidth/2))>(clientWidth/2)) && (targetId==='calculator')){
				windowElement.style.rotate='10deg';
			}else if(((windowElementOffsetFromLeft+(windowElementWidth/2))<=(clientWidth/2)) && (targetId==='calculator')){
				windowElement.style.rotate='-10deg';
			};
		};
		const handleMouseUp=async(e)=>{
			document.body.removeEventListener('mousemove', handleDrag);
			document.body.removeEventListener('mouseup', handleMouseUp);
			document.body.removeEventListener('mouseleave', handleMouseLeave);
			const response = await fetch('/user/desktop', {
				method: 'POST',
				headers: {
				"Content-Type": "application/json",
				},
				body: JSON.stringify({
					itemId: targetId,
					itemXPosition: movementX,
					itemYPosition: movementY,
					itemRotation: parseInt(windowElement.style.rotate)
				})
			});
		};
		const handleMouseLeave=(e)=>{
			document.body.removeEventListener('mousemove', handleDrag);
			document.body.removeEventListener('mouseup', handleMouseUp);
			document.body.removeEventListener('mouseleave', handleMouseLeave);
		};
		document.body.addEventListener('mousemove', handleDrag);
		document.body.addEventListener('mouseup', handleMouseUp);
		document.body.addEventListener('mouseleave', handleMouseLeave);
	};
};

// Calculator functions
function handleCalculatorButtonFocus(e){
	e.target.blur();
};

function handleDecimalRounding(decimalInvolved, cfvCdvNumStringLength, cfvCdvNumString, decimalStringLength, cfvCdvNum){
	if(decimalInvolved===false){
		if(cfvCdvNumStringLength>8){
			calculatorDisplay.value='Error   ';
		}else{
			calculatorDisplay.value=cfvCdvNumString;
		};
	}else{
		decimalStringLength=cfvCdvNumString.replace('.','').length;
		if(decimalStringLength<=8){
			calculatorDisplay.value=Number(cfvCdvNumString);
		}else if(String(Number(cfvCdvNum.toFixed(7))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(7)));
		}else if(String(Number(cfvCdvNum.toFixed(6))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(6)));
		}else if(String(Number(cfvCdvNum.toFixed(5))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(5)));
		}else if(String(Number(cfvCdvNum.toFixed(4))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(4)));
		}else if(String(Number(cfvCdvNum.toFixed(3))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(3)));
		}else if(String(Number(cfvCdvNum.toFixed(2))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(2)));
		}else if(String(Number(cfvCdvNum.toFixed(1))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(1)));
		}else if(String(Number(cfvCdvNum.toFixed(0))).length<=9){
			calculatorDisplay.value=String(Number(cfvCdvNum.toFixed(0)));
		}else{
			calculatorDisplay.value='Error   ';
		};
	};
};

function performCalculatorComputation(){
	if(calculatorFirstValue!==undefined && lastOperator!==''){
		const cfvNumber=Number(calculatorFirstValue);
		const cfvNumberString=String(Number(calculatorFirstValue));
		const cdvNumber=Number(calculatorDisplay.value);
		const cdvNumberString=String(Number(calculatorDisplay.value));
		let cfvCdvNum=0;
		let decimalInvolved=false;
		let decimalStringLength=undefined;
		if(cfvNumberString.includes('.')  || cdvNumberString.includes('.')){
			decimalInvolved=true;
		};
		if(percentActivated===true){
			cfvCdvNum=cdvNumber/100;
		}else if(squareRootActivated===true){
			cfvCdvNum=Math.sqrt(cdvNumber);
		}else if(lastOperator==='multiply'){
			cfvCdvNum=cfvNumber*cdvNumber;
		}else if(lastOperator==='divide'){
			cfvCdvNum=cfvNumber/cdvNumber;
		}else if(lastOperator==='add'){
			cfvCdvNum=cfvNumber+cdvNumber;
		}else if(lastOperator==='subtract'){
			cfvCdvNum=cfvNumber-cdvNumber;
		};
		const cfvCdvNumString=String(cfvCdvNum);
		if(cfvCdvNumString.includes('.')){
			decimalInvolved=true;
		};
		const cfvCdvNumStringLength=cfvCdvNumString.length;
		handleDecimalRounding(decimalInvolved, cfvCdvNumStringLength, cfvCdvNumString, decimalStringLength, cfvCdvNum);
	}else{
		const cfvNumber=Number(calculatorFirstValue);
		const cfvNumberString=String(Number(calculatorFirstValue));
		const cdvNumber=Number(calculatorDisplay.value);
		const cdvNumberString=String(Number(calculatorDisplay.value));
		let cfvCdvNum=0;
		let decimalInvolved=false;
		let decimalStringLength=undefined;
		if(cfvNumberString.includes('.')  || cdvNumberString.includes('.')){
			decimalInvolved=true;
		};
		if(percentActivated===true){
			calculatorDisplay.value=cdvNumber/100;
		}else if(squareRootActivated===true){
			calculatorDisplay.value=Math.sqrt(cdvNumber);
		};
	};
};

function doPowerToggle(){
	if(calculatorPoweredOn===false){
		calculatorPoweredOn=true;
		calculatorDisplay.style.opacity='1';
		calculatorPowerSwitchFlipped.style.display='none';
	}else{
		calculatorPoweredOn=false;
		calculatorDisplay.style.opacity='0';
		calculatorPowerSwitchFlipped.style.display='block';
	};
	clearIsLastButtonPressed=false;
};

function doGt(){
	const currentValue=calculatorDisplay.value;
	calculatorDisplay.value='GT???';
	startNewNumber=true;
	clearIsLastButtonPressed=false;
};

function doMu(){
	const currentValue=calculatorDisplay.value;
	calculatorDisplay.value='MU?!?!?!';
	startNewNumber=true;
	clearIsLastButtonPressed=false;
};

function doMemoryRecall(){
	if(typeof Number(calculatorMemory.value)==='number'){
		calculatorDisplay.value=calculatorMemory;
		clearIsLastButtonPressed=false;
		decimalActivated=false;
		startNewNumber=true;
	};
};

function doMemoryMinus(){
	calculatorMemory=0;
	clearIsLastButtonPressed=false;
};

function doMemoryPlus(){
	if(Number(calculatorDisplay.value)){
		calculatorMemory=calculatorDisplay.value;
		clearIsLastButtonPressed=false;
		startNewNumber=true;
	};
};

function doPlusMinus(){
	if(Number(calculatorDisplay.value)!==0){
		if(calculatorDisplay.value.slice(0,1)!=='-'){
			calculatorDisplay.value='-'+calculatorDisplay.value;
			clearIsLastButtonPressed=false;
		}else{
			calculatorDisplay.value=calculatorDisplay.value.replace('-','');
			clearIsLastButtonPressed=false;
		};
	};
};

function doBackspace(){
	if(startNewNumber===true){
		calculatorDisplay.value=0;
		startNewNumber=false;
		clearIsLastButtonPressed=false;
	}else if(decimalActivated===false){
		calculatorDisplay.value=(calculatorDisplay.value-(calculatorDisplay.value%10))/10;
	}else if(calculatorDisplay.value.length>1){
		if(calculatorDisplay.value.slice(-1)==='.'){
			decimalActivated=false;
		};
		calculatorDisplay.value=calculatorDisplay.value.slice(0, -1);
	}else{
		calculatorDisplay.value=0;
	};
	clearIsLastButtonPressed=false;
};

function doClear(){
	if(clearIsLastButtonPressed===false){
		calculatorDisplay.value=0;
		clearIsLastButtonPressed=true;
		decimalActivated=false;
	}else{
		lastOperator='';
		calculatorFirstValue=undefined;
	};
};

function doNumberEntry(numberString){
	const number=Number(numberString);
	if(startNewNumber===true){
		calculatorDisplay.value=number;
		startNewNumber=false;
	}else if(calculatorDisplayAtMax===true){
		// Do nothing
	}else if(decimalActivated===false){
		if(numberString==='00'){
			calculatorDisplay.value=calculatorDisplay.value*100;
		}else{
			calculatorDisplay.value=(calculatorDisplay.value*10)+number;
		};
	}else{
		calculatorDisplay.value=calculatorDisplay.value+numberString;
	};
	clearIsLastButtonPressed=false;
};

function doPoint(){
	if(startNewNumber===true){
		calculatorDisplay.value='0.';
		startNewNumber=false;
		decimalActivated=true;
	}else if(decimalActivated===false && calculatorDisplay.value.length<8){
		calculatorDisplay.value=calculatorDisplay.value+'.';
		decimalActivated=true;
	};
};

function doPercent(){
	if(Number(calculatorDisplay.value)){
		percentActivated=true;
		performCalculatorComputation();
		clearIsLastButtonPressed=false;
		decimalActivated=false;
		percentActivated=false;
	};
};

function doSquareRoot(){
	if(Number(calculatorDisplay.value)){
		squareRootActivated=true;
		performCalculatorComputation();
		startNewNumber=true;
		clearIsLastButtonPressed=false;
		decimalActivated=false;
		squareRootActivated=false;
	};
};

function doCalc(operator){
	if(Number(calculatorDisplay.value)){
		performCalculatorComputation();
		calculatorFirstValue=calculatorDisplay.value;
		lastOperator=operator;
		startNewNumber=true;
		clearIsLastButtonPressed=false;
		decimalActivated=false;
	};
};

function doSpecVal(){
	if(calculatorDisplay.value==='5318008'
		|| calculatorDisplay.value==='58008'
		|| calculatorDisplay.value==='0.1134'){
		const currentRotation=getComputedStyle(calculator).rotate;
		calculator.style.rotate='180deg';
		setTimeout(()=>{
			calculator.style.rotate=currentRotation;
		},3000);
	};
};

function handleCalculatorKeyClick(e){
	event.stopPropagation();
	if(String(calculatorDisplay.value).replace('.','').length>=8){
		calculatorDisplayAtMax=true;
	}else{
		calculatorDisplayAtMax=false;
	};
	const targetId = e.target.id;
	if(targetId==='powerSwitch1'){
		doPowerToggle();
	}else if(targetId==='powerSwitch2'){
		doPowerToggle();
	}else if(targetId==='gt'){
		doGt();
	}else if(targetId==='mu'){
		doMu();
	}else if(targetId==='memoryRecall'){
		doMemoryRecall();
	}else if(targetId==='memoryMinus'){
		doMemoryMinus();
	}else if(targetId==='memoryPlus'){
		doMemoryPlus();
	}else if(targetId==='plusMinus'){
		doPlusMinus();
	}else if(targetId==='backspace'){
		doBackspace();
	}else if(targetId==='clear'){
		doClear();
	}else if(targetId==='one'){
		doNumberEntry('1');
	}else if(targetId==='two'){
		doNumberEntry('2');
	}else if(targetId==='three'){
		doNumberEntry('3');
	}else if(targetId==='four'){
		doNumberEntry('4');
	}else if(targetId==='five'){
		doNumberEntry('5');
	}else if(targetId==='six'){
		doNumberEntry('6');
	}else if(targetId==='seven'){
		doNumberEntry('7');
	}else if(targetId==='eight'){
		doNumberEntry('8');
	}else if(targetId==='nine'){
		doNumberEntry('9');
	}else if(targetId==='zero'){
		doNumberEntry('0');
	}else if(targetId==='doubleZero'){
		doNumberEntry('00');
	}else if(targetId==='point'){
		doPoint();
	}else if(targetId==='percent'){
		doPercent();
	}else if(targetId==='squareRoot'){
		doSquareRoot();
	}else if(targetId==='multiply'){
		doCalc('multiply');
	}else if(targetId==='divide'){
		doCalc('divide');
	}else if(targetId==='add1'){
		doCalc('add');
	}else if(targetId==='add2'){
		doCalc('add');
	}else if(targetId==='subtract'){
		doCalc('subtract');
	}else if(targetId==='equals'){
		doCalc('');
	};
	doSpecVal();
};

function handleCalculatorKeyboardEntry(e){
	if(e.target.nodeName!=='INPUT' &&
			e.target.nodeName!=='SELECT' &&
			e.target.nodeName!=='CHECKBOX' &&
			!e.repeat){ // nodeName 'BUTTON' blocked only for e.key==='Enter' block below
		if(String(calculatorDisplay.value).replace('.','').length>=8){
			calculatorDisplayAtMax=true;
		}else{
			calculatorDisplayAtMax=false;
		};
		if(e.altKey && e.code==='KeyO'){
			doPowerToggle();
		}else if(e.key==='disabled'){
			doGt();
		}else if(e.key==='disabled'){
			doMu();
		}else if(e.altKey && (e.code==='KeyM' || e.code==='KeyR')){
			doMemoryRecall();
		}else if(e.altKey && e.code==='Minus'){
			doMemoryMinus();
		}else if(e.altKey && e.code==='Equal'){
			doMemoryPlus();
		}else if(e.altKey && e.code==='KeyN'){
			doPlusMinus();
		}else if(e.key==='Backspace'){
			doBackspace();
		}else if(e.key==='Escape'){
			doClear();
		}else if(e.key==='1'){
			doNumberEntry('1');
		}else if(e.key==='2'){
			doNumberEntry('2');
		}else if(e.key==='3'){
			doNumberEntry('3');
		}else if(e.key==='4'){
			doNumberEntry('4');
		}else if(e.key==='5'){
			doNumberEntry('5');
		}else if(e.key==='6'){
			doNumberEntry('6');
		}else if(e.key==='7'){
			doNumberEntry('7');
		}else if(e.key==='8'){
			doNumberEntry('8');
		}else if(e.key==='9'){
			doNumberEntry('9');
		}else if(e.key==='0'){
			doNumberEntry('0');
		}else if(e.key==='.'){
			doPoint();
		}else if(e.key==='%'){
			doPercent();
		}else if(e.altKey && e.code==='KeyS'){
			doSquareRoot();
		}else if(e.key==='*'){
			doCalc('multiply');
		}else if(e.key==='/'){
			e.preventDefault();
			e.stopPropagation();
			doCalc('divide');
		}else if(e.key==='+'){
			doCalc('add');
		}else if(e.key==='-'){
			doCalc('subtract');
		}else if(e.key==='=' || (e.key==='Enter' && e.target.nodeName!=='BUTTON')){
			doCalc('');
		};
		doSpecVal();
	};
};

// Globalized variables ----------------------------------------------------------------
globalizeVariables({
	handleMoveItem,
	handleCalculatorButtonFocus,
	handleCalculatorKeyClick,
	handleCalculatorKeyboardEntry
});
