<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

match($uri) {
    '/' => require 'templates/home.html',
    '/services' => require 'templates/services.html',
    '/location' => require 'templates/location.html',
    '/admin' => require 'templates/admin.html',
    '/login' => require 'templates/login.html',
    default => http_response_code(404)
};