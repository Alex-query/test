<?php

namespace Modules\Api\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Api\Http\Requests\ApiRequest;

class ApiAuthRequiredMiddleware
{
    private $apiRequest;

    public function __construct(ApiRequest $apiRequest){
        $this->apiRequest = $apiRequest;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        //if (!$this->apiRequest->getBrand()){
        //    http_response_code(403);die();
        //}
        return $next($request);

    }
}
