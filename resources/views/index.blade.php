<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>

        <style>body { margin: 0; }</style>
        <title>Laravel</title>

        <!-- Google Adsense -->
        <script data-ad-client="ca-pub-6834170928313129" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-043S512XN5"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-043S512XN5');
        </script>
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
