<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
        <link rel="stylesheet" href="{{ secure_asset('css/app.css') }}" >

        <title>Laravel</title>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="index"></div>

        <script src="{{ secure_asset('js/app.js') }}"></script>
    </body>
</html>
