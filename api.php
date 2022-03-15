<?php

ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

// JWT config
require __DIR__.'/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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

$db_path = 'db/sqlite11e11d11.db';

if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    init_usertable();
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

//
// get endpoint out of URI
$uri      = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$uri      = explode( '/', $uri );
$endpoint = end( $uri );

//
// handle request
$request = json_decode( file_get_contents( 'php://input' ), true );
if ( $request ) {
    $keys = preg_replace( '/[^a-z0-9_]+/i', '', array_keys( $request ) );
}

/*
 *
 * This is a simple way to check if the endpoint is `login`.
 * If it is, it will call the `userlogin` function.
 *
*/
if ( 'login' === $endpoint ) {
    userlogin( $request );
    exit;
} else {

    $TOKEN = JWT::decode( $request['token'], new Key( $JWT_key, 'HS256' ) );
    $TOKEN = json_decode( json_encode( $TOKEN ), true );

    if ( $request['id'] === $TOKEN['id'] || "0" === $TOKEN['role'] ) {
        $myselforadmin = true;
    }
    // print_r( $TOKEN['id'] );
    // returnJSON( [$request['id']] );
    // exit;

}

/*
 *
 * A switch statement. It will check what the endpoint is.
 * Then it will call the corresponding function.
 *
 */
switch ( $endpoint ) {
case 'userprofile':
    userprofile( $request );

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
//
//  ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######
//  ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ##
//  ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##
//  ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######
//  ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ##
//  ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ##
//  ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######
//
//
*/

// https://phpdelusions.net/pdo_examples/select

function userprofile( $param ) {
    global $TOKEN, $myselforadmin;
    if ( $myselforadmin ) {

        global $db;
        $response = [];

        $stmt = $db->prepare( "SELECT * FROM user WHERE id=?" );
        $stmt->execute( [$param['id']] );
        $user = $stmt->fetch( PDO::FETCH_ASSOC );
        unset( $user['password'] );

        if ( $user ) {
            $response['code'] = 200;
            $response['data'] = $user;

        } else {
            $response['code']    = 400;
            $response['message'] = 'no user found';
        }

        // return response
        returnJSON( $response );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        returnJSON( $response );
    }
}

/**
 *
 * Create a new user in the database
 * @param param - The parameter array that is passed to the function.
 *
 */
function create_user( $param ) {
    global $db;
    $insert = $db->prepare( 'INSERT INTO user (`username`, `password`, `email`, `role`, `permission`, `date`) VALUES (:username, :password, :email, :role,:permission, :date)' );
    $insert->bindValue( ':username', $param['username'] );
    $insert->bindValue( ':password', password_hash( $param['password'], PASSWORD_DEFAULT ) );
    $insert->bindValue( ':email', $param['email'] );
    $insert->bindValue( ':role', $param['role'] );
    $insert->bindValue( ':permission', $param['permission'] );
    $insert->bindValue( ':date', date( 'd.m.Y H:i:s' ) );

    $response = [];
    if ( $insert->execute() ) {
        $response['code']    = 200;
        $response['message'] = 'user '.$param['username'].' created';

    } else {
        $response['code']    = 400;
        $response['message'] = 'no user created';
    }

    // return response
    returnJSON( $response );
}

/**
 *
 * This function is used to login a user. It takes in a username and password, and checks if the user
 * exists in the database. If the user exists, it generates a JWT token and returns it
 * @param request - The request object.
 *
 */
function userlogin( $request ) {
    global $db, $JWT_key;

    // check if userlogin is email or name
    $row = ( filter_var( $request['userlogin'], FILTER_VALIDATE_EMAIL ) ) ? 'email' : 'username';

    // find user in table
    $stmt = $db->prepare( "SELECT * FROM user WHERE $row =?" );
    $stmt->execute( [$request['userlogin']] );
    $user = $stmt->fetch();

    // if found user, create data
    $response = [];
    if ( $user && password_verify( $request['password'], $user['password'] ) ) {

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
 *
 * Create a user table in the database
 *
 */
function init_usertable() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password INTEGER NOT NULL,
            email TEXT NOT NULL,
            role TEXT NOT NULL,
            permission TEXT NOT NULL,
            date TEXT NOT NULL
        )' );

    // create first users
    $admin = ['username' => 'admin', 'password' => 'password', 'email' => 'admin@admin.org', 'role' => '0', 'permission' => '0'];
    $user  = ['username' => 'user', 'password' => 'password', 'email' => 'user@user.org', 'role' => '1', 'permission' => '0'];

    create_user( $admin );
    create_user( $user );

    // send response
    $response['code']    = 200;
    $response['message'] = 'usertable created';

    returnJSON( $response );
}

/**
 *
 * This function will return a JSON object to the client
 * @param data - The data to be returned.
 *
 */
function returnJSON( $response ) {
    global $request;
    $response['request'] = $request;
    header( 'Access-Control-Allow-Origin: *' );
    header( 'Content-Type: application/json; charset=UTF-8' );
    header( 'Access-Control-Allow-Methods: POST' );
    header( 'Access-Control-Max-Age: 3600' );
    header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
    echo json_encode( $response );
}
