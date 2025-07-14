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
const budgetForm = document.getElementById("budget-form");
const typeSelect = document.getElementById("type-select");
const currencySelect = document.getElementById("currency-select");
const toggleBtn = document.getElementById("toggle-theme");

const editModal = document.getElementById("edit-modal");
const editText = document.getElementById("edit-text");
const editAmount = document.getElementById("edit-amount");
const editCategory = document.getElementById("edit-category");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

let transactions = [];
let currency = localStorage.getItem("selectedCurrency") || "₹";
currencySelect.value = currency;

function populateEditCategories() {
  editCategory.innerHTML = categoryInput.innerHTML;
}
populateEditCategories();

function formatCurrency(amount) {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

async function fetchBudget() {
  try {
    const res = await fetch("./get_budget.php");
    const data = await res.json();
    if (data.success) {
      budgetInput.value = data.budget || "";
      render();
    }
  } catch (err) {
    console.error("Error fetching budget:", err);
  }
}

budgetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const budget = parseFloat(budgetInput.value);
    const res = await fetch("./update_budget.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget }),
    });
    const result = await res.json();
    if (result.success) {
      render();
    } else {
      console.warn("Failed to save budget");
    }
  } catch (err) {
    console.error("Error saving budget:", err);
  }
});

currencySelect.onchange = () => {
  currency = currencySelect.value;
  localStorage.setItem("selectedCurrency", currency);
  render();
};

function toggleCategoryInput(select, input) {
  if (select.value === "expense") {
    input.classList.remove("hidden");
    input.setAttribute("required", "required");
  } else {
    input.classList.add("hidden");
    input.removeAttribute("required");
    input.value = "";
  }
}

typeSelect.onchange = () => toggleCategoryInput(typeSelect, categoryInput);

async function fetchTransactions() {
  try {
    const res = await fetch("./fetch.php");
    const data = await res.json();
    if (data.success) {
      transactions = data.transactions;
      render();
    } else {
      alert("Failed to fetch transactions: " + data.message);
    }
  } catch (err) {
    console.error("Error fetching transactions:", err);
  }
}

async function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();
  const type = typeSelect.value;
  const category = type === "expense" ? categoryInput.value : "";

  if (
    !text ||
    isNaN(amount) ||
    amount <= 0 ||
    (type === "expense" && !category)
  ) {
    alert("Please fill out all fields correctly.");
    return;
  }

  try {
    const res = await fetch("./add.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: text, amount, category, type }),
    });

    const result = await res.json();
    if (result.success) {
      form.reset();
      categoryInput.classList.add("hidden");
      fetchTransactions();
    } else {
      alert("Failed to add transaction: " + result.message);
    }
  } catch (err) {
    console.error("Error adding transaction:", err);
  }
}

async function removeTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  try {
    const res = await fetch("./delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.success) {
      fetchTransactions();
    } else {
      alert("Failed to delete: " + result.message);
    }
  } catch (err) {
    console.error("Error deleting transaction:", err);
  }
}

function editTransaction(id) {
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return;

  editText.value = txn.title;
  editAmount.value = Math.abs(txn.amount);
  editCategory.value = txn.category || "";

  editModal.dataset.id = id;
  editModal.dataset.type = txn.amount < 0 ? "expense" : "income";
  toggleCategoryInput({ value: editModal.dataset.type }, editCategory);
  editModal.classList.remove("hidden");
}

saveEditBtn.onclick = async () => {
  const id = +editModal.dataset.id;
  const type = editModal.dataset.type;
  const title = editText.value.trim();
  const amount = +editAmount.value;
  const category = type === "expense" ? editCategory.value : "";

  if (
    !title ||
    isNaN(amount) ||
    amount <= 0 ||
    (type === "expense" && !category)
  ) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const finalAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

  try {
    const res = await fetch("./edit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, amount: finalAmount, category, type }),
    });

    const result = await res.json();
    if (result.success) {
      editModal.classList.add("hidden");
      fetchTransactions();
    } else {
      alert("Failed to update: " + result.message);
    }
  } catch (err) {
    console.error("Error updating transaction:", err);
  }
};

cancelEditBtn.onclick = () => {
  editModal.classList.add("hidden");
};

function render() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    const el = document.createElement("li");
    el.innerHTML = `
  <div class="transaction-content">
    ${t.title || t.text}
  </div>
  <div class="transaction-right">
    <span>${formatCurrency(t.amount)}</span>
    <button onclick="editTransaction(${t.id})" title="Edit">✏️</button>
    <button onclick="removeTransaction(${t.id})" title="Delete">❌</button>
  </div>`;

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
      const cat = t.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + Math.abs(t.amount);
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
fetchTransactions();
fetchBudget();

new Sortable(incomeList, {
  onEnd: (evt) => {
    const incomeTxns = transactions.filter((t) => t.amount >= 0);
    const expenseTxns = transactions.filter((t) => t.amount < 0);
    const moved = incomeTxns.splice(evt.oldIndex, 1)[0];
    incomeTxns.splice(evt.newIndex, 0, moved);
    transactions = [...incomeTxns, ...expenseTxns];
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
    render();
  },
});
