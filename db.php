<?php
$host = 'localhost';
$dbname = 'finance_tracker';
$username = 'root'; // change if needed
$password = '';     // change if needed

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
