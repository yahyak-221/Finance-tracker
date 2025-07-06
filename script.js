const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();
  if (text && amount) {
    const transaction = {
      id: Date.now(),
      text,
      amount,
    };
    transactions.push(transaction);
    saveData();
    render();
    textInput.value = "";
    amountInput.value = "";
  }
}

function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveData();
  render();
}

function render() {
  list.innerHTML = "";
  let income = 0;
  let expense = 0;
  transactions.forEach((t) => {
    const sign = t.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(t.amount < 0 ? "expense" : "income");
    item.innerHTML = `
      ${t.text} <span>${sign}₹${Math.abs(t.amount)}</span>
      <button onclick="removeTransaction(${t.id})">❌</button>
    `;
    list.appendChild(item);

    if (t.amount < 0) expense += t.amount;
    else income += t.amount;
  });

  const total = income + expense;
  balanceEl.textContent = total;
  incomeEl.textContent = income;
  expenseEl.textContent = Math.abs(expense);

  updateChart(income, Math.abs(expense));
}

let chart;
function updateChart(income, expense) {
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [income, expense],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
  });
}

form.addEventListener("submit", addTransaction);

render();
