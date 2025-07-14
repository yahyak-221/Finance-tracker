// DOM Elements
const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const incomeList = document.getElementById("income-list");
const expenseList = document.getElementById("expense-list");
const incomeSummary = document.getElementById("income-summary");
const expenseSummary = document.getElementById("expense-summary");
const netSummary = document.getElementById("net-summary");
const percentSummary = document.getElementById("percent-summary");
const budgetInput = document.getElementById("budget");
const budgetWarning = document.getElementById("budget-warning");
const typeSelect = document.getElementById("type-select");
const currencySelect = document.getElementById("currency-select");
const toggleBtn = document.getElementById("toggle-theme");

const editModal = document.getElementById("edit-modal");
const editText = document.getElementById("edit-text");
const editAmount = document.getElementById("edit-amount");
const editCategory = document.getElementById("edit-category");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currency = localStorage.getItem("selectedCurrency") || "₹";
currencySelect.value = currency;

// Populate edit-category dropdown
function populateEditCategories() {
  editCategory.innerHTML = categoryInput.innerHTML;
}
populateEditCategories();

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function formatCurrency(amount) {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

function addTransaction(e) {
  e.preventDefault();
  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();
  const type = typeSelect.value;
  const category = type === "expense" ? categoryInput.value : "Income";

  if (!text || !amount || !type || (type === "expense" && !category)) return;

  const txn = {
    id: Date.now(),
    text,
    amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
    type,
    category,
  };

  transactions.push(txn);
  saveData();
  form.reset();
  categoryInput.classList.add("hidden");
  render();
}

function removeTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;
  transactions = transactions.filter((t) => t.id !== id);
  saveData();
  render();
}

function editTransaction(id) {
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return;
  editText.value = txn.text;
  editAmount.value = Math.abs(txn.amount);
  editCategory.value = txn.category;
  editModal.classList.remove("hidden");
  editModal.dataset.id = id;
}

saveEditBtn.onclick = () => {
  const id = +editModal.dataset.id;
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return;
  txn.text = editText.value.trim();
  txn.amount =
    txn.amount < 0 ? -Math.abs(+editAmount.value) : +editAmount.value;
  txn.category = editCategory.value;
  saveData();
  editModal.classList.add("hidden");
  render();
};

cancelEditBtn.onclick = () => {
  editModal.classList.add("hidden");
};

typeSelect.onchange = () => {
  if (typeSelect.value === "expense") {
    categoryInput.classList.remove("hidden");
    categoryInput.setAttribute("required", "required");
  } else {
    categoryInput.classList.add("hidden");
    categoryInput.removeAttribute("required");
    categoryInput.value = "";
  }
};

currencySelect.onchange = () => {
  currency = currencySelect.value;
  localStorage.setItem("selectedCurrency", currency);
  render();
};

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

budgetInput.oninput = () => {
  localStorage.setItem("monthlyBudget", budgetInput.value);
  render();
};

const savedBudget = localStorage.getItem("monthlyBudget");
if (savedBudget) budgetInput.value = savedBudget;

function render() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    const el = document.createElement("li");
    el.innerHTML = `
    <div class="transaction-content">
      ${t.text} (${t.category})
    </div>
    <div class="transaction-right">
      <span>${formatCurrency(t.amount)}</span>
      <button onclick="editTransaction(${t.id})" title="Edit">✏️</button>
      <button onclick="removeTransaction(${t.id})" title="Delete">❌</button>
    </div>
  `;

    if (t.amount < 0) {
      expense += t.amount;
      expenseList.appendChild(el);
    } else {
      income += t.amount;
      incomeList.appendChild(el);
    }
  });

  const net = income + expense;
  const budget = +budgetInput.value || 0;
  const percentUsed = budget
    ? ((Math.abs(expense) / budget) * 100).toFixed(1)
    : 0;

  incomeSummary.textContent = formatCurrency(income);
  expenseSummary.textContent = formatCurrency(Math.abs(expense));
  netSummary.textContent = formatCurrency(net);
  percentSummary.textContent = `${percentUsed}%`;

  if (!budget) {
    budgetWarning.textContent = "";
  } else if (percentUsed >= 100) {
    budgetWarning.textContent = "❌ Budget Exceeded!";
    budgetWarning.style.color = "red";
  } else if (percentUsed >= 80) {
    budgetWarning.textContent = "⚠️ Nearing budget limit!";
    budgetWarning.style.color = "orange";
  } else {
    budgetWarning.textContent = "";
  }

  updateChart();
}

let chart;
function updateChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  const categories = {};

  transactions.forEach((t) => {
    if (t.amount < 0) {
      categories[t.category] =
        (categories[t.category] || 0) + Math.abs(t.amount);
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
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
  };

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "doughnut",
    data,
    options: {
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.label}: ${currency}${context.formattedValue}`,
          },
        },
      },
    },
  });
}

form.addEventListener("submit", addTransaction);

new Sortable(incomeList, {
  onEnd: (evt) => {
    const incomeTxns = transactions.filter((t) => t.amount >= 0);
    const expenseTxns = transactions.filter((t) => t.amount < 0);
    const moved = incomeTxns.splice(evt.oldIndex, 1)[0];
    incomeTxns.splice(evt.newIndex, 0, moved);
    transactions = [...incomeTxns, ...expenseTxns];
    saveData();
    render();
  },
});

new Sortable(expenseList, {
  onEnd: (evt) => {
    const incomeTxns = transactions.filter((t) => t.amount >= 0);
    const expenseTxns = transactions.filter((t) => t.amount < 0);
    const moved = expenseTxns.splice(evt.oldIndex, 1)[0];
    expenseTxns.splice(evt.newIndex, 0, moved);
    transactions = [...incomeTxns, ...expenseTxns];
    saveData();
    render();
  },
});

render();
