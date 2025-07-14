<?php
require 'db.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$budget = floatval($data['budget']);

$stmt = $conn->prepare("UPDATE users SET budget = ? WHERE id = ?");
if ($stmt->execute([$budget, $_SESSION['user_id']])) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}
