@extends('layouts.dashboard')

@section('section')
    <div class="content-body">
        <div class="b-information">
            <div class="block-header">
                Api Documentation

            </div>
            <div class="block-body">
                <div>
                    <h2>Запрос для моего склада </h2>
                    <p>
                        {{$url}}/index.php/api/call
                    </p>
                    <h2>Запрос для gravitel </h2>
                    <p>
                        {{$url}}/index.php/api/event
                    </p>
                </div>
            </div>
        </div>
    </div>
@stop

@section('bottom')
    <script src="{{ asset("assets/scripts/jquery-fileupload.js") }}" type="text/javascript"></script>
    <script src="{{ asset("assets/scripts/Gruntfile.js") }}" type="text/javascript"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
@stop