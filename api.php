<?php

/*
 *
 * Error handeling
 * Created on Thu Mar 17 2022 at 02:20:53
 *
 */
ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

/*
 *
 * JWT config
 * Created on Thu Mar 17 2022 at 02:21:13
 *
 */

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

$db_path = 'db/sqlite11e11d11.db';
/*
 *
 * This is a way to check if the database exists. If it doesn't exist, it will create it.
 * Created on Thu Mar 17 2022 at 02:22:51
 *
 */
if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    init_usertable();
} else {
    $db = new PDO( 'sqlite:'.$db_path );
}

/*
 *
 * Splitting the URI into an array to get the endpoint
 * Created on Thu Mar 17 2022 at 02:22:13
 *
 */
$uri      = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$uri      = explode( '/', $uri );
$endpoint = end( $uri );

/*
 *
 * Reading the JSON data from the client and decoding it.
 * Created on Thu Mar 17 2022 at 02:18:40
 *
 */
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
    login_user( $request );
    exit;
} else {

    $TOKEN = JWT::decode( $request['user_token'], new Key( $JWT_key, 'HS256' ) );
    $TOKEN = json_decode( json_encode( $TOKEN ), true );

    // print_r( $TOKEN['id'] );
    // return_JSON( [$request['id']] );
    // exit;

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

/*
 *
 * A switch statement. It will check what the endpoint is.
 * Then it will call the corresponding function.
 *
 */
switch ( $endpoint ) {
case 'userprofile':
    get_user_profile( $request );

    break;

case 'login':
    login_user( $request );
    break;

case 'admin':
    require __DIR__.'/php/sqladmin.php';
    break;

case 'singleedit':
    singleedit( $request );
    break;

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

function singleedit( $param ) {
    if ( isAllowed() ) {

        global $db;
        $response = [];

        $sql    = "UPDATE $param[table] SET $param[update]=? WHERE $param[where]=?";
        $stmt   = $db->prepare( $sql );
        $update = $stmt->execute( [$param['value'], $param['equal']] );
        $count  = $stmt->rowCount();
        if ( $count ) {
            $response['code'] = 200;
            $response['data'] = $update;

        } else {
            $response['code']    = 400;
            $response['message'] = 'no field updated';
        }

        // return response
        return_JSON( $response );
    }
    // not allowed
    else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

/**
 * If the user is the owner of the token or the user is an admin, then return true
 *
 * @param action The action to be performed.
 *
 * @return The return value is a boolean value. If the function is allowed to execute, it will return
 * true. If it is not allowed to execute, it will return false.
 */
function isAllowed( $action = '' ) {
    global $TOKEN, $request;
    if ( $request['user_id'] === $TOKEN['id'] || "0" === $TOKEN['role'] ) {
        return true;
    }
}

/**
 *
 * This function is used to get a user profile
 *
 *
 */
function get_user_profile( $param ) {
    if ( isAllowed() ) {

        global $db;
        $response = [];

        $stmt = $db->prepare( "SELECT * FROM user WHERE id=?" );
        $stmt->execute( [$param['id']] );
        $user = $stmt->fetch( PDO::FETCH_ASSOC );

        if ( $user ) {
            unset( $user['password'] );
            $response['code'] = 200;
            $response['data'] = $user;

        } else {
            $response['code']    = 400;
            $response['message'] = 'no user found';
        }

        // return response
        return_JSON( $response );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

/**
 *
 * Create a new user in the database
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
    return_JSON( $response );
}

/**
 *
 * This function is used to login a user. It takes in a username and password, and checks if the user
 * exists in the database. If the user exists, it generates a JWT token and returns it
 * @param request - The request object.
 *
 */
function login_user( $request ) {
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
    return_JSON( $response );
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

    return_JSON( $response );
}

/**
 *
 * This function will return a JSON object to the client
 * @param data - The data to be returned.
 *
 */
function return_JSON( $response ) {
    global $request;
    $response['request'] = $request;
    header( 'Access-Control-Allow-Origin: *' );
    header( 'Content-Type: application/json; charset=UTF-8' );
    header( 'Access-Control-Allow-Methods: POST' );
    header( 'Access-Control-Max-Age: 3600' );
    header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
    echo json_encode( $response );
}
