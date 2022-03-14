<?php

ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

// JWT config
require __DIR__.'/vendor/autoload.php';
use Firebase\JWT\JWT;

$JWT_key = 'example_key';

/*
//
//  ########  ########     #### ##    ## #### ########
//  ##     ## ##     ##     ##  ###   ##  ##     ##
//  ##     ## ##     ##     ##  ####  ##  ##     ##
//  ##     ## ########      ##  ## ## ##  ##     ##
//  ##     ## ##     ##     ##  ##  ####  ##     ##
//  ##     ## ##     ##     ##  ##   ###  ##     ##
//  ########  ########     #### ##    ## ####    ##
//
*/

// require __DIR__.'/sqlite_wrapper.php';

$db_path = 'db/sqlite11e111.db';

if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    // create user table
    $db->exec( 'CREATE TABLE user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password INTEGER NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    permission TEXT NOT NULL,
    date TEXT NOT NULL)'
    );
    // create first users
    $admin = ['username' => 'admin', 'password' => 'password', 'email' => 'admin@admin.org', 'role' => '0', 'permission' => '0'];
    $user  = ['username' => 'user', 'password' => 'password', 'email' => 'user@user.org', 'role' => '1', 'permission' => '0'];
    create_user( $admin );
    create_user( $user );

} else {
    $db = new PDO( 'sqlite:'.$db_path );
}

/*
//
//  ######## ##    ## ########  ########   #######  #### ##    ## ########  ######
//  ##       ###   ## ##     ## ##     ## ##     ##  ##  ###   ##    ##    ##    ##
//  ##       ####  ## ##     ## ##     ## ##     ##  ##  ####  ##    ##    ##
//  ######   ## ## ## ##     ## ########  ##     ##  ##  ## ## ##    ##     ######
//  ##       ##  #### ##     ## ##        ##     ##  ##  ##  ####    ##          ##
//  ##       ##   ### ##     ## ##        ##     ##  ##  ##   ###    ##    ##    ##
//  ######## ##    ## ########  ##         #######  #### ##    ##    ##     ######
//
*/

$uri = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$uri = explode( '/', $uri );
// print_r($uri);
// get last value of $uri
$endpoint = end( $uri );
// echo $endpoint;

$request = json_decode( file_get_contents( 'php://input' ), true );
if ( $request ) {
    $keys = preg_replace( '/[^a-z0-9_]+/i', '', array_keys( $request ) );
}

if ( 'login' === $endpoint ) {
    userlogin( $request );
    exit;
}

switch ( $endpoint ) {
case 'user':
    echo 'user';
    break;

case 'login':
    userlogin( $request );
    break;

case 'admin':
    require __DIR__.'/php/sqladmin.php';
    break;

case '':
    // echo "test";
    // header("Location: template/index.html");
    // include('index.html');

    break;
default:
    // echo 'Endpoint <b>'.$endpoint.'</b> not found';
    break;
}

/*
//
//  ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######
//  ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ##
//  ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##
//  ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######
//  ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ##
//  ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ##
//  ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######
//
*/

/**
 * Create a new user in the database
 * @param param - The parameter array that is passed to the function.
 */
function create_user( $param ) {
    global $db;
    $insert = $db->prepare( 'INSERT INTO user (`username`, `password`, `email`, `role`, `permission`, `date`) VALUES (:username, :password, :email, :role,:permission, :date)' );
    $insert->bindValue( ':username', $param['username'] );
    $insert->bindValue( ':password', md5( $param['password'] ) );
    $insert->bindValue( ':email', $param['email'] );
    $insert->bindValue( ':role', $param['role'] );
    $insert->bindValue( ':permission', $param['permission'] );
    $insert->bindValue( ':date', date( 'd.m.Y H:i:s' ) );

    if ( $insert->execute() ) {
        print_r( 'Location: nachrichten.php?eingetragen' );
        // exit;
    }
}

/**
 * This function is used to login a user. It takes in a username and password, and checks if the user
 * exists in the database. If the user exists, it generates a JWT token and returns it
 * @param request - The request object.
 */
function userlogin( $request ) {
    global $db, $JWT_key;

    $user_name = $request['username'];
    $password  = md5( $request['password'] );

    // find useer & pw in table
    $stmt = $db->prepare( "SELECT * FROM user WHERE username =? AND password =?" );
    $stmt->execute( [$user_name, $password] );
    $results = $stmt->fetchAll( PDO::FETCH_ASSOC );

    // if found user, create data
    if ( $results ) {
        $user = $results[0];

        // generate token payload
        $token_payload = [
            'id'         => $user['id'],
            'username'   => $user['username'],
            'role'       => $user['role'],
            'permission' => $user['permission']
        ];

        $response['code']          = 200;
        $response['message']       = $user['username'].' logged in';
        $response['data']['token'] = JWT::encode( $token_payload, $JWT_key, 'HS256' );
        $response['data']['user']  = $token_payload;
    } else {
        $response['code']    = 400;
        $response['message'] = 'no user found';
    }

    // return response
    returnJSON( $response );
}

/**
 * This function will return a JSON object to the client
 * @param data - The data to be returned.
 */
function returnJSON( $response ) {
    // global $request;
    // $response['request'] = $request;
    header( 'Access-Control-Allow-Origin: *' );
    header( 'Content-Type: application/json; charset=UTF-8' );
    header( 'Access-Control-Allow-Methods: POST' );
    header( 'Access-Control-Max-Age: 3600' );
    header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
    echo json_encode( $response );
}
