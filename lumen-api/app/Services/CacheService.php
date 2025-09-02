<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    public function remember($key, $ttl, $callback)
    {
        return Cache::remember($key, $ttl, $callback);
    }

    public function forget($key)
    {
        return Cache::forget($key);
    }

    public function flush()
    {
        return Cache::flush();
    }
}