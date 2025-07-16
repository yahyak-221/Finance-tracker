# 💰 Clean Ledger - A Simple Finance Tracker

**Clean Ledger** is a modern, lightweight, full-stack finance tracker built to help users efficiently manage their income, expenses, and monthly budgets. With a sleek UI, secure backend, and real-time data handling, it provides everything you need to stay financially organized.

---

## 🚀 Features

### 🔐 Authentication System

- Secure login and signup with hashed passwords using **PHP + MySQL (PDO)**.
- Session-based authentication with automatic redirection on logout or unauthorized access.

### 💵 Budget Management

- Set a custom monthly budget.
- Visual feedback on how much you've spent vs. remaining budget.
- Dynamic budget updates saved directly to the database.

### 📊 Transaction Tracker

- Add, edit, or delete income and expense entries.
- Supports categories for easier filtering and analysis.
- Real-time balance and sorting functionality.

### 📈 Visual Insights

- Dynamic **Chart.js** pie chart to visualize category-wise spending.
- Displays savings, total income, and total expenses dynamically.

### 🧑‍🎨 User Interface

- Responsive and clean UI with **Inter font**.
- Supports **light/dark theme** toggle via `localStorage`.
- Animated dropdowns, modals, and transitions for a smooth UX.
- **Toastify.js**-based toast notifications for actions like adding, editing, or saving.

---

## 🛠️ Technology Stack

- **Frontend:** HTML, CSS, JavaScript, Chart.js, Toastify.js
- **Backend:** PHP (PDO) + MySQL
- **Database:** MySQL with tables for users, transactions, and budget

---

## 📁 Project Structure

├── CLEANLEDGER/
│ ├── assets/
│ │ ├── clean-ledger/
│ │ │ ├── add.php
│ │ │ ├── clean-ledger-toast.js
│ │ │ ├── conversion.js
│ │ │ ├── db.php
│ │ │ ├── delete.php
│ │ │ ├── edit.php
│ │ │ ├── fetch.php
│ │ │ ├── get_budget.php
│ │ │ ├── index.php
│ │ │ ├── logout.php
│ │ │ ├── script.js
│ │ │ ├── style.css
│ │ │ └── update_budget.php
│ │ └── img/
│ ├── 1hahahah.php
│ ├── dp.php
│ ├── index.html
│ ├── login.php
│ ├── README.md
│ ├── signup.php
│ └── style.css
