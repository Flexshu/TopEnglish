<?php
$url = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

switch($url) {
    case "/":
        require "templates/home.html";
        break;
    case "/services":
        require "templates/services.html";
        break;
    case "/location":
        require "templates/location.html";
        break;
    case "/admin":
        require "templates/admin.html";
        break;
    case "/login":
        require "templates/login.html";
        break;
    default:
        http_response_code(404);
}