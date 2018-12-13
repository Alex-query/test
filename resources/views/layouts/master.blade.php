<!DOCTYPE html>
<html>
<head>
    <title>CRM Manager</title>
    <meta charset="utf-8"/>
    <meta name="HandheldFriendly" content="false"/>
    <meta name="viewport" content="user-scalable=yes, width=device-width"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <script type="text/javascript" src="{{ asset("theme/js/lib/html5.js") }}"></script>
    <script type="text/javascript" src="{{ asset("theme/js/jquery.min.js") }}"></script>
    <script type="text/javascript" src="{{ asset("theme/js/js.js") }}"></script>
    <!--<link href="{{ asset("theme/css/styles.css") }}" rel="stylesheet" type="text/css">-->
    <link href="{{ asset("theme/css/styles.scss") }}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="{{ asset('app/dest/assets/css/app.min.css') }}">
</head>
<body class="page login">

@yield('content')

</body>
</html>
