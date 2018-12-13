<?php

namespace Modules\Dialog\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Yajra\Datatables\Datatables;
use App\Services\Contracts\ATSServiceInterface;

class DialogController extends Controller
{
    private $conn;

    public function __construct(ATSServiceInterface $conn)
    {
        $this->conn = $conn;
    }
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function getIndex()
    {
        $collect=collect($this->conn->listAccounts());
        $users=array_merge(["all"=>"Все"],array_combine($collect->pluck('name')->all(),$collect->pluck('name')->all()));
        return view('dialog::index')->with("users",$users);
    }

    public function getData(Request $request)
    {
        $filter_user=$request->get('filter_user');
        if($filter_user=="all"){
            $array=$this->conn->getHistory(["period"=>"today"]);
        }else{
            $array=$this->conn->getHistory(["period"=>"today","account"=>$filter_user]);
        }

        $collection = collect($array);
        return Datatables::of($collection)
            ->editColumn('record', function ( $row) {
                if(strlen($row["record"])>10)
                {
                    return '<a href="'.$row["record"].'" >Скачать</a>';
                }else{
                    return 'Отсутствует';
                }
            })
            ->make(true);
    }
}
