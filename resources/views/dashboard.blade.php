<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ ucfirst($role ?? 'Dashboard') }} Dashboard - FSUU</title>
    @viteReactRefresh
    @vite('resources/js/app.js')
</head>
<body class="antialiased">
    <div id="dashboard" data-role="{{ $role ?? 'admin' }}"></div>
    <script>
        // Debug: Log the role being passed
        console.log('Blade template - Role passed to view:', '{{ $role ?? 'admin' }}');
    </script>
</body>
</html>

