// Example: Set your exchange rates manually once
localStorage.setItem("INRtoUSD", "0.012");
localStorage.setItem("INRtoEUR", "0.011");
localStorage.setItem("INRtoGBP", "0.0095");

const baseCurrency = "₹"; // All your transactions are in INR (₹) by default

function getExchangeRate(from, to) {
  if (from === to) return 1;

  const key = `${from}to${to}`.replace(/[^A-Za-z]/g, "");
  const rate = parseFloat(localStorage.getItem(key));

  if (!rate || isNaN(rate)) {
    console.warn(`Missing or invalid exchange rate: ${key}`);
    return 1;
  }

  return rate;
}

// Convert amount from one currency to another
function convertAmount(amount, fromSymbol, toSymbol) {
  const rate = getExchangeRate(fromSymbol, toSymbol);
  return amount * rate;
}

// Override formatCurrency from script.js non-destructively
const originalFormatCurrency = window.formatCurrency;

window.formatCurrency = function (amount) {
  const selectedCurrency =
    localStorage.getItem("selectedCurrency") || baseCurrency;

  const convertedAmount = convertAmount(amount, baseCurrency, selectedCurrency);
  return `${selectedCurrency}${Math.abs(convertedAmount).toFixed(2)}`;
};
