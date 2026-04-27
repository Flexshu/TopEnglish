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
    case "/favicon.ico":
        header("Content-Type: image/x-icon");
        require "favicon.ico";
        break;
    case "/sitemap.xml":
        header("Content-Type: text/xml");
        require "sitemap.xml";
        break;
    case "/robots.txt":
        header("Content-Type: text/plain");
        require "robots.txt";
        break;
    default:
        http_response_code(404);
        break;
}