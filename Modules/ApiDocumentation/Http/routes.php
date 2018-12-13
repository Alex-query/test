<?php

Route::group(['middleware' => ['web','auth'], 'prefix' => 'apidocumentation', 'namespace' => 'Modules\ApiDocumentation\Http\Controllers'], function()
{
    Route::get('/', ['as' => 'apidocumentation.list.index', 'uses' => 'ApiDocumentationController@getIndex']);
});
