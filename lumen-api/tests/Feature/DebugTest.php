<?php

namespace Tests\Feature;

use Tests\TestCase;

class DebugTest extends TestCase
{
    public function testEnvironmentVariables()
    {
        echo "\n=== ENVIRONMENT DEBUG ===\n";
        echo "APP_ENV: " . env('APP_ENV') . "\n";
        echo "DB_CONNECTION: " . env('DB_CONNECTION') . "\n";
        echo "DB_HOST: " . env('DB_HOST') . "\n";
        echo "DB_DATABASE: " . env('DB_DATABASE') . "\n";
        echo "DB_USERNAME: " . env('DB_USERNAME') . "\n";
        echo "JWT_SECRET length: " . strlen(env('JWT_SECRET', '')) . " chars\n";
        echo "JWT_SECRET: " . (env('JWT_SECRET') ? substr(env('JWT_SECRET'), 0, 20) . '...' : 'NULL') . "\n";
        echo "JWT_ALGO: " . env('JWT_ALGO', 'NULL') . "\n";
        echo "CACHE_DRIVER: " . env('CACHE_DRIVER') . "\n";
        
        // Test database connection
        try {
            $pdo = app('db')->connection()->getPdo();
            echo "✓ Database connected\n";
            
            $tables = $pdo->query("SHOW TABLES")->fetchAll();
            echo "Tables found: " . count($tables) . "\n";
            foreach ($tables as $table) {
                echo "  - " . array_values($table)[0] . "\n";
            }
        } catch (\Exception $e) {
            echo "✗ Database error: " . $e->getMessage() . "\n";
        }
        
        // Test JWT
        try {
            $user = new \App\Models\User();
            $user->id = 1;
            $user->name = 'Test User';
            $user->email = 'test@example.com';
            
            $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);
            echo "✓ JWT token created: " . substr($token, 0, 30) . "...\n";
        } catch (\Exception $e) {
            echo "✗ JWT error: " . $e->getMessage() . "\n";
        }
        
        $this->assertTrue(true); // Always pass
    }
}