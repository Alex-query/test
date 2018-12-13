<?php

namespace Modules\Auth\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    use AuthenticatesUsers;

    public function getLogin(Request $request)
    {
        if (Auth::check()) {
            return \Redirect::route('dialog.list.index');
        }
        return view('auth::login');
    }

    public function postLogin(Request $request)
    {
        if (!Auth::attempt(['login' => $request->input('login', ''), 'password' => $request->input('password', '')])) {
            return \Redirect::back()->withInput()->withErrors(['wrong' => 'неверная пара логин-пароль']);
        }
        return \Redirect::route('dialog.list.index');

    }
    public function getLogOut(){
        Auth::logout();
        return \Redirect::route('auth.login');
    }
}
