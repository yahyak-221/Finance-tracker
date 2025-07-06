// DOM Elements
const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const toggleBtn = document.getElementById("toggle-theme");
const budgetInput = document.getElementById("budget");
const budgetWarning = document.getElementById("budget-warning");

const editModal = document.getElementById("edit-modal");
const editText = document.getElementById("edit-text");
const editAmount = document.getElementById("edit-amount");
const editCategory = document.getElementById("edit-category");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;

// Save to localStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();
  const category = categoryInput.value;

  if (text && amount && category) {
    const transaction = {
      id: Date.now(),
      text,
      amount,
      category,
    };

    transactions.push(transaction);
    saveData();
    render();
  }

  textInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
}

// Edit transaction (open modal)
function editTransaction(id) {
  const t = transactions.find((txn) => txn.id === id);
  if (!t) return;

  editText.value = t.text;
  editAmount.value = t.amount;
  editCategory.value = t.category;
  editId = id;
  editModal.classList.remove("hidden");
}

// Save edit from modal
saveEditBtn.addEventListener("click", () => {
  const updatedText = editText.value.trim();
  const updatedAmount = +editAmount.value.trim();
  const updatedCategory = editCategory.value;

  if (updatedText && updatedAmount && updatedCategory) {
    transactions = transactions.map((t) =>
      t.id === editId
        ? {
            ...t,
            text: updatedText,
            amount: updatedAmount,
            category: updatedCategory,
          }
        : t
    );
    saveData();
    render();
    editModal.classList.add("hidden");
    editId = null;
  }
});

// Cancel modal edit
cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editId = null;
});

// Confirm before deleting
function removeTransaction(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this transaction?"
  );
  if (!confirmDelete) return;

  transactions = transactions.filter((t) => t.id !== id);
  saveData();
  render();
}

// Render UI
function render() {
  list.innerHTML = "";
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    const sign = t.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(t.amount < 0 ? "expense" : "income");
    item.innerHTML = `
      ${t.text} (${t.category}) <span>${sign}₹${Math.abs(t.amount)}</span>
      <button onclick="editTransaction(${t.id})">✏️</button>
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

  updateChart();
  checkBudget();
}

// Chart - Category Breakdown
let chart;
function updateChart() {
  const categoryTotals = {};

  transactions.forEach((t) => {
    if (t.amount < 0) {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    }
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#f44336",
            "#2196f3",
            "#ff9800",
            "#9c27b0",
            "#009688",
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

// Budget check
function checkBudget() {
  const budget = +budgetInput.value;
  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const used = Math.abs(totalExpense);

  if (!budget) {
    budgetWarning.textContent = "";
    return;
  }

  const usage = (used / budget) * 100;

  if (usage >= 100) {
    budgetWarning.textContent = "❌ Budget Exceeded!";
    budgetWarning.style.color = "red";
  } else if (usage >= 80) {
    budgetWarning.textContent = "⚠️ Nearing budget limit!";
    budgetWarning.style.color = "orange";
  } else {
    budgetWarning.textContent = "";
  }
}

// Save budget change
budgetInput.addEventListener("input", () => {
  localStorage.setItem("monthlyBudget", budgetInput.value);
  checkBudget();
});

// Load saved budget
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

// Load theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Initial setup
form.addEventListener("submit", addTransaction);
render();
