<?php

Route::group(['middleware' => ['web','auth'], 'prefix' => 'dialog', 'namespace' => 'Modules\Dialog\Http\Controllers'], function()
{
    Route::get('/list', ['as' => 'dialog.list.index', 'uses' => 'DialogController@getIndex']);
    Route::post('/data', ['as' => 'dialog.data.post', 'uses' => 'DialogController@getData']);
});
