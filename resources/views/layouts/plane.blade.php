<!DOCTYPE html>
<html lang="en">
<head>

	<!-- ––––– Basic ––––– -->
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<!-- ––––– End of Basic ––––– -->

	<!-- ––––– Mobile meta ––––– -->
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<!-- ––––– End of Mobile meta ––––– -->

	<!-- ––––– Site meta ––––– -->
	<title>Manager</title>
	<!-- ––––– End of Site meta ––––– -->

	<!-- ––––– Styles ––––– -->
	<link rel="stylesheet" href="{{ asset('app/dest/assets/css/app.min.css') }}">
	<!-- ––––– End of Styles ––––– -->

	<!-- ––––– Scripts ––––– -->
	<script src="{{ asset("theme/js/jquery.min.js") }}"></script>
	<script src="{{ asset("theme/js/lib/select2.full.min.js") }}"></script>
	<script src="{{ asset("theme/js/js.js") }}"></script>
	<script src="{{ asset('app/dest/assets/js/libs.min.js') }}"></script>
	<script src="{{ asset('app/dest/assets/js/app.min.js') }}"></script>
	<!-- ––––– End of Scripts ––––– -->

	<!--[if lt IE 9]>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->

	<!-- ––––– Bar colors for browsers ––––– -->
	<meta name="theme-color" content="#EE6231">
	<meta name="msapplication-navbutton-color" content="#EE6231">
	<meta name="apple-mobile-web-app-status-bar-style" content="#EE6231">
	<!-- ––––– End of Bar colors for browsers ––––– -->

</head>
<body>

@yield('body')

@yield('bottom')

</body>
</html>