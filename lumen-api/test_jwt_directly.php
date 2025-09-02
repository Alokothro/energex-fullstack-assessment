<?php

require_once __DIR__.'/vendor/autoload.php';

// Load the phpunit.xml environment variables manually
$phpunitXml = simplexml_load_file(__DIR__ . '/phpunit.xml');
foreach ($phpunitXml->php->env as $env) {
    $name = (string)$env['name'];
    $value = (string)$env['value'];
    putenv("$name=$value");
    $_ENV[$name] = $value;
}

$app = require __DIR__.'/bootstrap/app.php';
$app->boot();

// Test direct JWT token creation
try {
    echo "Testing direct JWT functionality...\n";
    echo "JWT_SECRET: " . (env('JWT_SECRET') ? 'SET (' . strlen(env('JWT_SECRET')) . ' chars)' : 'NULL') . "\n";
    
    $user = new \App\Models\User();
    $user->id = 1;
    $user->name = 'Test User';
    $user->email = 'test@example.com';
    
    $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);
    echo "✓ JWT token created: " . substr($token, 0, 50) . "...\n";
    
    // Test validation
    $payload = \Tymon\JWTAuth\Facades\JWTAuth::setToken($token)->getPayload();
    echo "✓ JWT token validated, user ID: " . $payload->get('sub') . "\n";
    
} catch (\Exception $e) {
    echo "✗ JWT Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

// Test database connection
try {
    echo "\nTesting database connection...\n";
    $pdo = $app['db']->connection()->getPdo();
    echo "✓ Database connected\n";
    
    // Test if migrations table exists
    $result = $pdo->query("SHOW TABLES LIKE 'users'")->fetchAll();
    if ($result) {
        echo "✓ Users table exists\n";
    } else {
        echo "✗ Users table does not exist\n";
    }
    
} catch (\Exception $e) {
    echo "✗ Database Error: " . $e->getMessage() . "\n";
}