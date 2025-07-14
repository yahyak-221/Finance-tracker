<?php
require 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

// Get raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['title']) ||
    !isset($data['amount']) ||
    !isset($data['category']) ||
    !isset($data['type'])
) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

$title = trim($data['title']);
$amount = floatval($data['amount']);
$category = trim($data['category']);
$type = trim($data['type']);
$user_id = $_SESSION['user_id'];

if ($title === '' || $amount === 0 || $type === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields correctly.']);
    exit();
}

// Make sure expenses are stored as negative values
if ($type === 'expense' && $amount > 0) {
    $amount = -$amount;
}

try {
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, title, amount, category, type) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $title, $amount, $category, $type]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
