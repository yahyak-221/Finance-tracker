// DOM Elements
const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const toggleBtn = document.getElementById("toggle-theme");
const budgetInput = document.getElementById("budget");
const budgetWarning = document.getElementById("budget-warning");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Save transactions to localStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Add new transaction
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

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveData();
  render();
}

// Render transactions and summary
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
  checkBudget(); // Check budget warning on every render
}

// Chart setup
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

// Budget check logic
function checkBudget() {
  const budget = +budgetInput.value;
  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  if (budget && Math.abs(totalExpense) > budget) {
    budgetWarning.textContent = "⚠️ You’ve exceeded your monthly budget!";
  } else {
    budgetWarning.textContent = "";
  }
}

// Budget input change listener
budgetInput.addEventListener("input", () => {
  localStorage.setItem("monthlyBudget", budgetInput.value);
  checkBudget();
});

// Load saved budget on page load
const savedBudget = localStorage.getItem("monthlyBudget");
if (savedBudget) {
  budgetInput.value = savedBudget;
}

// Dark mode toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// Load theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Initial Setup
form.addEventListener("submit", addTransaction);
render();
