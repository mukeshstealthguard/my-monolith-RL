<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  @viteReactRefresh
   @vite('resources/css/app.css')
  @vite('resources/js/main.jsx')
</head>
<body>
  <div id="app"></div>
</body>
</html>
