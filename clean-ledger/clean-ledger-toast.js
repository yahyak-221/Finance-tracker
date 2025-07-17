document.addEventListener("DOMContentLoaded", function () {
  function showToast(message, color = "#007aff") {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "bottom",
      position: "left",
      backgroundColor: color,
      stopOnFocus: true,
    }).showToast();
  }

  const budgetForm = document.getElementById("budget-form");
  if (budgetForm) {
    budgetForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const budgetValue = document.getElementById("budget").value.trim();
      if (budgetValue && parseFloat(budgetValue) > 0) {
        localStorage.setItem("budget", budgetValue);
        showToast("Budget saved!", "#28a745");
      } else {
        showToast("Please enter a valid budget", "#dc3545");
      }
    });
  }

  const transactionForm = document.getElementById("transaction-form");
  if (transactionForm) {
    transactionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const text = document.getElementById("text").value.trim();
      const amount = parseFloat(document.getElementById("amount").value.trim());
      const type = document.getElementById("type-select").value;
      const category = document.getElementById("category").value;
      const currency = document.getElementById("currency-select").value;

      if (text && !isNaN(amount) && type) {
        const message =
          type === "income" ? "Income recorded!" : "Expense recorded!";
        const color = type === "income" ? "#198754" : "#dc3545";
        showToast(message, color);

        transactionForm.reset();
        document.getElementById("type-selected").textContent =
          "Transaction Type";
      } else {
        showToast("Please fill out all fields!", "#ffc107");
      }
    });
  }

  const saveEdit = document.getElementById("save-edit");
  if (saveEdit) {
    saveEdit.addEventListener("click", function () {
      const text = document.getElementById("edit-text").value.trim();
      const amount = parseFloat(
        document.getElementById("edit-amount").value.trim()
      );
      const category = document.getElementById("edit-category").value;

      if (text && !isNaN(amount)) {
        showToast("Transaction updated!", "#17a2b8");
        document.getElementById("edit-modal").classList.add("hidden");
      } else {
        showToast("Invalid edit fields!", "#ffc107");
      }
    });
  }
});
