<?php
session_start();

// Redirect to home page if user not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../");
    exit();
}

$username = isset($_SESSION['username']) ? $_SESSION['username'] : 'User';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clean Ledger - A Finance Tracker App!</title>
    <link rel="shortcut icon" href="../assets/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="./style.css" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
</head>

<body>
    <div class="top-actions">
        <form id="logout-form" action="logout.php" method="post">
            <button type="submit" class="btn-secondary" title="Logout">🚪</button>
        </form>
        <button id="toggle-theme" class="btn-secondary" aria-label="Toggle Dark Mode">🌙</button>
        <script>
            document.getElementById("logout-form").addEventListener("submit", function(e) {
                if (!confirm("Are you sure you want to logout?")) {
                    e.preventDefault();
                }
            });
        </script>
    </div>






    <div class="app-container">
        <header class="summary-header">
            <h1 class="brand">Clean Ledger - Welcome, <?php echo htmlspecialchars($username); ?>!</h1>

            <div class="summary-grid">
                <div class="summary-card income">
                    <div class="icon"><i class="fas fa-arrow-down"></i></div>
                    <div class="info">
                        <h3>Income</h3>
                        <p id="income-summary">₹0.00</p>
                    </div>
                </div>
                <div class="summary-card expense">
                    <div class="icon"><i class="fas fa-arrow-up"></i></div>
                    <div class="info">
                        <h3>Expenses</h3>
                        <p id="expense-summary">₹0.00</p>
                    </div>
                </div>
                <div class="summary-card net">
                    <div class="icon"><i class="fas fa-wallet"></i></div>
                    <div class="info">
                        <h3>Net Savings</h3>
                        <p id="net-summary">₹0.00</p>
                    </div>
                </div>
                <div class="summary-card percentage">
                    <div class="icon"><i class="fas fa-percentage"></i></div>
                    <div class="info">
                        <h3>% Used</h3>
                        <p id="percent-summary">0%</p>
                    </div>
                </div>
            </div>
            <form id="budget-form" class="budget-setter">
                <label for="budget">Monthly Budget:</label>
                <input type="number" id="budget" placeholder="Set your goal..." />
                <div id="budget-warning" class="budget-warning"></div>
                <button type="submit" class="btn-primary">Save Budget</button>
            </form>

        </header>

        <main class="transaction-area">
            <form id="transaction-form" class="transaction-form">
                <input type="text" id="text" placeholder="Description" required />
                <input type="number" id="amount" placeholder="Amount" required />
                <div class="custom-dropdown" id="type-dropdown">
                    <div class="selected" id="type-selected">Transaction Type</div>
                    <ul class="dropdown-list hidden">
                        <li data-value="income">Income</li>
                        <li data-value="expense">Expense</li>
                    </ul>
                </div>
                <input type="hidden" id="type-select" name="type" required>
                <script>
                    const customDropdown = document.getElementById("type-dropdown");
                    const selected = document.getElementById("type-selected");
                    const dropdownList = customDropdown.querySelector(".dropdown-list");
                    const hiddenInput = document.getElementById("type-select");

                    selected.addEventListener("click", () => {
                        dropdownList.classList.toggle("hidden");
                    });

                    dropdownList.querySelectorAll("li").forEach((item) => {
                        item.addEventListener("click", () => {
                            selected.textContent = item.textContent;
                            hiddenInput.value = item.dataset.value;
                            dropdownList.classList.add("hidden");
                            // Trigger the onchange event manually (for category toggle)
                            hiddenInput.dispatchEvent(new Event("change"));
                        });
                    });

                    // Close if clicked outside
                    document.addEventListener("click", (e) => {
                        if (!customDropdown.contains(e.target)) {
                            dropdownList.classList.add("hidden");
                        }
                    });
                </script>
                <select id="category" class="hidden">
                    <option value="">Select Category</option>
                    <option value="Books">Books</option>
                    <option value="Charity">Charity</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Food">Food</option>
                    <option value="Health & Hygiene">Health & Hygiene</option>
                    <option value="Housing">Housing</option>
                    <option value="Medical">Medical</option>
                    <option value="School Work">School Work</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Tuition & School Fees">Tuition & School Fees</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                </select>
                <select id="currency-select">
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                </select>
                <button type="submit" class="btn-primary">Add</button>
            </form>

            <div class="transaction-history">
                <h2>Income Transactions</h2>
                <ul id="income-list"></ul>
                <br>
                <br>
                <br>
                <h2>Expense Transactions</h2>
                <ul id="expense-list"></ul>
            </div>
        </main>

        <section class="chart-section">
            <h2>Spending Overview</h2>
            <canvas id="chart"></canvas>
        </section>
    </div>

    <div id="edit-modal" class="modal hidden">
        <div class="modal-content">
            <h3>Edit Transaction</h3>
            <input type="text" id="edit-text" />
            <input type="number" id="edit-amount" />
            <select id="edit-category"></select>
            <div class="modal-actions">
                <button id="save-edit" class="btn-primary">Save</button>
                <button id="cancel-edit" class="btn-secondary">Cancel</button>
            </div>
        </div>
    </div>

    <script src="./script.js"></script>
</body>

</html>