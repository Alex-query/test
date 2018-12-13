<?php

Route::group(['middleware' => ['web'], 'prefix' => 'auth', 'namespace' => 'Modules\Auth\Http\Controllers'], function()
{
    Route::get('/login',['as' => 'auth.login', 'uses' =>  'AuthController@getLogin']);
    Route::post('/login',['as' => 'auth.login.post', 'uses' =>  'AuthController@postLogin']);
    Route::get('/logout',['as' => 'auth.logout', 'uses' =>  'AuthController@getLogOut']);
});
