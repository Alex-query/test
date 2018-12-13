<?php

Route::group(['middleware' => 'api_auth_required', 'prefix' => 'api', 'namespace' => 'Modules\Api\Http\Controllers'], function()
{
    Route::post('/call', ['as' => 'api.call', 'uses' => 'ApiController@call']);
    Route::post('/event', ['as' => 'api.event', 'uses' => 'ApiController@event']);
});
