<?php

namespace Modules\Api\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Modules\Api\Http\Requests\ApiRequest;
use App\Services\Contracts\ATSServiceInterface;

class ApiController extends Controller
{
    private $conn;

    public function __construct(ATSServiceInterface $conn)
    {
        $this->conn = $conn;
    }

    public function call(ApiRequest $request)
    {
        $srcNumber=$request->get('srcNumber');
        $destNumber=$request->get('destNumber');
        $uid=$request->get('uid');
        $uuid=$this->conn->makeCall(["srcNumber"=>$srcNumber,"destNumber"=>$destNumber]);
        return $uuid;

    }
    public function event(ApiRequest $request)
    {
        file_put_contents("00.txt",json_encode($request->toArray()).PHP_EOL,FILE_APPEND);
    }

}
