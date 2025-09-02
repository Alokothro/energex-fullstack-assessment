<?php

namespace Tests\Feature;

use Tests\TestCase;
use Laravel\Lumen\Testing\DatabaseMigrations;

class AuthTest extends TestCase
{
    use DatabaseMigrations;

    public function testUserCanRegister()
    {
        $response = $this->json('POST', '/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);


        $response->seeStatusCode(201);
        $response->seeJsonStructure([
            'user' => ['id', 'name', 'email'],
            'token',
            'token_type',
            'expires_in'
        ]);
    }

    public function testUserCanLogin()
    {
        $this->json('POST', '/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response = $this->json('POST', '/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'access_token',
            'token_type',
            'expires_in',
            'user'
        ]);
    }

    public function testInvalidLoginFails()
    {
        $response = $this->json('POST', '/api/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->seeStatusCode(401);
    }
}