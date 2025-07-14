<?php
require 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user_id"] = $user["id"];
        header("Location: ./clean-ledger/"); // Replace with your app's main page
        exit();
    } else {
        echo "<p style='color:red; font-family:Inter,sans-serif;'>Invalid email or password.</p>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login - Clean Ledger</title>
    <link rel="shortcut icon" href="./assets/favicon.png" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
</head>

<body style="margin: 0; padding: 0; background-color: #f9f9fb; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;">

    <form method="post" action="login.php" style="
    background-color: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 400px;
  ">
        <h2 style="margin-bottom: 24px; color: #111; text-align: center;">Clean Ledger - Login</h2>

        <input type="email" name="email" placeholder="Email" required style="
      width: 100%;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 16px;
      font-size: 15px;
      background-color: #fff;
      color: #111;
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
    ">Login</button>

        <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #555;">
            Don't have an account? <a href="signup.php" style="color: #007aff; text-decoration: none;">Sign up</a>
        </p>
        <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #555;">
            Go <a href="./" style="color: #007aff; text-decoration: none;">Home</a>
        </p>
    </form>

</body>

</html>