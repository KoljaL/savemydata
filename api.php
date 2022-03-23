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

$db_path = 'db/11aa.db';
/*
 *
 * This is a way to check if the database exists. If it doesn't exist, it will create it.
 * Created on Thu Mar 17 2022 at 02:22:51
 *
 */
if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    init_customertable();
    init_usertable();
    include './php/dummy_content.php';
    create_dummy_staff( 30 );
    create_dummy_customer( 100 );
} else {
    $db = new PDO( 'sqlite:'.$db_path );
    // include './php/dummy_content.php';
    // create_dummy_customer( 100 );

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

case 'userlist':
    get_user_list( $request );
    break;

case 'newuser':
    new_user( $request );
    break;

case 'deleteuser':
    delete_user( $request );
    break;

case 'login':
    login_user( $request );
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
//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
//  ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######   //
//  ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ##  //
//  ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##        //
//  ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######   //
//  ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ##  //
//  ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ##  //
//  ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######   //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
*/

// https://phpdelusions.net/pdo_examples/select

function delete_user( $param ) {
    if ( isAllowed() ) {

        global $db;
        $response = [];

        $table = $param['table'];

        $stmt = $db->prepare( "DELETE FROM $table WHERE id =?" );
        $stmt->execute( [$param['id']] );
        $count = $stmt->rowCount();

        if ( $count ) {

            $response['code'] = 200;
            $response['data'] = $count;

        } else {
            $response['code']    = 400;
            $response['data']    = $count;
            $response['message'] = 'no user found';
        }
        return_JSON( $response );

    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

/*
//
//  ##    ## ######## ##      ##    ##     ##  ######  ######## ########
//  ###   ## ##       ##  ##  ##    ##     ## ##    ## ##       ##     ##
//  ####  ## ##       ##  ##  ##    ##     ## ##       ##       ##     ##
//  ## ## ## ######   ##  ##  ##    ##     ##  ######  ######   ########
//  ##  #### ##       ##  ##  ##    ##     ##       ## ##       ##   ##
//  ##   ### ##       ##  ##  ##    ##     ## ##    ## ##       ##    ##
//  ##    ## ########  ###  ###      #######   ######  ######## ##     ##
//
*/
/**
 *
 * Create a new user
 *
 */
function new_user( $param ) {
    if ( isAllowed() ) {

        global $db;
        $response = [];

        // create_user( $param );
        insert_into_db( $param, 'user' );

    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

/*
//
//  ##     ##  ######  ######## ########  ##       ####  ######  ########
//  ##     ## ##    ## ##       ##     ## ##        ##  ##    ##    ##
//  ##     ## ##       ##       ##     ## ##        ##  ##          ##
//  ##     ##  ######  ######   ########  ##        ##   ######     ##
//  ##     ##       ## ##       ##   ##   ##        ##        ##    ##
//  ##     ## ##    ## ##       ##    ##  ##        ##  ##    ##    ##
//   #######   ######  ######## ##     ## ######## ####  ######     ##
//
*/
/**
 *
 * This function is used to get all the users from the database
 * Depending on the $param['table'] it will respond staff or customer data
 */
function get_user_list( $param ) {
    if ( isAllowed() ) {

        global $db;
        $response = [];
        $table    = $param['table'];

        $stmt = $db->prepare( "SELECT * FROM $table" );
        $stmt->execute();
        $users = $stmt->fetchAll( PDO::FETCH_ASSOC );

        if ( $users ) {

            // unset password from list
            foreach ( array_keys( $users ) as $key ) {
                unset( $users[$key]['password'] );
            }

            $response['code'] = 200;
            $response['data'] = $users;

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

/*
//
//   ######  #### ##    ##  ######   ##       ########    ######## ########  #### ########
//  ##    ##  ##  ###   ## ##    ##  ##       ##          ##       ##     ##  ##     ##
//  ##        ##  ####  ## ##        ##       ##          ##       ##     ##  ##     ##
//   ######   ##  ## ## ## ##   #### ##       ######      ######   ##     ##  ##     ##
//        ##  ##  ##  #### ##    ##  ##       ##          ##       ##     ##  ##     ##
//  ##    ##  ##  ##   ### ##    ##  ##       ##          ##       ##     ##  ##     ##
//   ######  #### ##    ##  ######   ######## ########    ######## ########  ####    ##
//
*/
/**
 *
 * This function is used to update a single field in a table
 *
 */
function singleedit( $param ) {
    if ( isAllowed() ) {

        // special case for password update
        if ( 'password' === $param['update'] ) {
            // if new passwort is emopty, do not set and return
            if ( '' === $param['value'] ) {
                $response['code'] = 300;
                return_JSON( $response );
                exit;
            }
            // hash password
            $param['value'] = password_hash( $param['value'], PASSWORD_DEFAULT );
        }
        global $db;
        $response = [];

        $sql    = "UPDATE $param[table] SET $param[update]=? WHERE $param[where]=?";
        $stmt   = $db->prepare( $sql );
        $update = $stmt->execute( [$param['value'], $param['equal']] );
        // count is the way to get 'true' if row is updated
        $count = $stmt->rowCount();

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

/*
//
//  ####  ######        ###    ##       ##        #######  ##      ## ######## ########
//   ##  ##    ##      ## ##   ##       ##       ##     ## ##  ##  ## ##       ##     ##
//   ##  ##           ##   ##  ##       ##       ##     ## ##  ##  ## ##       ##     ##
//   ##   ######     ##     ## ##       ##       ##     ## ##  ##  ## ######   ##     ##
//   ##        ##    ######### ##       ##       ##     ## ##  ##  ## ##       ##     ##
//   ##  ##    ##    ##     ## ##       ##       ##     ## ##  ##  ## ##       ##     ##
//  ####  ######     ##     ## ######## ########  #######   ###  ###  ######## ########
//
*/
/**
 *
 * If the user is the owner of the token or the user is an admin, then return true
 *
 */
function isAllowed( $action = '' ) {
    global $TOKEN, $request;
    if ( $request['user_id'] === $TOKEN['id'] || "0" === $TOKEN['role'] ) {
        return true;
    }
}

/*
//
//   ######   ######## ########    ##     ##  ######  ######## ########     ########  ########   #######  ######## #### ##       ########
//  ##    ##  ##          ##       ##     ## ##    ## ##       ##     ##    ##     ## ##     ## ##     ## ##        ##  ##       ##
//  ##        ##          ##       ##     ## ##       ##       ##     ##    ##     ## ##     ## ##     ## ##        ##  ##       ##
//  ##   #### ######      ##       ##     ##  ######  ######   ########     ########  ########  ##     ## ######    ##  ##       ######
//  ##    ##  ##          ##       ##     ##       ## ##       ##   ##      ##        ##   ##   ##     ## ##        ##  ##       ##
//  ##    ##  ##          ##       ##     ## ##    ## ##       ##    ##     ##        ##    ##  ##     ## ##        ##  ##       ##
//   ######   ########    ##        #######   ######  ######## ##     ##    ##        ##     ##  #######  ##       #### ######## ########
//
*/
/**
 *
 * This function is used to get a user profile
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

/*
//
//  ##        #######   ######   #### ##    ##    ##     ##  ######  ######## ########
//  ##       ##     ## ##    ##   ##  ###   ##    ##     ## ##    ## ##       ##     ##
//  ##       ##     ## ##         ##  ####  ##    ##     ## ##       ##       ##     ##
//  ##       ##     ## ##   ####  ##  ## ## ##    ##     ##  ######  ######   ########
//  ##       ##     ## ##    ##   ##  ##  ####    ##     ##       ## ##       ##   ##
//  ##       ##     ## ##    ##   ##  ##   ###    ##     ## ##    ## ##       ##    ##
//  ########  #######   ######   #### ##    ##     #######   ######  ######## ##     ##
//
*/
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
    $userlogin = ( filter_var( $request['userlogin'], FILTER_VALIDATE_EMAIL ) ) ? 'email' : 'username';

    // find user in table
    $stmt = $db->prepare( "SELECT * FROM user WHERE $userlogin =?" );
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

/*
//
//  #### ##    ## #### ########    ##     ##  ######  ######## ########  ########    ###    ########  ##       ########
//   ##  ###   ##  ##     ##       ##     ## ##    ## ##       ##     ##    ##      ## ##   ##     ## ##       ##
//   ##  ####  ##  ##     ##       ##     ## ##       ##       ##     ##    ##     ##   ##  ##     ## ##       ##
//   ##  ## ## ##  ##     ##       ##     ##  ######  ######   ########     ##    ##     ## ########  ##       ######
//   ##  ##  ####  ##     ##       ##     ##       ## ##       ##   ##      ##    ######### ##     ## ##       ##
//   ##  ##   ###  ##     ##       ##     ## ##    ## ##       ##    ##     ##    ##     ## ##     ## ##       ##
//  #### ##    ## ####    ##        #######   ######  ######## ##     ##    ##    ##     ## ########  ######## ########
//
*/
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
            password TEXT NOT NULL,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            email TEXT NOT NULL,
            comment TEXT NOT NULL,
            role TEXT NOT NULL,
            permission TEXT NOT NULL,
            date TEXT NOT NULL
        )' );

    // create first users
    $admin = ['username' => 'admin', 'password' => 'password', 'firstname' => 'admin', 'lastname' => 'admin', 'email' => 'admin@admin.org', 'comment' => 'lorem iopsum', 'role' => '0', 'permission' => '0'];
    $user  = ['username' => 'user', 'password' => 'password', 'firstname' => 'user', 'lastname' => 'user', 'email' => 'user@user.org', 'comment' => 'lorem iopsum', 'role' => '1', 'permission' => '0'];
    insert_into_db( $admin, 'user' );
    insert_into_db( $user, 'user' );

    // create_user( $admin );
    // create_user( $user );

    // send response
    $response['code']    = 200;
    $response['message'] = 'usertable created';

    return_JSON( $response );
}



/*
//  
//  #### ##    ## #### ########     ######  ##     ##  ######  ########  #######  ##     ## ######## ########  ########    ###    ########  ##       ########
//   ##  ###   ##  ##     ##       ##    ## ##     ## ##    ##    ##    ##     ## ###   ### ##       ##     ##    ##      ## ##   ##     ## ##       ##
//   ##  ####  ##  ##     ##       ##       ##     ## ##          ##    ##     ## #### #### ##       ##     ##    ##     ##   ##  ##     ## ##       ##
//   ##  ## ## ##  ##     ##       ##       ##     ##  ######     ##    ##     ## ## ### ## ######   ########     ##    ##     ## ########  ##       ######
//   ##  ##  ####  ##     ##       ##       ##     ##       ##    ##    ##     ## ##     ## ##       ##   ##      ##    ######### ##     ## ##       ##
//   ##  ##   ###  ##     ##       ##    ## ##     ## ##    ##    ##    ##     ## ##     ## ##       ##    ##     ##    ##     ## ##     ## ##       ##
//  #### ##    ## ####    ##        ######   #######   ######     ##     #######  ##     ## ######## ##     ##    ##    ##     ## ########  ######## ########
//  
*/
/**
 * Create a table in the database
 */
function init_customertable() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE customer(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customername TEXT NOT NULL,
            password TEXT NOT NULL,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            street TEXT NOT NULL,
            street_nr TEXT NOT NULL,
            city TEXT NOT NULL,
            city_nr TEXT NOT NULL,
            comment TEXT NOT NULL,
            role TEXT NOT NULL,
            permission TEXT NOT NULL,
            date TEXT NOT NULL
        )' );

    // create first users
    $first_customer = [
        'customername' => 'customer',
        'password'     => 'password',
        'firstname'    => 'customer',
        'lastname'     => 'customer',
        'email'        => 'customer@customer.org',
        'phone'        => '555-123456789',
        'street'       => 'Sesam',
        'street_nr'    => '10',
        'city'         => 'Clondyke',
        'city_nr'      => '10',
        'comment'      => 'lorem iopsum',
        'role'         => '10',
        'permission'   => '10'
    ];

    // create_customer( $first_customer );
    insert_into_db( $first_customer, 'customer' );

    // send response
    $response['code']    = 200;
    $response['message'] = 'customertable created';

    return_JSON( $response );
}



/*
//  
//  #### ##    ##  ######  ######## ########  ########         #### ##    ## ########  #######          ########  ########
//   ##  ###   ## ##    ## ##       ##     ##    ##             ##  ###   ##    ##    ##     ##         ##     ## ##     ##
//   ##  ####  ## ##       ##       ##     ##    ##             ##  ####  ##    ##    ##     ##         ##     ## ##     ##
//   ##  ## ## ##  ######  ######   ########     ##             ##  ## ## ##    ##    ##     ##         ##     ## ########
//   ##  ##  ####       ## ##       ##   ##      ##             ##  ##  ####    ##    ##     ##         ##     ## ##     ##
//   ##  ##   ### ##    ## ##       ##    ##     ##             ##  ##   ###    ##    ##     ##         ##     ## ##     ##
//  #### ##    ##  ######  ######## ##     ##    ##            #### ##    ##    ##     #######          ########  ########
//  
*/
/**
 * Inserts a row into a table
 *
 * @param param the parameters that are passed to the function
 * @param table The name of the table to insert into.
 */
function insert_into_db( $param, $table ) {
    global $db;
    // print_r( $param );

    //
    // get EXISTING COLUMNS from db table
    //
    $stmt = $db->query( "PRAGMA table_info($table)" );
    $stmt->execute();
    $table_info     = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $columns_exists = [];
    foreach ( $table_info as $key => $value ) {
        $columns_exists[] = $table_info[$key]['name'];
    }
    // print_r( $columns_exists );

    //
    // get NEEDED COLUMNS from parameters & add date
    //
    $columns_needed_array   = array_keys( $param );
    $columns_needed_array[] = 'date';
    $columns_needed         = implode( ',', $columns_needed_array );
    $columns_needed         = $columns_needed;
    // print_r( $columns_needed );

    //
    // find MISSING COLUMNS & create them
    $missing_columns = array_diff( $columns_needed_array, $columns_exists );
    // print_r( $missing_columns );
    if ( $missing_columns ) {
        foreach ( $missing_columns as $key => $column ) {
            $db->exec( "ALTER TABLE $table ADD COLUMN '$column' TEXT NOT NULL DEFAULT '' " );
        }
    }

    //
    // prepare amount of PLACEHOLDERS
    $count       = count( $param ) + 1;
    $placeholder = '?';
    for ( $i = 1; $i < $count; $i++ ) {
        $placeholder .= ',?';
    }
    // print_r( $placeholder );

    //
    // prepare VARS from parameters & add date
    //
    $vars = [];
    foreach ( $param as $key => $value ) {
        if ( 'password' === $key ) {
            $value = password_hash( $value, PASSWORD_DEFAULT );
        }
        $vars[] = $value;
    }
    $vars[] = date( 'd.m.Y H:i:s' );
    // print_r( $vars );

    //
    // INSERT INTO
    //
    $stmt = $db->prepare( "INSERT INTO $table ($columns_needed) VALUES ($placeholder)" );
    $stmt->execute( $vars );

    $count = $stmt->rowCount();

    $response = [];
    if ( $count ) {

        $response['data']['id'] = $db->lastInsertId();
        $response['code']       = 200;
        $response['message']    = 'insert successfull';

    } else {
        $response['code']    = 400;
        $response['message'] = 'insert failed';
    }

    // return response
    return_JSON( $response );
}

/*
//
//  ########  ######## ######## ##     ## ########  ##    ##          ##  ######   #######  ##    ##
//  ##     ## ##          ##    ##     ## ##     ## ###   ##          ## ##    ## ##     ## ###   ##
//  ##     ## ##          ##    ##     ## ##     ## ####  ##          ## ##       ##     ## ####  ##
//  ########  ######      ##    ##     ## ########  ## ## ##          ##  ######  ##     ## ## ## ##
//  ##   ##   ##          ##    ##     ## ##   ##   ##  ####    ##    ##       ## ##     ## ##  ####
//  ##    ##  ##          ##    ##     ## ##    ##  ##   ###    ##    ## ##    ## ##     ## ##   ###
//  ##     ## ########    ##     #######  ##     ## ##    ##     ######   ######   #######  ##    ##
//
*/
/**
 *
 * This function will return a JSON object to the client
 *
 */
//  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
function return_JSON( $response ) {
    global $request;
    $response['request'] = $request;
    header( 'Access-Control-Allow-Origin: *' );
    header( 'Content-Type: application/json; charset=UTF-8' );
    header( 'Access-Control-Allow-Methods: POST' );
    header( 'Access-Control-Max-Age: 3600' );
    header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
    echo json_encode( $response );
    // exit;
}

/*
//
//  ########  ##     ## ##     ## ##     ## ##    ##
//  ##     ## ##     ## ###   ### ###   ###  ##  ##
//  ##     ## ##     ## #### #### #### ####   ####
//  ##     ## ##     ## ## ### ## ## ### ##    ##
//  ##     ## ##     ## ##     ## ##     ##    ##
//  ##     ## ##     ## ##     ## ##     ##    ##
//  ########   #######  ##     ## ##     ##    ##
//
*/
// CREATE DUMMY USER
function create_dummy_staff( $count ) {
    for ( $i = 0; $i < $count; $i++ ) {
        $random_name = random_name();
        $email       = $random_name[0]."@".$random_name[1].".com";
        $staff       = [
            'username'   => 'U_'.$random_name[0].'_'.$random_name[1],
            'password'   => 'password',
            'firstname'  => $random_name[0],
            'lastname'   => $random_name[1],
            'email'      => $email,
            'comment'    => random_text(),
            'role'       => random_int( 1, 5 ),
            'permission' => random_int( 1, 5 ).','.random_int( 1, 5 ).','.random_int( 1, 5 )
        ];
        insert_into_db( $staff, 'user' );
        // create_user( $user );
    }
}

function create_dummy_customer( $count ) {
    for ( $i = 0; $i < $count; $i++ ) {
        $random_name = random_name();
        $email       = $random_name[0]."@".$random_name[1].".com";
        $customer    = [
            'customername' => 'C_'.$random_name[0].'_'.$random_name[1],
            'password'     => 'password',
            'firstname'    => $random_name[0],
            'lastname'     => $random_name[1],
            'email'        => $email,
            'comment'      => random_text(),
            'phone'        => random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ).random_int( 1, 9 ).'-'.random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ).random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ),
            'street'       => random_street(),
            'street_nr'    => random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ),
            'city'         => random_city(),
            'city_nr'      => random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ).random_int( 1, 9 ).random_int( 0, 9 ),
            'role'         => '10',
            'permission'   => '10'
        ];
        // create_customer( $user );
        insert_into_db( $customer, 'customer' );

    }
}
