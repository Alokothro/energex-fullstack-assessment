<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/', function () use ($router) {
    return response()->json([
        'name' => 'Microservice API',
        'version' => '1.0.0',
        'framework' => $router->app->version()
    ]);
});

$router->group(['prefix' => 'api'], function () use ($router) {
    // Authentication routes
    $router->post('register', 'AuthController@register');
    $router->post('login', 'AuthController@login');
    
    // Protected routes
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->get('me', 'AuthController@me');
        $router->post('logout', 'AuthController@logout');
        $router->post('refresh', 'AuthController@refresh');
    });
    
    // Posts routes
    $router->get('posts', 'PostController@index');
    $router->get('posts/{id}', 'PostController@show');
    
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->post('posts', 'PostController@store');
        $router->put('posts/{id}', 'PostController@update');
        $router->delete('posts/{id}', 'PostController@destroy');
    });
});