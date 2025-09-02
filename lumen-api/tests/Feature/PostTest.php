<?php

namespace Tests\Feature;

use Tests\TestCase;
use Laravel\Lumen\Testing\DatabaseMigrations;
use App\Models\User;
use App\Models\Post;

class PostTest extends TestCase
{
    use DatabaseMigrations;

    protected function getAuthToken()
    {
        $response = $this->json('POST', '/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $content = json_decode($response->response->getContent());
        
        // Debug output for CI
        if (!isset($content->token)) {
            echo "\nRegistration failed with status: " . $response->response->getStatusCode();
            echo "\nResponse content: " . $response->response->getContent();
            $this->fail('Registration failed - no token returned');
        }
        
        return $content->token;
    }

    public function testCanGetAllPosts()
    {
        $user = User::factory()->create();
        Post::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->json('GET', '/api/posts');
        
        $response->seeStatusCode(200);
        $this->assertCount(3, json_decode($response->response->getContent()));
    }

    public function testCanCreatePost()
    {
        // Ensure migrations are run
        $this->artisan('migrate');
        
        $token = $this->getAuthToken();

        // Debug: Check if user was created
        $userCount = \App\Models\User::count();
        echo "\nUsers in database after registration: $userCount\n";

        $response = $this->json('POST', '/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is a test post content.',
        ], ['Authorization' => "Bearer $token"]);

        if ($response->response->getStatusCode() !== 201) {
            echo "\nPost creation failed with status: " . $response->response->getStatusCode();
            echo "\nResponse: " . $response->response->getContent() . "\n";
        }

        $response->seeStatusCode(201);
        $response->seeJsonStructure([
            'id',
            'title',
            'content',
            'user_id',
            'created_at',
            'updated_at',
            'user'
        ]);
    }

    public function testCanGetSinglePost()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->json('GET', "/api/posts/{$post->id}");
        
        $response->seeStatusCode(200);
        $response->seeJson([
            'id' => $post->id,
            'title' => $post->title,
        ]);
    }

    public function testUnauthorizedCannotCreatePost()
    {
        $response = $this->json('POST', '/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is a test post content.',
        ]);

        $response->seeStatusCode(401);
    }
}