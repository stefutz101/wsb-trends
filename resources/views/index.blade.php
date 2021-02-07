<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>

        <style>body { margin: 0; }</style>
        <title>Laravel</title>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <script>
            var API_URL = "{{ route('results.index') }}";
        </script>
        <div id="index"></div>

        <script src="{{ secure_asset('js/app.js') }}"></script>
    </body>
</html>
