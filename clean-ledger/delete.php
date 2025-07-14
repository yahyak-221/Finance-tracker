<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$txn_id = intval($data['id'] ?? 0);

if (!$txn_id) {
    echo json_encode(["success" => false, "message" => "Invalid transaction ID"]);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?");
    $stmt->execute([$txn_id, $_SESSION['user_id']]);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
