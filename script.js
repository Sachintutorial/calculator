const result = document.getElementById("result");
const expression = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let firstNumber = null;
let operator = null;
let startNewNumber = true;
let justCalculated = false;

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}

function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;

    if (op === "/") {
        if (b === 0) return null;
        return a / b;
    }

    return b;
}

function showValue(value) {
    result.value = value;
}

function enterDigit(value) {
    if (result.value === "Error" || startNewNumber || justCalculated) {
        showValue(value === "." ? "0." : value);
        startNewNumber = false;
        justCalculated = false;
        return;
    }

    if (value === ".") {
        if (!result.value.includes(".")) {
            showValue(result.value + ".");
        }
        return;
    }

    if (result.value.length >= 15) return;

    showValue(result.value === "0" ? value : result.value + value);
}

function chooseOperator(op) {
    if (result.value === "Error") return;

    const current = Number(result.value);

    if (operator && !startNewNumber) {
        const answer = calculate(firstNumber, current, operator);

        if (answer === null) {
            showError();
            return;
        }

        firstNumber = answer;
        showValue(formatNumber(answer));
    } else if (firstNumber === null || justCalculated) {
        firstNumber = current;
    }

    operator = op;
    startNewNumber = true;
    justCalculated = false;

    expression.textContent = `${formatNumber(firstNumber)} ${op}`;
}

function showError() {
    showValue("Error");
    expression.textContent = "Cannot divide by zero";
    firstNumber = null;
    operator = null;
    startNewNumber = true;
    justCalculated = false;
}

function showResult() {
    if (operator === null || firstNumber === null ||
        result.value === "Error") return;

    const a = firstNumber;
    const b = Number(result.value);
    const op = operator;
    const answer = calculate(a, b, op);

    if (answer === null) {
        showError();
        return;
    }

    expression.textContent =
        `${formatNumber(a)} ${op} ${formatNumber(b)} =`;

    showValue(formatNumber(answer));

    firstNumber = null;
    operator = null;
    startNewNumber = true;
    justCalculated = true;
}

function clearCalculator() {
    firstNumber = null;
    operator = null;
    startNewNumber = true;
    justCalculated = false;

    showValue("0");
    expression.textContent = "Ready for calculation";
}

function deleteDigit() {
    if (result.value === "Error" || startNewNumber || justCalculated) {
        showValue("0");
        startNewNumber = false;
        justCalculated = false;
        return;
    }

    const value = result.value.slice(0, -1);

    if (value === "" || value === "-") {
        showValue("0");
    } else {
        showValue(value);
    }
}

function toggleSign() {
    if (result.value === "Error") return;

    const number = Number(result.value);

    if (number !== 0) {
        showValue(formatNumber(-number));
    }
}

function percentage() {
    if (result.value === "Error") return;

    showValue(formatNumber(Number(result.value) / 100));
    startNewNumber = true;
    justCalculated = false;
}

buttons.addEventListener("click", function(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
        if (["+", "-", "*", "/"].includes(value)) {
            chooseOperator(value);
        } else {
            enterDigit(value);
        }
    }

    if (action === "clear") clearCalculator();
    if (action === "delete") deleteDigit();
    if (action === "percent") percentage();
    if (action === "sign") toggleSign();
    if (action === "calculate") showResult();
});

// Keyboard support
document.addEventListener("keydown", function(event) {
    if (/^[0-9.]$/.test(event.key)) {
        enterDigit(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        showResult();
    } else if (event.key === "Backspace") {
        deleteDigit();
    } else if (event.key === "Escape") {
        clearCalculator();
    } else if (event.key === "%") {
        percentage();
    }
});