@extends('layouts.master')

@section('content')
    <!-- This view is loaded from module: {!! config('auth.name') !!}-->
    <div class="outer-wrapper">
        <div class="content-wrapper">
            <div class="b-auth">

                <!-- ––––– Title ––––– -->
                <section class="section title">
                    <div class="title">Manager</div>
                    <div class="subtitle">Sign into your manager account.</div>
                </section>
                <!-- ––––– End of Title ––––– -->

                <form class="ui form" method="POST" action="{{ route("auth.login.post") }}">
                    <div class="form-field">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    </div>
                    <div class="form-field">
                        <input type="text" name="login" placeholder="Login">
                    </div>
                    <div class="form-field">
                        <input type="password" name="password" placeholder="Password">
                    </div>
                    <div class="form-field checkbox">
                        <input type="checkbox" id="check"/>
                        <label class="label" for="check">Keep Me Signed in</label>
                    </div>
                    <div style="color: red">
                        {{ $errors->first('wrong') }}
                    </div>
                    <div class="form-field form-submit">
                        <button class="ui button style-default style-block" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="block-footer">© Manager, {{ date('Y') }}. All rights reserved.</div>
@stop
