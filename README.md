# 💰 Clean Ledger - A Simple Finance Tracker

**Clean Ledger** is a modern and lightweight full-stack finance tracker that helps you manage your income, expenses, and budget — beautifully.

It includes user authentication, transaction categorization, budget tracking, and supports both light and dark themes with smooth UI interactions and toast notifications.

---

## 🚀 Features

1. **Authentication System**

   - Secure login/signup with hashed passwords using PHP + MySQL (via PDO).
   - Session-based authentication.

2. **Budget Management**

   - Set your monthly budget.
   - Real-time summary of your spending vs budget.

3. **Transaction Tracker**

   - Add income or expense with categories.
   - Fully editable and deletable entries.
   - Automatic transaction sorting and display.

4. **Visual Insights**

   - Dynamic pie chart using Chart.js to show spending breakdown.
   - Live net savings and percentage used.

5. **User Interface**

   - Responsive design using modern CSS with Inter font.
   - Smooth theme toggle (light/dark) using localStorage.
   - Custom dropdowns and modal windows.
   - Toast notifications for success/error (via Toastify.js).

6. **Technology Stack**
   - **Frontend:** HTML, CSS, JS, Toastify.js, Chart.js
   - **Backend:** PHP (PDO) + MySQL
   - **Data Persistence:** MySQL DB (Transactions, Users)

---

## 📁 Project Structure

clean-ledger/
├── assets/ # Images, icons, favicon
├── clean-ledger/ # Core finance tracker
│ ├── index.html
│ ├── script.js
│ ├── style.css
│ ├── toast.js
│ ├── fetch.php
│ ├── add.php
│ ├── edit.php
│ └── delete.php
├── login.php
├── signup.php
├── logout.php
├── db.php
└── README.md
