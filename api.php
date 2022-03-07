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

// init userStore
$userStore = new Store("userssas", $DBdir, $DBconf);

// print_r($userStore);

// create first user on init
$firstUser = $userStore->findById(1);
if (!$firstUser) {
    $newUser = [
        "username" => 'Admin',
        "password" => 'password',
        "role" => ['admin'],
        "address" => [
            "street" => 'down street',
            "streetNumber" => 12,
            "postalCode" => '8174',
        ],
    ];
    
    $newUser = $userStore->insert($newUser);
}
// $firstUser = $userStore->findById(1);
// print_r($firstUser);
// print_r($firstUser['password']);





// $payload = array(
//     "iss" => "http://example.org",
//     "aud" => "http://example.com",
//     "iat" => 1356999524,
//     "nbf" => 1357000000,
// );
 
// $jwt = JWT::encode($payload, $JWT_key, 'HS256');
// $decoded = JWT::decode($jwt, new Key($JWT_key, 'HS256'));

// print_r($jwt);
// print_r($decoded);


// exit;






// ENDPOINTS

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
// print_r($uri);
// get last value of $uri
$endpoint = end($uri);
// echo $endpoint;

$request = json_decode(file_get_contents('php://input'), true);

switch ($endpoint) {
    case 'user':
        echo "user";
        break;
    
    case 'login':
        userlogin($request);
        break;
    
    case '':
        // echo "test";
        // header("Location: template/index.html");
        // include('index.html');

        break;
    default:
        echo "Endpoint <b>".$endpoint.'</b> not found';
        break;
}

exit;





function userlogin($request)
{
    if ($request) {
        global $userStore,$JWT_key;



        $user = $userStore->findBy([[["username", "=", $request['username']],],"AND",[["password", "=", $request['password']],]])[0];

        if ($user) {
            $data['code'] = 200;
            $data['data']['user'] = $user;
            $data['message'] = $user['username']." logged in";

            $token_payload = array(
                '_id' => $user['_id'],
                'username' => $user['username'],
                'role' => $user['role']
            );
            $jwt = JWT::encode($token_payload, $JWT_key, 'HS256');
            $data['data']['token'] = $jwt;
            $data['data']['user'] = $token_payload;
            
        // $decoded = JWT::decode($jwt, new Key($JWT_key, 'HS256'));
            // $data['data']['decoded'] = $decoded;
        } else {
            $data['code'] = 400;
            $data['message'] = "no user found";
        }
    }
    returnJSON($data);
}

 










// FUNCTIONS

function returnJSON($data)
{
    global $request;
    header("Content-Type: application/json");
    $data['request'] = $request;

    echo json_encode($data);
}
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsInJvbGUiOlsiYWRtaW4iXSwiYWRkcmVzcyI6eyJzdHJlZXQiOiJkb3duIHN0cmVldCIsInN0cmVldE51bWJlciI6MTIsInBvc3RhbENvZGUiOiI4MTc0In0sIl9pZCI6MX0.RUl23ZQUD_4cM9I5oo7WWjxIRLRYFzC9c_Ee5DPZBXM
