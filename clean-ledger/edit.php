<?php
require 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['id']) ||
    !isset($data['title']) ||
    !isset($data['amount']) ||
    !isset($data['type'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit();
}

$id = (int)$data['id'];
$title = trim($data['title']);
$amount = floatval($data['amount']);
$category = isset($data['category']) ? trim($data['category']) : '';
$type = trim($data['type']);

if ($type === 'expense' && $category === '') {
    echo json_encode(['success' => false, 'message' => 'Category required for expense']);
    exit();
}

if ($type === 'expense' && $amount > 0) {
    $amount = -$amount;
}

try {
    $stmt = $conn->prepare("UPDATE transactions SET title = ?, amount = ?, category = ?, type = ? WHERE id = ? AND user_id = ?");
    $stmt->execute([$title, $amount, $category, $type, $id, $_SESSION['user_id']]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
