<?php
require 'db.php';
session_start();

$toastMessage = "";
$toastType = ""; // "success" or "error"

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        $toastMessage = "User already exists.";
        $toastType = "error";
    } else {
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        if ($stmt->execute([$username, $email, $hashedPassword])) {
            $toastMessage = "Signup successful. Redirecting to login...";
            $toastType = "success";
            echo "<script>setTimeout(() => window.location.href='login.php', 3000);</script>";
        } else {
            $toastMessage = "Signup failed. Please try again.";
            $toastType = "error";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signup - Clean Ledger</title>
    <link rel="shortcut icon" href="./assets/favicon.png" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f9f9fb;
  color: #111;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: background-color 0.4s ease, color 0.4s ease;
">
    <!-- 🌗 Toggle Button -->
    <button id="toggle-theme" aria-label="Toggle Dark Mode" style="
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    color: #111;
    border: none;
    border-radius: 50%;
    padding: 10px 12px;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.4s ease, color 0.4s ease;
    z-index: 1000;
  ">🌙</button>

    <!-- Sign Up Form -->
    <form method="post" action="signup.php" style="
    background-color: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 400px;
    transition: background-color 0.4s ease, color 0.4s ease;
  ">
        <h2 id="form-title" style="margin-bottom: 24px; text-align: center;">Clean Ledger - Sign Up</h2>

        <input type="text" name="username" placeholder="Username" required style="
      width: 100%;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 16px;
      font-size: 15px;
      background-color: #fff;
      color: #111;
      transition: background-color 0.4s ease, color 0.4s ease;
    ">

        <input type="email" name="email" placeholder="Email" required style="
      width: 100%;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 16px;
      font-size: 15px;
      background-color: #fff;
      color: #111;
      transition: background-color 0.4s ease, color 0.4s ease;
    ">

        <input type="password" name="password" placeholder="Password" required style="
      width: 100%;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 24px;
      font-size: 15px;
      background-color: #fff;
      color: #111;
      transition: background-color 0.4s ease, color 0.4s ease;
    ">

        <button type="submit" style="
      width: 100%;
      padding: 12px;
      background-color: #007aff;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
    ">Sign Up</button>

        <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #555;">
            Already have an account? <a href="login.php" style="color: #007aff; text-decoration: none;">Login</a>
        </p>
        <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #555;">
            Go <a href="./" style="color: #007aff; text-decoration: none;">Home</a>
        </p>
    </form>

    <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>

    <!-- 🌙 Dark Mode Script with LocalStorage -->
    <script>
        const toggleBtn = document.getElementById("toggle-theme");
        const body = document.body;
        const form = document.querySelector("form");
        const inputs = document.querySelectorAll("input");
        const title = document.getElementById("form-title");

        // Apply saved theme from localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") applyDarkMode(true);

        toggleBtn.addEventListener("click", () => {
            const isDark = body.classList.toggle("dark");
            applyDarkMode(isDark);
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });

        function applyDarkMode(isDark) {
            body.style.backgroundColor = isDark ? "#121212" : "#f9f9fb";
            body.style.color = isDark ? "#f5f5f5" : "#111";
            form.style.backgroundColor = isDark ? "#1f1f1f" : "#fff";
            form.style.color = isDark ? "#f5f5f5" : "#111";
            title.style.color = isDark ? "#f5f5f5" : "#111";
            toggleBtn.textContent = isDark ? "☀️" : "🌙";
            toggleBtn.style.background = isDark ? "#2a2a2a" : "#fff";
            toggleBtn.style.color = isDark ? "#f5f5f5" : "#111";

            inputs.forEach(input => {
                input.style.backgroundColor = isDark ? "#2a2a2a" : "#fff";
                input.style.color = isDark ? "#f5f5f5" : "#111";
            });
        }

        // ✅ Toast Message
        const toastMessage = <?= json_encode($toastMessage) ?>;
        const toastType = <?= json_encode($toastType) ?>;
        if (toastMessage) {
            Toastify({
                text: toastMessage,
                duration: 3000,
                gravity: "bottom",
                position: "left",
                backgroundColor: toastType === "success" ? "#28a745" : "#dc3545",
                stopOnFocus: true,
                close: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    borderRadius: "8px",
                    fontSize: "14px"
                }
            }).showToast();
        }
    </script>
</body>

</html>