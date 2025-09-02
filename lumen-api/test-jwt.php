<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

// Check if JWT_SECRET is available
echo "JWT_SECRET: " . (env('JWT_SECRET') ?: 'NULL') . "\n";

// Check if JWT service is registered
try {
    $jwt = $app->make('tymon.jwt');
    echo "JWT Service (tymon.jwt) registered successfully: " . get_class($jwt) . "\n";
} catch (\Exception $e) {
    echo "JWT Service (tymon.jwt) error: " . $e->getMessage() . "\n";
}

try {
    $jwtauth = $app->make('tymon.jwt.auth');
    echo "JWTAuth Service (tymon.jwt.auth) registered successfully: " . get_class($jwtauth) . "\n";
} catch (\Exception $e) {
    echo "JWTAuth Service (tymon.jwt.auth) error: " . $e->getMessage() . "\n";
}

// Check available auth drivers
try {
    $authManager = $app['auth'];
    echo "Auth manager class: " . get_class($authManager) . "\n";
    // Use reflection to see registered drivers
    $reflection = new \ReflectionClass($authManager);
    $property = $reflection->getProperty('customCreators');
    $property->setAccessible(true);
    $creators = $property->getValue($authManager);
    echo "Registered auth drivers: " . implode(', ', array_keys($creators)) . "\n";
} catch (\Exception $e) {
    echo "Auth reflection error: " . $e->getMessage() . "\n";
}

// Check if auth manager can find jwt driver
try {
    $guard = $app['auth']->guard('api');
    echo "Auth guard 'api' found: " . get_class($guard) . "\n";
} catch (\Exception $e) {
    echo "Auth guard error: " . $e->getMessage() . "\n";
}

// Try to create a JWT token
try {
    $user = new \App\Models\User();
    $user->id = 1;
    $user->name = 'Test User';
    $user->email = 'test@example.com';
    
    $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);
    echo "Token created successfully: " . $token . "\n";
} catch (\Exception $e) {
    echo "Error creating token: " . $e->getMessage() . "\n";
}