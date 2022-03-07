<?php

require __DIR__ . '/vendor/autoload.php';

// JWT namespaces
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
//SleekDB namespaces
use SleekDB\Query;
use SleekDB\Store;

// JWT config
$JWT_key = "example_key";

// SleekDB config
$DBdir = __DIR__ . "/database";

// applying the store configuration is optional
$DBconf = [
    "auto_cache" => true,
    "cache_lifetime" => null,
    "timeout" => false,
    "primary_key" => "_id",
    "search" => [
        "min_length" => 2,
        "mode" => "or",
        "score_key" => "scoreKey",
        "algorithm" => Query::SEARCH_ALGORITHM["hits"],
    ],
];

  

// ENDPOINTS

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
// print_r($uri);
// get last value of $uri
$endpoint = end($uri);
// echo $endpoint;


switch ($endpoint) {
    case 'user':
        echo "user";
        break;
    
    case '':
        header("Location: template/index.html");
        // include('index.html');

        break;
    default:
        echo "Endpoint <b>".$endpoint.'</b> not found';
        break;
}

// die();
exit;




// creating a new store object
$userStore = new Store("users", $DBdir, $DBconf);

$newUser = [
    "username" => "Bob",
    "age" => 20,
    "address" => [
        "street" => "down street",
        "streetNumber" => 12,
        "postalCode" => "8174",
    ],
];

$newUser = $userStore->insert($newUser);
print_r($newUser);











$payload = array(
    "iss" => "http://example.org",
    "aud" => "http://example.com",
    "iat" => 1356999524,
    "nbf" => 1357000000,
);

/**
 * IMPORTANT:
 * You must specify supported algorithms for your application. See
 * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40
 * for a list of spec-compliant algorithms.
 */
$jwt = JWT::encode($payload, $JWT_key, 'HS256');
$decoded = JWT::decode($jwt, new Key($JWT_key, 'HS256'));

print_r($jwt);
print_r($decoded);

// FUNCTIONS

function returnJSON($data)
{
    header("Content-Type: application/json");
    echo json_encode($newUser);
}
