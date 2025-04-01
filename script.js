let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let history = [];

// Load history from localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.querySelector('.history-list');
    const historyPanel = document.querySelector('.history-panel');
    
    // Clear existing history display
    historyList.innerHTML = '';
    
    // Show/hide history panel based on history array length
    if (history.length > 0) {
        historyPanel.classList.add('show');
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span>${item.calculation}</span>
                <span>=</span>
                <span>${item.result}</span>
            `;
            historyItem.onclick = () => loadFromHistory(index);
            historyList.appendChild(historyItem);
        });
    } else {
        historyPanel.classList.remove('show');
    }
}

function clearHistory() {
    history = [];
    saveHistory();
    updateHistoryDisplay();
}

// Load calculation from history
function loadFromHistory(index) {
    const item = history[index];
    currentOperand = item.result.toString();
    updateDisplay();
}

// Scientific calculations
function calculateSci(type) {
    const num = parseFloat(currentOperand);
    let result;
    
    switch(type) {
        case 'sqrt':
            result = Math.sqrt(num);
            break;
        case 'square':
            result = num * num;
            break;
        case 'sin':
            result = Math.sin(num * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(num * Math.PI / 180);
            break;
    }
    
    currentOperand = result.toString();
    updateDisplay();
    addToHistory(`${type}(${num})`, result);
}

// Add to history
function addToHistory(calculation, result) {
    history.unshift({ calculation, result });
    if (history.length > 10) history.pop(); // Keep only last 10 calculations
    saveHistory();
    updateHistoryDisplay();
}

// Update display elements
function updateDisplay() {
    document.querySelector('.current-operand').textContent = formatNumber(currentOperand);
    document.querySelector('.previous-operand').textContent = previousOperand;
}

// Format number with commas
function formatNumber(number) {
    const [integer, decimal] = number.toString().split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
}

// Clear all values
function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// Delete last digit
function deleteNumber() {
    if (currentOperand === '0') return;
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') currentOperand = '0';
    updateDisplay();
}

// Append number to display
function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

// Handle operators
function handleOperator(operator) {
    if (currentOperand === '0') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = operator;
    previousOperand = currentOperand + ' ' + operator;
    currentOperand = '0';
    updateDisplay();
}

// Calculate result
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearDisplay();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    // Add to history
    addToHistory(`${prev} ${operation} ${current}`, computation);
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

// Initialize
loadHistory();
updateDisplay();