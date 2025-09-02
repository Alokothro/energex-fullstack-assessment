<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    protected $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->middleware('auth', ['except' => ['index', 'show']]);
        $this->cacheService = $cacheService;
    }

    public function index()
    {
        $cacheKey = 'posts:all';
        
        $posts = $this->cacheService->remember($cacheKey, 600, function () {
            return Post::with('user')->orderBy('created_at', 'desc')->get();
        });

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => Auth::id(),
        ]);

        // Clear cache
        $this->cacheService->forget('posts:all');

        return response()->json($post->load('user'), 201);
    }

    public function show($id)
    {
        $cacheKey = "posts:{$id}";
        
        $post = $this->cacheService->remember($cacheKey, 600, function () use ($id) {
            return Post::with('user')->findOrFail($id);
        });

        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $this->validate($request, [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);

        $post->update($request->only(['title', 'content']));

        // Clear cache
        $this->cacheService->forget('posts:all');
        $this->cacheService->forget("posts:{$id}");

        return response()->json($post->load('user'));
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $post->delete();

        // Clear cache
        $this->cacheService->forget('posts:all');
        $this->cacheService->forget("posts:{$id}");

        return response()->json(['message' => 'Post deleted successfully']);
    }
}