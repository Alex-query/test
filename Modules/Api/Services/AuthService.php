<?php
/**
 * Created by PhpStorm.
 * User: Windows
 * Date: 19.11.2018
 * Time: 13:48
 */

namespace Modules\Api\Services;


class AuthService
{

    private $brand;

    //public function __construct( $brand){
    //    $this->brand = $brand;
    //}

    public function getCrmByToken($token){
        $data = $this->brand->where("token",$token)->first();
        if (!$data ){
            return null;
        }
        return $data;
    }
}