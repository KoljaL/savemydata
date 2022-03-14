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
//  ########  ########     #### ##    ## #### ########
//  ##     ## ##     ##     ##  ###   ##  ##     ##
//  ##     ## ##     ##     ##  ####  ##  ##     ##
//  ##     ## ########      ##  ## ## ##  ##     ##
//  ##     ## ##     ##     ##  ##  ####  ##     ##
//  ##     ## ##     ##     ##  ##   ###  ##     ##
//  ########  ########     #### ##    ## ####    ##
//
*/

require __DIR__.'/sqlite_wrapper.php';

$db_path = 'db/sqlite1111.db';

if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    // create user table
    $db->exec( 'CREATE TABLE user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password INTEGER NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    date TEXT NOT NULL)'
    );
    // create first users
    $admin = ['name' => 'admin', 'password' => 'password', 'email' => 'admin@admin.org', 'role' => '0'];
    $user  = ['name' => 'user', 'password' => 'password', 'email' => 'user@user.org', 'role' => '1'];
    create_user( $admin );
    create_user( $user );

} else {
    $db = new PDO( 'sqlite:'.$db_path );
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
    $insert = $db->prepare( 'INSERT INTO user (`name`, `password`, `email`, `role`, `date`) VALUES (:name, :password, :email, :role, :date)' );
    print_r( $insert );
    $insert->bindValue( ':name', $param['name'] );
    $insert->bindValue( ':password', md5( $param['password'] ) );
    $insert->bindValue( ':email', $param['email'] );
    $insert->bindValue( ':role', $param['role'] );
    $insert->bindValue( ':date', date( 'd.m.Y H:i:s' ) );

    if ( $insert->execute() ) {
        print_r( 'Location: nachrichten.php?eingetragen' );
        // exit;
    }
}

// print_r( $db );

exit;

function userlogin( $request ) {
    if ( $request ) {
        global $JWT_key;

        if ( $user ) {
            $data['code']         = 200;
            $data['data']['user'] = $user;
            $data['message']      = $user['username'].' logged in';

            $token_payload = [
                '_id'      => $user['_id'],
                'username' => $user['username'],
                'role'     => $user['role']
            ];
            $jwt                   = JWT::encode( $token_payload, $JWT_key, 'HS256' );
            $data['data']['token'] = $jwt;
            $data['data']['user']  = $token_payload;
        } else {
            $data['code']    = 400;
            $data['message'] = 'no user found';
        }
    }
    returnJSON( $data );
}

// FUNCTIONS

function returnJSON( $data ) {
    global $request;
    header( 'Content-Type: application/json' );
    $data['request'] = $request;

    echo json_encode( $data );
}
