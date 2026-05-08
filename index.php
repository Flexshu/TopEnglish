<?php
session_start();
$url = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$_ENV = parseDotEnv();

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
        if (!isset($_SESSION["loggedIn"])){
            header("Location: /admin/login");
            exit();
        }
        require "templates/admin.html";
        break;
    case "/admin/login":
        require "templates/login.html";
        break;
    case "/password":
        if ($_SERVER["REQUEST_METHOD"] === "POST"){
            $response = verifyPassword();
            header("Content-Type: application/json");
            echo json_encode($response);
        }
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

function parseDotEnv(){
    $lines = file(".env", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $arr = [];
    if ($lines === false){
        return [];
    }
    foreach ($lines as $line){
        if ($line[0] === "#"){
            continue;
        }
        $pair = explode("=", $line);
        $arr[$pair[0]] = $pair[1];
    }
    return $arr;
}

function verifyPassword(){
    $body = file_get_contents("php://input");
    $data = json_decode($body, true) ?? [];
    $password = $data["password"] ?? null;
    $response = [
        "success" => true,
        "error" => ""
    ];

    if ($password === null){
        $response["success"] = false;
        $response["error"] = "Помилка сервера: пароль не переданий";
        return $response;
    }
    if (!isset($_ENV["PASSWORD"])){
        $response["success"] = false;
        $response["error"] = "Помилка сервера: пароль не встановлено";
        return $response;
    }
    if ($password !== $_ENV["PASSWORD"]){
        $response["success"] = false;
        $response["error"] = "Неправильний пароль";
        return $response;
    }
    $_SESSION["loggedIn"] = true;
    return $response;
}