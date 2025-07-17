localStorage.setItem("INRtoUSD", "0.012");
localStorage.setItem("INRtoEUR", "0.011");
localStorage.setItem("INRtoGBP", "0.0095");

const baseCurrency = "₹";

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

function convertAmount(amount, fromSymbol, toSymbol) {
  const rate = getExchangeRate(fromSymbol, toSymbol);
  return amount * rate;
}

const originalFormatCurrency = window.formatCurrency;

window.formatCurrency = function (amount) {
  const selectedCurrency =
    localStorage.getItem("selectedCurrency") || baseCurrency;

  const convertedAmount = convertAmount(amount, baseCurrency, selectedCurrency);
  return `${selectedCurrency}${Math.abs(convertedAmount).toFixed(2)}`;
};
