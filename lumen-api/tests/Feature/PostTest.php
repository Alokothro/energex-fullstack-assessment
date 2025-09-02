<?php

namespace Tests\Feature;

use Tests\TestCase;
use Laravel\Lumen\Testing\DatabaseMigrations;
use App\Models\User;
use App\Models\Post;

class PostTest extends TestCase
{
    use DatabaseMigrations;


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
        // Create and authenticate user
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->json('POST', '/api/posts', [
                'title' => 'Test Post',
                'content' => 'This is a test post content.',
            ]);

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