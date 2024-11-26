// --------------------------
// 1. Global Variables and Constants
// --------------------------

// Global Variables
const maxInputLength = 12;
let previousNum = null;
let currentNum = '0';
let operator = null;
let equalIsPressed = false;

// DOM Elements
const input = document.querySelector('#input');
const numBtns = document.querySelectorAll('button[data-number]');
const operatorBtns = document.querySelectorAll('button[data-operator]');
const equalBtn = document.querySelector('button[data-action="equal"]');
const clearBtn = document.querySelector('button[data-action="clear"]');
const deleteBtn = document.querySelector('button[data-action="delete"]');
const invertBtn = document.querySelector('button[data-action="invert"]');

// --------------------------
// 2. Helper Functions
// --------------------------

function updateInput(value){
    input.textContent = value;
}

function clearAll() {
    previousNum = null;
    currentNum = '0';
    operator = null;
    updateInput(currentNum);
}

function canAppendNumber(number){
    // Check if current number already has a decimal
    if(number == '.' && currentNum.includes('.')){
        return false;
    }

    // Input has a maximum chars length based on design
    if(currentNum.length == maxInputLength){
        return false;
    }

    return true;
}

function appendNumber(number) {
    if (!canAppendNumber(number)) return;

    // If currentNum is '0', replace it with the new number (unless the number is '.')
    if (currentNum === '0') {
        currentNum = number === '.' ? '0.' : number;
    } else {
        currentNum += number;
    }

    updateInput(currentNum);
}

function roundNumber(number){
    return parseFloat(number.toFixed(2));
}

function showError(message) {
    updateInput(message);
    setTimeout(() => {
        clearAll();
    }, 2000);
}

function operateCalculator(){
    // Transform string numbers into numbers
    currentNum = +currentNum;
    previousNum = +previousNum;

    // Handle division by 0
    if(operator === '/' && currentNum === 0){
        showError('no ÷ by 0!');
        return;
    }

    let result = roundNumber(operate(previousNum, currentNum, operator));

    // Make sure the result doesn't overflow the input
    if(String(result).length > maxInputLength){
        result = result.toPrecision(7);
    }

    previousNum = result;
    currentNum = '0';
    updateInput(result);
}

function updateNumberAfterOperation(operation) {
    // Determine which number (previous or current) is currently shown inside the input
    let targetNum = equalIsPressed && previousNum !== null ? String(previousNum) : currentNum;

    // Apply the operation to the target number
    targetNum = operation(targetNum);

    // Update the corresponding variable
    if (equalIsPressed && previousNum !== null) {
        previousNum = targetNum;
    } else {
        currentNum = targetNum;
    }

    updateInput(targetNum);
}

// --------------------------
// 3. Math Functions
// --------------------------

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, operator) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
    }
}

// --------------------------
// 4. Event Listener Functions
// --------------------------

function handleNumBtnClick(event){
    const number = event.target.getAttribute('data-number');
    appendNumber(number);
}

function handleOperatorBtnClick(event){
    if(previousNum == null){
        previousNum = currentNum;
        currentNum = '0';
    } else {
        // Check if an operation was just made by pressing the equal button, 
        // we should only operate using the operator button if the equal button was skipped
        if(!equalIsPressed){
            operateCalculator();
        } else {
            equalIsPressed = false;
        }
    }

    // Set or reset the operator after operation
    operator = event.target.getAttribute('data-operator');
}

function handleEqualBtnClick(){
    if(previousNum !== null){
        operateCalculator();
        equalIsPressed = true;
    }
}

function handleDeleteBtnClick() {
    updateNumberAfterOperation((num) => {
        // Remove the last character, or set to '0' if empty or a single negative sign
        num = num.length > 1 ? num.slice(0, -1) : '0';
        return num === '-' ? '0' : num;
    });
}

function handleInvertBtnClick() {
    updateNumberAfterOperation((num) => {
        // Toggle the sign of the number
        return num.startsWith('-') ? num.slice(1) : (num !== '0' ? '-' + num : num);
    });
}

// --------------------------
// 5. Event Listeners Registration
// --------------------------

numBtns.forEach(button => button.addEventListener("click", handleNumBtnClick));
operatorBtns.forEach(button => button.addEventListener("click", handleOperatorBtnClick));
equalBtn.addEventListener("click", handleEqualBtnClick);
clearBtn.addEventListener("click", clearAll);
deleteBtn.addEventListener("click", handleDeleteBtnClick);
invertBtn.addEventListener("click", handleInvertBtnClick);
