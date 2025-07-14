<?php
require 'db.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$stmt = $conn->prepare("SELECT budget FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$budget = $stmt->fetchColumn();

echo json_encode(['success' => true, 'budget' => $budget ?: 0]);
