<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;

class CacheService
{
    public function remember($key, $ttl, $callback)
    {
        $cached = Redis::get($key);
        
        if ($cached) {
            return json_decode($cached, true);
        }

        $data = $callback();
        Redis::setex($key, $ttl, json_encode($data));
        
        return $data;
    }

    public function forget($key)
    {
        return Redis::del($key);
    }

    public function flush()
    {
        return Redis::flushall();
    }
}