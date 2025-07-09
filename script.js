// DOM Elements
const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("transaction-history");
const balanceEl = document.getElementById("card-net");
const incomeEl = document.getElementById("card-income");
const expenseEl = document.getElementById("card-expense");
const percentEl = document.getElementById("card-percentage");
const toggleBtn = document.getElementById("toggle-theme");
const budgetInput = document.getElementById("budget");
const budgetWarning = document.getElementById("budget-warning");

const editModal = document.getElementById("edit-modal");
const editText = document.getElementById("edit-text");
const editAmount = document.getElementById("edit-amount");
const editCategory = document.getElementById("edit-category");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

const searchText = document.getElementById("search-text");
const searchCategory = document.getElementById("search-category");

const currencySelect = document.getElementById("currency-select");
const typeSelect = document.getElementById("type-select");

// Data
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let filteredTransactions = [...transactions];
let editId = null;
let currency = localStorage.getItem("selectedCurrency") || "₹";

// Save to localStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Format currency
function formatCurrency(amount) {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  let amount = +amountInput.value.trim();
  const category = categoryInput.value;
  const type = typeSelect.value;

  if (
    text &&
    amount &&
    type &&
    (type === "income" || (type === "expense" && category))
  ) {
    amount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

    const transaction = {
      id: Date.now(),
      text,
      amount,
      type,
      category: type === "income" ? "Income" : category,
    };

    transactions.push(transaction);
    saveData();
    applyFilters();
  }

  form.reset();
  categoryInput.classList.add("hidden");
}

// Edit transaction
function editTransaction(id) {
  const t = transactions.find((txn) => txn.id === id);
  if (!t) return;

  editText.value = t.text;
  editAmount.value = Math.abs(t.amount);
  editCategory.value = t.category;
  editId = id;
  editModal.classList.remove("hidden");
}

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
            amount: t.amount < 0 ? -updatedAmount : updatedAmount,
            category: updatedCategory,
          }
        : t
    );
    saveData();
    editModal.classList.add("hidden");
    editId = null;
    applyFilters();
  }
});

cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editId = null;
});

// Delete transaction
function removeTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;
  transactions = transactions.filter((t) => t.id !== id);
  saveData();
  applyFilters();
}

// Search/Filter
function applyFilters() {
  const text = searchText.value.toLowerCase();
  const category = searchCategory.value;

  filteredTransactions = transactions.filter((t) => {
    const matchText = t.text.toLowerCase().includes(text);
    const matchCategory = !category || t.category === category;
    return matchText && matchCategory;
  });

  render();
}

// Render
function render() {
  list.innerHTML = "";
  let income = 0;
  let expense = 0;

  filteredTransactions.forEach((t) => {
    const sign = t.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(t.amount < 0 ? "expense" : "income");
    item.innerHTML = `
      ${t.text} (${t.category}) <span>${sign}${formatCurrency(t.amount)}</span>
      <button onclick="editTransaction(${t.id})">✏️</button>
      <button onclick="removeTransaction(${t.id})">❌</button>
    `;
    list.appendChild(item);

    if (t.amount < 0) expense += t.amount;
    else income += t.amount;
  });

  const net = income + expense;
  const totalBudget = +budgetInput.value || 0;
  const percentUsed = totalBudget
    ? ((Math.abs(expense) / totalBudget) * 100).toFixed(1)
    : 0;

  balanceEl.textContent = `Net: ${formatCurrency(net)}`;
  incomeEl.textContent = `Income: ${formatCurrency(income)}`;
  expenseEl.textContent = `Expense: ${formatCurrency(Math.abs(expense))}`;
  percentEl.textContent = `Budget used: ${percentUsed}%`;

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
            "#4caf50",
            "#ff5722",
            "#607d8b",
            "#e91e63",
            "#795548",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${labels[context.dataIndex]}: ${currency}${
                context.formattedValue
              }`,
          },
        },
      },
    },
  });
}

// Budget
function checkBudget() {
  const budget = +budgetInput.value;
  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const used = Math.abs(totalExpense);
  const usage = (used / budget) * 100;

  if (!budget) {
    budgetWarning.textContent = "";
    return;
  }

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

// Event listeners
budgetInput.addEventListener("input", () => {
  localStorage.setItem("monthlyBudget", budgetInput.value);
  checkBudget();
});

const savedBudget = localStorage.getItem("monthlyBudget");
if (savedBudget) budgetInput.value = savedBudget;

currencySelect.addEventListener("change", () => {
  currency = currencySelect.value;
  localStorage.setItem("selectedCurrency", currency);
  render();
});
currencySelect.value = currency;

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

typeSelect.addEventListener("change", () => {
  if (typeSelect.value === "expense") {
    categoryInput.classList.remove("hidden");
    categoryInput.setAttribute("required", "required");
  } else {
    categoryInput.classList.add("hidden");
    categoryInput.removeAttribute("required");
    categoryInput.value = "";
  }
});

searchText.addEventListener("input", applyFilters);
searchCategory.addEventListener("change", applyFilters);
form.addEventListener("submit", addTransaction);

const sortable = new Sortable(list, {
  onEnd: (evt) => {
    const moved = filteredTransactions.splice(evt.oldIndex, 1)[0];
    filteredTransactions.splice(evt.newIndex, 0, moved);
    transactions = filteredTransactions;
    saveData();
    render();
  },
});

applyFilters();
