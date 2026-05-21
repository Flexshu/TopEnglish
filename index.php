<?php
function openSession(){
    if (session_status() === PHP_SESSION_NONE) {
        ini_set("session.gc_maxlifetime", 3600);
        ini_set("session.cookie_lifetime", 0);
        session_start();
    }
}

function closeSession(){
    session_unset();
    session_destroy();
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
    openSession();
    $_ENV = parseDotEnv();
    $body = file_get_contents("php://input");
    $data = json_decode($body, true);
    $response = [
        "success" => true,
        "error" => ""
    ];

    if (!isset($data["password"])){
        $response["success"] = false;
        $response["error"] = "Помилка сервера: пароль не переданий";
        return $response;
    }
    $password = $data["password"];

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
    $_SESSION["lastActivity"] = time();
    return $response;
}

function requireLoggingIn(){
    openSession();
    if (!isset($_SESSION["loggedIn"])){
        header("Location: /admin/login");
        exit();
    }
}

function checkSessionTimeout(){
    openSession();
    if (!isset($_SESSION["lastActivity"])){
        header("Location: /admin/login");
        exit();
    }
    if (time() - $_SESSION["lastActivity"] > 3600){
        closeSession();
        header("Location: /admin/login");
        exit();
    }
    $_SESSION["lastActivity"] = time();
}

function saveData(){
    $body = file_get_contents("php://input");
    $data = json_decode($body, true);
    file_put_contents("data.json", json_encode($data));
}

function requireMethod(...$methods){
    $method = $_SERVER["REQUEST_METHOD"];
    if (!in_array($method, $methods)){
        http_response_code(405);
        header("Allow: " . implode(", ", $methods));
        exit();
    }
}

$url = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
switch($url) {
    case "/":
        requireMethod("GET");
        require "templates/home.html";
        break;

    case "/services":
        requireMethod("GET");
        require "templates/services.html";
        break;

    case "/location":
        requireMethod("GET");
        require "templates/location.html";
        break;

    case "/admin":
        requireMethod("GET");
        header("X-Frame-Options: DENY");
        header("Cache-Control: no-store, no-cache");
        requireLoggingIn();
        checkSessionTimeout();
        require "templates/admin.html";
        break;

    case "/admin/login":
        requireMethod("GET");
        require "templates/login.html";
        break;

    case "/password":
        requireMethod("POST");
        $response = verifyPassword();
        header("Content-Type: application/json");
        echo json_encode($response);
        break;

    case "/data":
        requireMethod("GET", "POST");
        if ($_SERVER["REQUEST_METHOD"] === "GET"){
            header("Content-Type: application/json");
            require "data.json";
        }
        else if ($_SERVER["REQUEST_METHOD"] === "POST"){
            requireLoggingIn();
            checkSessionTimeout();
            saveData();
        }
        break;

    case "/favicon.ico":
        requireMethod("GET");
        header("Content-Type: image/x-icon");
        require "favicon.ico";
        break;

    case "/sitemap.xml":
        requireMethod("GET");
        header("Content-Type: text/xml");
        require "sitemap.xml";
        break;

    case "/robots.txt":
        requireMethod("GET");
        header("Content-Type: text/plain");
        require "robots.txt";
        break;

    default:
        http_response_code(404);
        break;
}