<?php

return [
    'default' => env('CACHE_DRIVER', 'redis'),
    'stores' => [
        'array' => [
            'driver' => 'array',
        ],
        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
        ],
    ],
    'prefix' => env('CACHE_PREFIX', 'lumen_cache'),
];