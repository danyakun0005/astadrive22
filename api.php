<?php
$file = __DIR__ . '/data.json';

// CORS for all origins
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (file_exists($file)) {
    echo file_get_contents($file);
  } else {
    echo '{}';
  }
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $raw = file_get_contents('php://input');
  if (!$raw) { http_response_code(400); echo '{"error":"empty"}'; exit; }
  $data = json_decode($raw, true);
  if ($data === null) { http_response_code(400); echo '{"error":"invalid json"}'; exit; }

  // Auth check
  $password = 'astadrive22';
  $sentPass = isset($_SERVER['HTTP_X_ADMIN_PASS']) ? $_SERVER['HTTP_X_ADMIN_PASS'] : '';
  if ($sentPass !== $password) {
    http_response_code(403);
    echo '{"error":"wrong password"}';
    exit;
  }

  file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE));
  echo '{"ok":true}';
  exit;
}

http_response_code(405);
echo '{"error":"method not allowed"}';
