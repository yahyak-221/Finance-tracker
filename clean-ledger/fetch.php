<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT id, title AS text, title, amount, category, type FROM transactions WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ensure amount is numeric
    foreach ($transactions as &$txn) {
        $txn['amount'] = (float)$txn['amount'];
    }

    echo json_encode(['success' => true, 'transactions' => $transactions]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
