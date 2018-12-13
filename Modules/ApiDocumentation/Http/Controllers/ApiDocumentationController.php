<?php

namespace Modules\ApiDocumentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Modules\Brand\Entities\Brand;

class ApiDocumentationController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function getIndex()
    {
        $http="http";
        $isHttps = !empty($_SERVER['HTTPS']) && 'off' !== strtolower($_SERVER['HTTPS']);
        if($isHttps) { $http="https";}
        $url=$http."://".$_SERVER['HTTP_HOST'];
        return view('apidocumentation::index')->with('url', $url);
    }
}
