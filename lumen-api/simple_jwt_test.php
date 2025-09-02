<?php
require_once __DIR__."/vendor/autoload.php";

$app = require __DIR__."/bootstrap/app.php";
$app->boot();

echo "Testing JWT with .env configuration...\n";
echo "JWT_SECRET length: " . strlen(env("JWT_SECRET")) . " chars\n";

try {
    $user = new \App\Models\User();
    $user->id = 1;
    $user->name = "Test User";
    $user->email = "test@example.com";
    
    $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);
    echo "✓ JWT token created successfully: " . substr($token, 0, 50) . "...\n";
    
    $payload = \Tymon\JWTAuth\Facades\JWTAuth::setToken($token)->getPayload();
    echo "✓ JWT token validated, user ID: " . $payload->get("sub") . "\n";
    
} catch (\Exception $e) {
    echo "✗ JWT Error: " . $e->getMessage() . "\n";
}
