<?php

namespace Modules\Api\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Api\Http\Requests\ApiRequest;
use Modules\Api\Services\AuthService;

class ApiAccessMiddleware
{
    private $authService;
    private $apiRequest;

    public function __construct(AuthService $authService, ApiRequest $apiRequest){
        $this->authService = $authService;
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
        $token = $request->input('token');
        if (!$token){
            $token = $request->header('Authorization', '');
            $arr = explode(' ', $token);
            if (count($arr) >= 2){
                $token = $arr[1];
            }
        }
        if (!$token){
            return $next($request)->header('Access-Control-Allow-Origin', '*')->header('Access-Control-Request-Method', '*');
        }
        $result = $this->authService->getCrmByToken($token);
        if (!$result){
            return $next($request)->header('Access-Control-Allow-Origin', '*')->header('Access-Control-Request-Method', '*');
        }

        $this->apiRequest->setBrand($result);
        return $next($request)->header('Access-Control-Allow-Origin', '*')->header('Access-Control-Request-Method', '*');

    }
}
