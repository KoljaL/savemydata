<?php

/*
 * Error handeling
 */
ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );
ini_set( "log_errors", 1 );
if ( is_file( './error.log' ) ) {
    unlink( './error.log' );
}
ini_set( "error_log", "./error.log" );
$start = microtime( true );

//////////////////////////// PERMISSION SWITCH ////////////////////////////
$PERMISSION_FILTER = false;
$ALLOWED_AT_ALL    = false;
$PERMISSION_FILTER = true;
$ALLOWED_AT_ALL    = true;
//////////////////////////// PERMISSION SWITCH ////////////////////////////

/*
 * preflight for CORS
 */
if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
    header( 'Access-Control-Allow-Origin: *' );
    header( 'Access-Control-Allow-Methods: *' );
    header( 'Access-Control-Allow-Headers: *' );
    header( 'Access-Control-Max-Age: 1728000' );
    die();
}

/*
 * JWT config
 */
require __DIR__.'/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
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
/*
 * Splitting the URI into an array to get the endpoint
 */
$uri          = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$uri          = explode( '/', $uri );
$api          = array_search( 'api', $uri );
$API_endpoint = ( isset( $uri[$api + 1] ) ) ? $uri[$api + 1] : '';
$API_param    = ( isset( $uri[$api + 2] ) ) ? $uri[$api + 2] : '';
$API_value    = ( isset( $uri[$api + 3] ) ) ? $uri[$api + 3] : '';

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
/*
 * This is a way to check if the database exists. If it doesn't exist, it will create it.
 */
$db_path = '../userdata/db/database.sqlite';

if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    init_db();
    create_dummy_data();
} else {
    $db = new PDO( 'sqlite:'.$db_path );
}

function init_db() {
    require __DIR__.'/init_db_tables.php';
    init_customertable();
    init_stafftable();
    init_staff_fields_table();
    init_appointment_table();
    init_project_table();
    init_files_table();
    init_project_sharing_table();
    init_customer_sharing_table();
    init_appointment_sharing_table();
    init_log_table();
}

/*
//
//  ########  ########  #######  ##     ## ########  ######  ########
//  ##     ## ##       ##     ## ##     ## ##       ##    ##    ##
//  ##     ## ##       ##     ## ##     ## ##       ##          ##
//  ########  ######   ##     ## ##     ## ######    ######     ##
//  ##   ##   ##       ##  ## ## ##     ## ##             ##    ##
//  ##    ##  ##       ##    ##  ##     ## ##       ##    ##    ##
//  ##     ## ########  ##### ##  #######  ########  ######     ##
//
*/
/*
 * Reading the JSON data from the client and decoding it.
 */
$request = json_decode( file_get_contents( 'php://input' ), true );
if ( $request ) {
    $keys = preg_replace( '/[^a-z0-9_]+/i', '', array_keys( $request ) );
} else {
    $request = $_POST;
}

/*
 * Just for deveopment
*/
if ( 'do' === $API_endpoint ) {
    // create_dummy_data();
    join_test();
    // get_geocode( '' );
    // get_name_by_id('staff', '1', $name = 'username');
    exit;
}
if ( 'reset' === $API_endpoint ) {
    if ( is_file( $db_path ) ) {
        unlink( $db_path );
    }
    $db = new PDO( 'sqlite:'.$db_path );
    init_db();
    create_dummy_data();
}

/*
//
//  ##        #######   ######   #### ##    ##          ##    ########  #######  ##    ## ######## ##    ##
//  ##       ##     ## ##    ##   ##  ###   ##         ##        ##    ##     ## ##   ##  ##       ###   ##
//  ##       ##     ## ##         ##  ####  ##        ##         ##    ##     ## ##  ##   ##       ####  ##
//  ##       ##     ## ##   ####  ##  ## ## ##       ##          ##    ##     ## #####    ######   ## ## ##
//  ##       ##     ## ##    ##   ##  ##  ####      ##           ##    ##     ## ##  ##   ##       ##  ####
//  ##       ##     ## ##    ##   ##  ##   ###     ##            ##    ##     ## ##   ##  ##       ##   ###
//  ########  #######   ######   #### ##    ##    ##             ##     #######  ##    ## ######## ##    ##
//
*/
/*
 * This is a simple way to check if the endpoint is `login`.  If it is, it will call the `userlogin` function.
*/
if ( 'login' === $API_endpoint ) {
    login_user( $request );
    require __DIR__.'/backup.php';
    exit;
} elseif ( isset( $request['user_token'] ) ) {
    $TOKEN     = JWT::decode( $request['user_token'], new Key( $JWT_key, 'HS256' ) );
    $TOKEN     = json_decode( json_encode( $TOKEN ), true );
    $user_role = $TOKEN['role'];
    $user_id   = $TOKEN['id'];
    $user_name = $TOKEN['username'];

    if ( $ALLOWED_AT_ALL ) {
        allowed_at_all();
    }
} else {
    $response['code']    = 400;
    $response['data']    = [];
    $response['message'] = "no token - no data";
    return_JSON( $response );
    exit;
}

/*
//
//     ###     ######   ######  ########  ######   ######     ##        #######   ######
//    ## ##   ##    ## ##    ## ##       ##    ## ##    ##    ##       ##     ## ##    ##
//   ##   ##  ##       ##       ##       ##       ##          ##       ##     ## ##
//  ##     ## ##       ##       ######    ######   ######     ##       ##     ## ##   ####
//  ######### ##       ##       ##             ##       ##    ##       ##     ## ##    ##
//  ##     ## ##    ## ##    ## ##       ##    ## ##    ##    ##       ##     ## ##    ##
//  ##     ##  ######   ######  ########  ######   ######     ########  #######   ######
//
*/
function access_log( $response ) {
    global $db, $request, $API_endpoint, $API_param, $API_value, $user_role, $user_id, $user_name;

    
    if (isset($request['user_token']) ) {
        $user_token = $request['user_token'];
        unset( $request['user_token'] );

    } else {
        $user_token = 'no token';
    }

    $param['ip']              = $_SERVER['REMOTE_ADDR'];
    $param['HTTP_USER_AGENT'] = $_SERVER['HTTP_USER_AGENT'];
    $param['username']        = $user_name;
    $param['user_id']         = $user_id;
    $param['user_role']       = $user_role;
    $param['API_endpoint']    = $API_endpoint;
    $param['API_param']       = $API_param;
    $param['API_value']       = $API_value;
    $param['user_token']      = $user_token;
    $param['response']        = json_encode( $response);
    $param['POST']            = json_encode( $request );
    insert_into_db( $param, 'access_log', false );

}
/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     ###    ##       ##        #######  ##      ## ######## ########        ###    ########       ###    ##       ##        //
//    ## ##   ##       ##       ##     ## ##  ##  ## ##       ##     ##      ## ##      ##         ## ##   ##       ##        //
//   ##   ##  ##       ##       ##     ## ##  ##  ## ##       ##     ##     ##   ##     ##        ##   ##  ##       ##        //
//  ##     ## ##       ##       ##     ## ##  ##  ## ######   ##     ##    ##     ##    ##       ##     ## ##       ##        //
//  ######### ##       ##       ##     ## ##  ##  ## ##       ##     ##    #########    ##       ######### ##       ##        //
//  ##     ## ##       ##       ##     ## ##  ##  ## ##       ##     ##    ##     ##    ##       ##     ## ##       ##        //
//  ##     ## ######## ########  #######   ###  ###  ######## ########     ##     ##    ##       ##     ## ######## ########  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

function allowed_at_all() {
    global $request, $API_endpoint, $API_param, $API_value, $user_role, $user_id;
    // https://www.php.net/manual/en/control-structures.match.php
    $admin_params = ['staff', 'staff_fields'];

    // if not admin or admin role
    if ( "admin" !== $user_role ) {
        if (
            // check for vorbidden params
            in_array( $API_param, $admin_params )
            // staff view his own profile
            xor ( 'staff' === $API_param && $API_value === $user_id )
        ) {
            $response['code']    = 403;
            $response['data']    = [];
            $response['message'] = 'not allowed';
            return_JSON( $response );
            exit;
        }
    }
}

// SELECT * FROM mytable WHERE id IN (3,1,4)

/*
//
//     ###    ##     ## ######## ##     ##     ######## #### ##       ######## ######## ########
//    ## ##   ##     ##    ##    ##     ##     ##        ##  ##          ##    ##       ##     ##
//   ##   ##  ##     ##    ##    ##     ##     ##        ##  ##          ##    ##       ##     ##
//  ##     ## ##     ##    ##    #########     ######    ##  ##          ##    ######   ########
//  ######### ##     ##    ##    ##     ##     ##        ##  ##          ##    ##       ##   ##
//  ##     ## ##     ##    ##    ##     ##     ##        ##  ##          ##    ##       ##    ##
//  ##     ##  #######     ##    ##     ##     ##       #### ########    ##    ######## ##     ##
//
*/
function permission_filter( $res ) {
    global $request, $API_endpoint, $API_param, $API_value, $user_role, $user_id;

    // $allowed_ids = [$user_id, '1'];
    //
    // show the staff only his customer
    //
    if (
        // show the staff only his customer
        'get_data_from' === $API_endpoint && 'customer' === $API_param && 'staff' === $user_role ||
        // show the staff only his projects
        'get_projects_as_table' === $API_endpoint && 'staff' === $user_role ||
        // show the staff only his appointments
        'get_appointments_as_table' === $API_endpoint && 'staff' === $user_role ||
        // show the staff only his customer in dropdown list
        'get_list_from' === $API_endpoint && 'customer' === $API_param && 'staff' === $user_role
    ) {
        foreach ( $res['data'] as $key => $value ) {
            if ( $res['data'][$key]['staff_id'] !== $user_id ) {
                // if ( !in_array( $res['data'][$key]['staff_id'], $allowed_ids ) ) {
                unset( $res['data'][$key] );
            }
        }
    }

    // reindex array
    // unterschiedung zwischen [0] und ['id] Array
    if ( is_array_indexed( $res['data'] ) ) {
        $res['data'] = array_values( $res['data'] );
    }
    // deb( $res );
    return $res;
}

/**
 *
 * If the array has no string keys, then it's indexed.
 *
 */
function is_array_indexed( array $array ) {
    return count( array_filter( array_keys( $array ), 'is_string' ) ) === 0;
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

function return_JSON( $response ) {
    global $request, $API_endpoint, $API_param, $API_value, $TOKEN, $PERMISSION_FILTER;

    // if ( $PERMISSION_FILTER ) {
    //     $response = permission_filter( $response );
    // }
    
    if ( 'reset' === $API_endpoint ) {
        return;
    }
        access_log( $response );
        $response['GET']['API_endpoint'] = $API_endpoint;
        $response['GET']['API_param']    = $API_param;
        $response['GET']['API_value']    = $API_value;
        $response['request']             = $request;
        $response['POST']                = $_POST;
        $response['TOKEN']               = $TOKEN;

        header( 'Access-Control-Allow-Origin: *' );
        header( 'Content-Type: application/json; charset=UTF-8' );
        header( 'Access-Control-Allow-Methods: POST' );
        header( 'Access-Control-Max-Age: 3600' );
        header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
        // deb( $response );
        echo json_encode( $response );
    // exit;
}

/*
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//  ######## ##    ## ########  ########   #######  #### ##    ## ########  ######   //
//  ##       ###   ## ##     ## ##     ## ##     ##  ##  ###   ##    ##    ##    ##  //
//  ##       ####  ## ##     ## ##     ## ##     ##  ##  ####  ##    ##    ##        //
//  ######   ## ## ## ##     ## ########  ##     ##  ##  ## ## ##    ##     ######   //
//  ##       ##  #### ##     ## ##        ##     ##  ##  ##  ####    ##          ##  //
//  ##       ##   ### ##     ## ##        ##     ##  ##  ##   ###    ##    ##    ##  //
//  ######## ##    ## ########  ##         #######  #### ##    ##    ##     ######   //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
*/
/*
 *
 * A switch statement. It will check what the endpoint is.
 * Then it will call the corresponding function.
 *
 */
switch ( $API_endpoint ) {

case 'login':
    login_user( $request );
    break;

case 'get_list_from':
    get_list_from( $request );
    break;

case 'get_data_from':
    get_data_from( $request );
    break;

case 'new_entry_in':
    new_entry_in( $request );
    break;

case 'delete_entry_in':
    delete_entry_in( $request );
    break;

case 'edit_single_field':
    edit_single_field( $request );
    break;

case 'get_profile':
    get_profile( $request );
    break;

case 'get_projects_as_table':
    get_projects_as_table( $request );
    break;

case 'get_project':
    get_project( $request );
    break;

case 'get_projects_from':
    get_projects_from( $request );
    break;

case 'get_appointment':
    get_appointment( $request );
    break;

case 'get_appointments_from':
    get_appointments_from( $request );
    break;

case 'get_appointments_as_table':
    get_appointments_as_table( $request );
    break;

case 'get_appointment_as_ics':
    get_appointment_as_ics( $request );
    break;

case 'upload_file':
    upload_file( $request );
    break;

case 'get_files_from':
    get_files_from( $request );
    break;

case 'get_geocode':
    get_geocode( $request );
    break;

default:
    // echo 'Endpoint <b>'.$API_endpoint.'</b> not found';
    // exit;
    break;
}

/*
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     ###    ########  ####    ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######   //
//    ## ##   ##     ##  ##     ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ##  //
//   ##   ##  ##     ##  ##     ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##        //
//  ##     ## ########   ##     ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######   //
//  ######### ##         ##     ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ##  //
//  ##     ## ##         ##     ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ##  //
//  ##     ## ##        ####    ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######   //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
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
 *
 */
function login_user( $request ) {
    global $db, $JWT_key;

    // check if userlogin is email or name
    $userlogin = ( filter_var( $request['userlogin'], FILTER_VALIDATE_EMAIL ) ) ? 'email' : 'username';

    // find user in table
    $stmt = $db->prepare( "SELECT * FROM staff WHERE $userlogin =?" );
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
            'permission' => $user['permission'],
            'lang'       => $user['lang'],
            'avatar'     => $user['avatar']
        ];

        $response['code']          = 200;
        $response['message']       = $user['username'].' logged in';
        $response['data']['token'] = JWT::encode( $token_payload, $JWT_key, 'HS256' );
        $response['data']['user']  = $token_payload;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no user found';
    }

    // return response
    return_JSON( $response );
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
function get_list_from( $param ) {
    global $db, $API_param, $API_value;

    $table = $API_param;

    if ( '' !== $API_value ) {
        $columns = $API_value;
    } else {
        $columns = '*';
    }

    $stmt = $db->prepare( "SELECT $columns FROM $table" );
    $stmt->execute();
    $users = $stmt->fetchAll( PDO::FETCH_ASSOC );

    $response = [];
    if ( $users ) {
        $response['code'] = 200;
        $response['data'] = $users;
    } else {
        $response['code'] = 400;
        $response['data'] = [];

        $response['message'] = 'no user found';
    }

    // return response
    return_JSON( $response );
}


/**
 * 
 * returns all data from table $API_param
 * special sharing case for customer, project and apointment
 * 
 */
function get_data_from( $param ) {
    global $db, $API_param, $API_value, $user_id;
    $table = $API_param;

    if ( '' !== $API_value ) {
        $where = ' WHERE id = '.$API_value;
    } else {
        $where = '';
    }


    // $stmt = $db->prepare( "
    // SELECT p.*, c.username AS customername, s.username AS staffname
    // FROM project p
    // INNER JOIN customer c
    //     ON p.customer_id = c.id
    // INNER JOIN staff s
    //     ON p.staff_id = s.id
    // WHERE p.id = $API_param
    // " );


    // if('customer' === $API_param){
    //     $stmt = $db->prepare( "
    //         SELECT c.* 
    //             FROM customer_sharing cs 
    //             INNER JOIN customer c ON cs.customer_id = c.id
    //             WHERE cs.staff_id = $user_id
    //         UNION
    //         SELECT * 
    //             FROM customer 
    //             WHERE id = $user_id
    //         " );
    // }
    
    
    $sharings = ['customer', 'project', 'appointment'];
    
    if(in_array($API_param, $sharings)){
        $sharing_table = $API_param.'_sharing';
        $sharing_id = $API_param.'_id';
        $stmt = $db->prepare( "
            SELECT c.* 
                FROM $sharing_table cs 
                INNER JOIN $API_param c ON cs.$sharing_id = c.id
                WHERE cs.staff_id = $user_id
            UNION
            SELECT * 
                FROM $API_param 
                WHERE id = $user_id
            " );
    }
    
    else{
        $stmt = $db->prepare( "SELECT * FROM $API_param $where" );
    }
    $stmt->execute();
    $form = $stmt->fetchAll( PDO::FETCH_ASSOC );

    $response = [];
    if ( $form ) {
        foreach ( $form as $key => $value ) {
            unset( $form[$key]['password'] );
        }
        $response['code'] = 200;
        $response['data'] = $form;
    } else {
        $response['code'] = 400;
        $response['data'] = [];

        $response['table']   = $form;
        $response['message'] = 'no form profile found';
    }
    return_JSON( $response );
}

/*
//
//  ##    ## ######## ##      ##    ######## ##    ## ######## ########  ##    ##
//  ###   ## ##       ##  ##  ##    ##       ###   ##    ##    ##     ##  ##  ##
//  ####  ## ##       ##  ##  ##    ##       ####  ##    ##    ##     ##   ####
//  ## ## ## ######   ##  ##  ##    ######   ## ## ##    ##    ########     ##
//  ##  #### ##       ##  ##  ##    ##       ##  ####    ##    ##   ##      ##
//  ##   ### ##       ##  ##  ##    ##       ##   ###    ##    ##    ##     ##
//  ##    ## ########  ###  ###     ######## ##    ##    ##    ##     ##    ##
//
*/
/**
 *
 * It takes a parameter, checks if the user is allowed to do something, then does something
 *
 */
function new_entry_in( $param ) {
    global $db, $API_param;

    if ( 'appointment' === $API_param ) {
        // get location from staff from appointment
        $param['location'] = get_name_by_id( 'staff', $param['staff_id'], 'location' );
    }
    $response = [];
    $table    = $API_param;
    unset( $param['user_id'] );
    unset( $param['user_token'] );
    // create_user( $param );
    insert_into_db( $param, $table );

    if ( 'appointment' === $API_param ) {
        // get location from staff from appointment
        // and call geocode API for lng & lat
        $param['location'] = get_name_by_id( 'staff', $param['staff_id'], 'location' );
        $param['id']       = $db->lastInsertId();
        get_geocode( $param, false );
    }

}

/*
//
//  ########  ######## ##       ######## ######## ########    ##     ##  ######  ######## ########
//  ##     ## ##       ##       ##          ##    ##          ##     ## ##    ## ##       ##     ##
//  ##     ## ##       ##       ##          ##    ##          ##     ## ##       ##       ##     ##
//  ##     ## ######   ##       ######      ##    ######      ##     ##  ######  ######   ########
//  ##     ## ##       ##       ##          ##    ##          ##     ##       ## ##       ##   ##
//  ##     ## ##       ##       ##          ##    ##          ##     ## ##    ## ##       ##    ##
//  ########  ######## ######## ########    ##    ########     #######   ######  ######## ##     ##
//
*/
/**
 *
 * This function deletes a user from the database
 *
 */
function delete_entry_in( $param ) {
    global $db, $API_param, $API_value;
    $response = [];
    $table    = $API_param;
    $id       = $API_value;

    if ( 'files' === $table ) {
        $stmt = $db->prepare( "SELECT * FROM $table WHERE id =? " );
        $stmt->execute( [$API_value] );
        $image      = $stmt->fetch( PDO::FETCH_ASSOC );
        $path       = $image['path'];
        $path_thumb = $image['path_thumb'];
        unlink( '../'.$path );
        unlink( '../'.$path_thumb );
    }

    $stmt = $db->prepare( "DELETE FROM $table WHERE id =?" );
    $stmt->execute( [$id] );
    $count = $stmt->rowCount();

    if ( $count ) {
        $response['code'] = 200;
        $response['data'] = $count;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no user found';
    }
    return_JSON( $response );

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
function edit_single_field( $param ) {
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

    // check if colums exists
    try {
        $stmt   = $db->prepare( "SELECT $param[update] from $param[table];" );
        $update = $stmt->execute();
    } catch ( Exception $e ) {
        $db->exec( "ALTER TABLE $param[table] ADD COLUMN '$param[update]' TEXT NOT NULL DEFAULT '' " );
    }

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
        $response['data']    = [];
        $response['message'] = 'no field updated';
    }

    // return response
    return_JSON( $response );
}

/**
 *
 * Get a single appointment by ID
 *
 */
function get_profile( $param ) {
    global $db, $API_param, $API_value;

    // $stmt = $db->prepare( "SELECT * FROM appointment WHERE id = :id" );

    $stmt = $db->prepare( "SELECT * FROM $API_param WHERE id = :id" );

    $stmt->execute( [':id' => $API_value] );

    $appointments = $stmt->fetch( PDO::FETCH_ASSOC );

    $response = [];
    if ( $appointments ) {
        // $appointments['customername']   = get_name_by_id( 'customer', $appointments['customer_id'] );
        // $appointments['staffname']      = get_name_by_id( 'staff', $appointments['staff_id'] );
        // $appointments['projectname']    = get_name_by_id( 'project', $appointments['project_id'], 'title' );
        // $appointments['location_staff'] = get_name_by_id( 'staff', $appointments['staff_id'], 'location' );

        $response['code'] = 200;
        $response['data'] = $appointments;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );

}

/*
//
//  ########  ########   #######        ## ########  ######  ########  ######     ########    ###    ########  ##       ########
//  ##     ## ##     ## ##     ##       ## ##       ##    ##    ##    ##    ##       ##      ## ##   ##     ## ##       ##
//  ##     ## ##     ## ##     ##       ## ##       ##          ##    ##             ##     ##   ##  ##     ## ##       ##
//  ########  ########  ##     ##       ## ######   ##          ##     ######        ##    ##     ## ########  ##       ######
//  ##        ##   ##   ##     ## ##    ## ##       ##          ##          ##       ##    ######### ##     ## ##       ##
//  ##        ##    ##  ##     ## ##    ## ##       ##    ##    ##    ##    ##       ##    ##     ## ##     ## ##       ##
//  ##        ##     ##  #######   ######  ########  ######     ##     ######        ##    ##     ## ########  ######## ########
//
*/
/**
 *
 * This function is used to get the projects as a table
 *
 */
function get_projects_as_table( $param ) {
    global $db, $API_param, $API_value,$user_id;

    if ( '' !== $API_value ) {
        $where = ' WHERE id = '.$API_value;
    } else {
        $where = '';
    }
 
    $stmt = $db->prepare( "
        SELECT p.* 
            FROM project_sharing ps 
            INNER JOIN project p ON ps.project_id = p.id
            WHERE ps.staff_id = $user_id
        UNION
        SELECT * FROM project  WHERE id = $user_id
        " );

    // $stmt = $db->prepare( "SELECT * FROM project $where" );
    $stmt->execute();
    $projects = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $response = [];
    if ( $projects ) {

        // get the username and remove the comments
        foreach ( $projects as $key => $value ) {
            $projects[$key]['username'] = get_name_by_id( 'customer', $value['customer_id'] );
            unset( $projects[$key]['comment_staff'] );
            unset( $projects[$key]['comment_customer'] );
        }
        // deb( $projects );
        $response['code'] = 200;
        $response['data'] = $projects;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no form profile found';
    }
    return_JSON( $response );

}

function join_test() {
    global $db, $API_param, $API_value;
    $API_param = 1;

    // $stmt = $db->prepare( "SELECT * FROM project WHERE id = $API_param" );
    // SELECT *
    $stmt = $db->prepare( "
            SELECT p.*, c.username AS customername, s.username AS staffname
            FROM project p
            INNER JOIN customer c
                ON p.customer_id = c.id
            INNER JOIN staff s
                ON p.staff_id = s.id
            WHERE p.id = $API_param
            " );
    $stmt->execute();
    $project  = $stmt->fetch( PDO::FETCH_ASSOC );
    $response = [];
    if ( $project ) {

        // SELECT * FROM "project" INNER JOIN customer ON customer.id = project.customer_id
        // $stmt = $db->prepare( "SELECT * FROM appointment WHERE project_id = $API_param" );
        // $stmt->execute();
        // $appointments            = $stmt->fetchAll( PDO::FETCH_ASSOC );
        // $project['appointments'] = $appointments;

        // $project['customername'] = get_name_by_id( 'customer', $project['customer_id'] );
        // $project['staffname']    = get_name_by_id( 'staff', $project['staff_id'] );

        $response['code'] = 200;
        $response['data'] = $project;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no form profile found';
    }
    return_JSON( $response );

}

/*
//
//   ######   ######## ########    ########  ########   #######        ## ########  ######  ########
//  ##    ##  ##          ##       ##     ## ##     ## ##     ##       ## ##       ##    ##    ##
//  ##        ##          ##       ##     ## ##     ## ##     ##       ## ##       ##          ##
//  ##   #### ######      ##       ########  ########  ##     ##       ## ######   ##          ##
//  ##    ##  ##          ##       ##        ##   ##   ##     ## ##    ## ##       ##          ##
//  ##    ##  ##          ##       ##        ##    ##  ##     ## ##    ## ##       ##    ##    ##
//   ######   ########    ##       ##        ##     ##  #######   ######  ########  ######     ##
//
*/
/**
 *
 * Get a project by id
 *
 */
function get_project( $param ) {
    global $db, $API_param, $API_value;

    // $stmt = $db->prepare( "SELECT * FROM project WHERE id = $API_param" );
    $stmt = $db->prepare( "
        SELECT p.*, c.username AS customername, s.username AS staffname
        FROM project p
        INNER JOIN customer c
            ON p.customer_id = c.id
        INNER JOIN staff s
            ON p.staff_id = s.id
        WHERE p.id = :id" );
    $stmt->execute( [':id' => $API_param] );

    $project = $stmt->fetch( PDO::FETCH_ASSOC );

    $response = [];
    if ( $project ) {

        // SELECT * FROM "project" INNER JOIN customer ON customer.id = project.customer_id
        $stmt = $db->prepare( "SELECT a.id, a.start_date, a.start_time FROM appointment a WHERE project_id =?" );
        $stmt->execute( [$API_param] );
        $project['appointments'] = $stmt->fetchAll( PDO::FETCH_ASSOC );

        // $project['customername'] = get_name_by_id( 'customer', $project['customer_id'] );
        // $project['staffname']    = get_name_by_id( 'staff', $project['staff_id'] );

        $response['code'] = 200;
        $response['data'] = $project;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no form profile found';
    }
    return_JSON( $response );

}

/*
//
//   ######   ######## ########    ########  ########   #######        ## ########  ######  ########  ######
//  ##    ##  ##          ##       ##     ## ##     ## ##     ##       ## ##       ##    ##    ##    ##    ##
//  ##        ##          ##       ##     ## ##     ## ##     ##       ## ##       ##          ##    ##
//  ##   #### ######      ##       ########  ########  ##     ##       ## ######   ##          ##     ######
//  ##    ##  ##          ##       ##        ##   ##   ##     ## ##    ## ##       ##          ##          ##
//  ##    ##  ##          ##       ##        ##    ##  ##     ## ##    ## ##       ##    ##    ##    ##    ##
//   ######   ########    ##       ##        ##     ##  #######   ######  ########  ######     ##     ######
//
*/
/**
 *
 * This function is used to get all the projects from a cutomer or a staff
 *
 */
function get_projects_from( $param ) {
    global $db, $API_param, $API_value;

    if ( 'customer' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM project WHERE customer_id = :id" );
    }

    if ( 'staff' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM project WHERE customer_id = :id" );
    }

    $stmt->execute( [':id' => $API_value] );

    $projects = $stmt->fetchAll( PDO::FETCH_ASSOC );

    $response = [];
    if ( $projects ) {
        $response['code'] = 200;
        $response['data'] = $projects;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );

}

/*
//
//   ######   ######## ########       ###    ########  ########   #######  #### ##    ## ######## ##     ## ######## ##    ## ########
//  ##    ##  ##          ##         ## ##   ##     ## ##     ## ##     ##  ##  ###   ##    ##    ###   ### ##       ###   ##    ##
//  ##        ##          ##        ##   ##  ##     ## ##     ## ##     ##  ##  ####  ##    ##    #### #### ##       ####  ##    ##
//  ##   #### ######      ##       ##     ## ########  ########  ##     ##  ##  ## ## ##    ##    ## ### ## ######   ## ## ##    ##
//  ##    ##  ##          ##       ######### ##        ##        ##     ##  ##  ##  ####    ##    ##     ## ##       ##  ####    ##
//  ##    ##  ##          ##       ##     ## ##        ##        ##     ##  ##  ##   ###    ##    ##     ## ##       ##   ###    ##
//   ######   ########    ##       ##     ## ##        ##         #######  #### ##    ##    ##    ##     ## ######## ##    ##    ##
//
*/
/**
 *
 * Get a single appointment by ID
 *
 */
function get_appointment( $param ) {
    global $db, $API_param, $API_value;

    // $stmt = $db->prepare( "SELECT * FROM appointment WHERE id = :id" );

    $stmt = $db->prepare( "
        SELECT a.*, c.username AS customername, s.username AS staffname, s.location AS location_staff, p.title AS projectname
        FROM appointment a
        INNER JOIN customer c
            ON a.customer_id = c.id
        INNER JOIN project p
            ON a.project_id = p.id
        INNER JOIN staff s
            ON a.staff_id = s.id
        WHERE a.id = :id" );

    $stmt->execute( [':id' => $API_param] );

    $appointments = $stmt->fetch( PDO::FETCH_ASSOC );

    $response = [];
    if ( $appointments ) {
        // $appointments['customername']   = get_name_by_id( 'customer', $appointments['customer_id'] );
        // $appointments['staffname']      = get_name_by_id( 'staff', $appointments['staff_id'] );
        // $appointments['projectname']    = get_name_by_id( 'project', $appointments['project_id'], 'title' );
        // $appointments['location_staff'] = get_name_by_id( 'staff', $appointments['staff_id'], 'location' );

        $response['code'] = 200;
        $response['data'] = $appointments;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );

}

/*
//
//   ######   ######## ########       ###    ########  ########   #######  #### ##    ## ######## ##     ## ######## ##    ## ########  ######
//  ##    ##  ##          ##         ## ##   ##     ## ##     ## ##     ##  ##  ###   ##    ##    ###   ### ##       ###   ##    ##    ##    ##
//  ##        ##          ##        ##   ##  ##     ## ##     ## ##     ##  ##  ####  ##    ##    #### #### ##       ####  ##    ##    ##
//  ##   #### ######      ##       ##     ## ########  ########  ##     ##  ##  ## ## ##    ##    ## ### ## ######   ## ## ##    ##     ######
//  ##    ##  ##          ##       ######### ##        ##        ##     ##  ##  ##  ####    ##    ##     ## ##       ##  ####    ##          ##
//  ##    ##  ##          ##       ##     ## ##        ##        ##     ##  ##  ##   ###    ##    ##     ## ##       ##   ###    ##    ##    ##
//   ######   ########    ##       ##     ## ##        ##         #######  #### ##    ##    ##    ##     ## ######## ##    ##    ##     ######
//
*/
/**
 *
 * This function is used to get all the appointments of a specific customer
 *
 */
function get_appointments_from( $param ) {
    global $db, $API_param, $API_value;

    if ( 'customer' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM appointment WHERE customer_id = :id" );
    }

    if ( 'staff' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM appointment WHERE customer_id = :id" );
    }

    $stmt->execute( [':id' => $API_value] );

    $files = $stmt->fetchAll( PDO::FETCH_ASSOC );

    $response = [];
    if ( $files ) {
        $response['code'] = 200;
        $response['data'] = $files;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );

}

/*
//
//     ###    ########  ########   #######  #### ##    ## ######## ##     ## ######## ##    ## ########    ########    ###    ########  ##       ########
//    ## ##   ##     ## ##     ## ##     ##  ##  ###   ##    ##    ###   ### ##       ###   ##    ##          ##      ## ##   ##     ## ##       ##
//   ##   ##  ##     ## ##     ## ##     ##  ##  ####  ##    ##    #### #### ##       ####  ##    ##          ##     ##   ##  ##     ## ##       ##
//  ##     ## ########  ########  ##     ##  ##  ## ## ##    ##    ## ### ## ######   ## ## ##    ##          ##    ##     ## ########  ##       ######
//  ######### ##        ##        ##     ##  ##  ##  ####    ##    ##     ## ##       ##  ####    ##          ##    ######### ##     ## ##       ##
//  ##     ## ##        ##        ##     ##  ##  ##   ###    ##    ##     ## ##       ##   ###    ##          ##    ##     ## ##     ## ##       ##
//  ##     ## ##        ##         #######  #### ##    ##    ##    ##     ## ######## ##    ##    ##          ##    ##     ## ########  ######## ########
//
*/
/**
 *
 * This function is used to get the appointments as a table
 *
 */
function get_appointments_as_table( $param ) {
    global $db, $API_param, $API_value;

    if ( '' !== $API_value ) {
        $where = ' WHERE id = '.$API_value;
    } else {
        $where = '';
    }

    if ( isset( $param['startDate'] ) ) {
        $startDate = $param['startDate'];
        $endDate   = $param['endDate'];
        $from_to   = "WHERE start_date BETWEEN '$startDate' AND '$endDate'";
    } else {
        $from_to = '';
    }

    $stmt = $db->prepare( "SELECT * FROM appointment $from_to" );
    $stmt->execute();
    $appointments = $stmt->fetchAll( PDO::FETCH_ASSOC );

    $response             = [];
    $response['$from_to'] = $from_to;

    if ( $appointments ) {

        // get the username and remove the comments
        foreach ( $appointments as $key => $value ) {
            $appointments[$key]['username']    = get_name_by_id( 'customer', $value['customer_id'] );
            $appointments[$key]['staffname']   = get_name_by_id( 'staff', $value['staff_id'] );
            $appointments[$key]['projectname'] = get_name_by_id( 'project', $value['project_id'], 'title' );
            unset( $appointments[$key]['comment_staff'] );
            unset( $appointments[$key]['comment_customer'] );
        }
        $response['code'] = 200;
        $response['data'] = $appointments;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['table']   = $appointments;
        $response['message'] = 'no dates found';
    }
    return_JSON( $response );

}

/*
//
//  ####  ######     ###    ##
//   ##  ##    ##   ## ##   ##
//   ##  ##        ##   ##  ##
//   ##  ##       ##     ## ##
//   ##  ##       ######### ##
//   ##  ##    ## ##     ## ##
//  ####  ######  ##     ## ########
//
*/
/**
 *
 * This function is used to get the calendar dates
 *
 */
function get_appointment_as_ics( $param ) {
    global $db, $API_param, $API_value;

    if ( '' !== $API_value ) {
        $where = ' WHERE id = '.$API_value;
    } else {
        $where = '';
    }
    $stmt = $db->prepare( "SELECT * FROM appointment $where" );
    $stmt->execute();
    $appointment = $stmt->fetch( PDO::FETCH_ASSOC );

    $response = [];
    if ( $appointment ) {
        $appointment['username']    = get_name_by_id( 'customer', $appointment['customer_id'] );
        $appointment['staffname']   = get_name_by_id( 'staff', $appointment['staff_id'] );
        $appointment['projectname'] = get_name_by_id( 'project', $appointment['project_id'], 'title' );

        $datetime_start = date_create( $appointment['start_date'].' '.$appointment['start_time'] );
        $start          = $datetime_start->format( 'Ymd\THis' );
        $datetime_end   = $datetime_start->add( new DateInterval( 'PT'.$appointment['duration'].'M' ) );
        $end            = $datetime_end->format( 'Ymd\THis' );

        // print_r($datetime_end);
        // exit;

        // $start        = $start;
        // $end          = $end;
        $current_time = date( 'Ymd\THis' );
        $title        = html_entity_decode( $appointment['projectname'], ENT_COMPAT, 'UTF-8' );
        $location     = preg_replace( '/([\,;])/', '\\\$1', $appointment['location'] );
        $geo          = $appointment['lat'].';'.$appointment['lng'];
        $description  = html_entity_decode( $appointment['comment'], ENT_COMPAT, 'UTF-8' );
        $url          = 'https://dev.rasal.de/savemydata/#project/id/'.$appointment['project_id'];

        $eol = "\r\n";
        // $eol = '<br>';
        $ics_content =
            'BEGIN:VCALENDAR'.$eol.
            'VERSION:2.0'.$eol.
            'PRODID:-//dev.rasal//dev.rasal.de//DE'.$eol.
            'CALSCALE:GREGORIAN'.$eol.
            'BEGIN:VEVENT'.$eol.
            'DTSTART:'.$start.$eol.
            'DTEND:'.$end.$eol.
            'LOCATION:'.$location.$eol.
            'GEO:'.$geo.$eol.
            'DTSTAMP:'.$current_time.$eol.
            'SUMMARY:'.$title.$eol.
            'URL;VALUE=URI:'.$url.$eol.
            'DESCRIPTION:'.$description.$eol.
            'UID:'.$current_time.'-'.$start.'-'.$end.$eol.
            'END:VEVENT'.$eol.
            'END:VCALENDAR';

        if ( 'fetch' === $API_param ) {
            header( 'Content-type: text/calendar; charset=utf-8' );
            header( 'Content-Disposition: attachment; filename=mohawk-event.ics' );
            echo $ics_content;
            exit;
        }

        $response['code'] = 200;
        $response['data'] = $appointment;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no form profile found';
    }
    return_JSON( $response );

}

/*
//
//  ##     ## ########  ##        #######     ###    ########     ######## #### ##       ########
//  ##     ## ##     ## ##       ##     ##   ## ##   ##     ##    ##        ##  ##       ##
//  ##     ## ##     ## ##       ##     ##  ##   ##  ##     ##    ##        ##  ##       ##
//  ##     ## ########  ##       ##     ## ##     ## ##     ##    ######    ##  ##       ######
//  ##     ## ##        ##       ##     ## ######### ##     ##    ##        ##  ##       ##
//  ##     ## ##        ##       ##     ## ##     ## ##     ##    ##        ##  ##       ##
//   #######  ##        ########  #######  ##     ## ########     ##       #### ######## ########
//
*/
/**
 *
 * Upload a file to the server
 *
 */
function upload_file( $param ) {
    global $db, $API_param, $API_value, $TOKEN;
    include 'ImageResize.php';
    // set filename and dir
    $uploaddir  = 'userdata/uploads/'.$param['origin'].'/'.$param['origin_id'];
    $uploadfile = $uploaddir.'/'.rndStr( 4 ).'_'.basename( $_FILES['file']['name'] );

    // create folder if not exists
    if ( !is_dir( '../'.$uploaddir ) ) {
        mkdir( '../'.$uploaddir );
    }

    $response = [];
    try {
        //
        // staff avatar
        //
        if ( isset( $param['avatar'] ) ) {
            // resize &  save
            $image = new \Gumlet\ImageResize( $_FILES['file']['tmp_name'] );
            $image->crop( 40, 40 );
            $image->save( '../'.$uploadfile );
            // add path to db
            $usertype = $param['avatar'];
            $sql      = "UPDATE $usertype SET avatar=? WHERE id=?";
            $db->prepare( $sql )->execute( [$uploadfile, $param['origin_id']] );
            $uploadfile_thumb = '';
            $param['name'] = '';
        }
        //
        // all other images
        //
        else {
            // cerate thumbnail filename image.jpg -> image_thumb.jpg
            $pos              = strrpos( $uploadfile, '.' );
            $uploadfile_thumb = substr_replace( $uploadfile, '_thumb.', $pos, strlen( '.' ) );

            // resize & save
            $image = new \Gumlet\ImageResize( $_FILES['file']['tmp_name'] );
            $image->save( '../'.$uploadfile );
            $image->crop( 100, 100 );
            $image->save( '../'.$uploadfile_thumb );

            // add path to db
            $sql = "INSERT INTO files (origin, origin_id, path,path_thumb,type,name, staff_id, date) VALUES (?,?,?,?,?,?,?,?)";
            $db->prepare( $sql )->execute( [$param['origin'], $param['origin_id'], $uploadfile, $uploadfile_thumb, $param['type'], $param['name'], $TOKEN['id'], date( 'd.m.Y H:i:s' )] );
        }

        $response['code']               = 200;
        $response['data']['id']         = $db->lastInsertId();
        $response['data']['path']       = $uploadfile;
        $response['data']['path_thumb'] = $uploadfile_thumb;
        $response['data']['name']       = $param['name'];
        $response['data']['$image']     = $image;
    } catch ( ImageResizeException $e ) {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = $e->getMessage();
        $response['$_FILES'] = $_FILES;
        $response['$param']  = $param;
    }
    return_JSON( $response );

}

/*
//
//   ######   ######## ########    ######## #### ##       ########  ######     ######## ########   #######  ##     ##
//  ##    ##  ##          ##       ##        ##  ##       ##       ##    ##    ##       ##     ## ##     ## ###   ###
//  ##        ##          ##       ##        ##  ##       ##       ##          ##       ##     ## ##     ## #### ####
//  ##   #### ######      ##       ######    ##  ##       ######    ######     ######   ########  ##     ## ## ### ##
//  ##    ##  ##          ##       ##        ##  ##       ##             ##    ##       ##   ##   ##     ## ##     ##
//  ##    ##  ##          ##       ##        ##  ##       ##       ##    ##    ##       ##    ##  ##     ## ##     ##
//   ######   ########    ##       ##       #### ######## ########  ######     ##       ##     ##  #######  ##     ##
//
*/
/**
 *
 * Get all files from a specific origin (customer, project, appointment)
 *
 */
function get_files_from( $param ) {
    global $db, $API_param, $API_value;

    $stmt = $db->prepare( "SELECT * FROM files WHERE origin = :origin AND origin_id = :origin_id" );
    $stmt->execute( [':origin' => $API_param, ':origin_id' => $API_value] );
    $files = $stmt->fetchAll( PDO::FETCH_ASSOC );

    $response = [];
    if ( $files ) {
        $response['code'] = 200;
        $response['data'] = $files;
        $response['stmt'] = json_encode( $db );
        // $response['$stmt-'] = $stmt->debugDumpParams();
        ;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );

}

/*
//
//   ######   ######## ########     ######   ########  #######   ######   #######  ########  ########
//  ##    ##  ##          ##       ##    ##  ##       ##     ## ##    ## ##     ## ##     ## ##
//  ##        ##          ##       ##        ##       ##     ## ##       ##     ## ##     ## ##
//  ##   #### ######      ##       ##   #### ######   ##     ## ##       ##     ## ##     ## ######
//  ##    ##  ##          ##       ##    ##  ##       ##     ## ##       ##     ## ##     ## ##
//  ##    ##  ##          ##       ##    ##  ##       ##     ## ##    ## ##     ## ##     ## ##
//   ######   ########    ##        ######   ########  #######   ######   #######  ########  ########
//
*/
/**
 *
 * It takes a location string, sends it to the OpenCage API, and returns the latitude and longitude of the location
 *
 */
function get_geocode( $param, $output = true ) {
    global $db;
    // $param = [];
    // $param['location']= 'Bahnhofstraße 1, 48143 Münster';

    $geocoder = new \OpenCage\Geocoder\Geocoder( '6e52be8a19534da091331d2ca2c74252' );
    $result   = $geocoder->geocode( $param['location'] );
    // print_r($result);
    if ( $result['results'] ) {
        $geocode['code']             = 200;
        $geocode['data']['lat']      = $result['results'][0]['geometry']['lat'];
        $geocode['data']['lng']      = $result['results'][0]['geometry']['lng'];
        $geocode['data']['map_link'] = "https://www.openstreetmap.org/?mlat=".$geocode['data']['lat']."&mlon=".$geocode['data']['lng']."#map=16/".$geocode['data']['lat']."/".$geocode['data']['lng'];
        $sql                         = "UPDATE appointment SET location=?, lat=?, lng=?, map_link=? WHERE id=?";
        $db->prepare( $sql )->execute( [$param['location'], $geocode['data']['lat'], $geocode['data']['lng'], $geocode['data']['map_link'], $param['id']] );
    } else {
        $geocode['code']    = 400;
        $geocode['data']    = [];
        $geocode['message'] = 'Location not found';
    }
    if ( $output ) {
        return_JSON( $geocode );
    }
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

/**
 *
 * It takes a variable, prints it to the error log, and returns the variable
 *
 */
function deb( $var ) {
    error_log( print_r( $var, TRUE ) );
}

/*
//
//  ##    ##    ###    ##     ## ########    ########  ##    ##    #### ########
//  ###   ##   ## ##   ###   ### ##          ##     ##  ##  ##      ##  ##     ##
//  ####  ##  ##   ##  #### #### ##          ##     ##   ####       ##  ##     ##
//  ## ## ## ##     ## ## ### ## ######      ########     ##        ##  ##     ##
//  ##  #### ######### ##     ## ##          ##     ##    ##        ##  ##     ##
//  ##   ### ##     ## ##     ## ##          ##     ##    ##        ##  ##     ##
//  ##    ## ##     ## ##     ## ########    ########     ##       #### ########
//
*/
/**
 *
 * Given a table name and an id, return the username of the user with that id
 *
 */
function get_name_by_id( $table, $id, $name = 'username' ) {
    if ( !$id ) {
        return "no user ID";
    }
    global $db;
    $stmt = $db->prepare( "SELECT id, $name FROM $table WHERE id = $id" );
    $stmt->execute();
    $user = $stmt->fetch( PDO::FETCH_ASSOC );
    // print_r( $user );
    if ( isset( $user[$name] ) ) {
        return $user[$name];
    } else {
        return 'Entry removed';
    }
}

/*
//
//  ########     ###    ##    ## ########   #######  ##     ##     ######  ######## ########  #### ##    ##  ######
//  ##     ##   ## ##   ###   ## ##     ## ##     ## ###   ###    ##    ##    ##    ##     ##  ##  ###   ## ##    ##
//  ##     ##  ##   ##  ####  ## ##     ## ##     ## #### ####    ##          ##    ##     ##  ##  ####  ## ##
//  ########  ##     ## ## ## ## ##     ## ##     ## ## ### ##     ######     ##    ########   ##  ## ## ## ##   ####
//  ##   ##   ######### ##  #### ##     ## ##     ## ##     ##          ##    ##    ##   ##    ##  ##  #### ##    ##
//  ##    ##  ##     ## ##   ### ##     ## ##     ## ##     ##    ##    ##    ##    ##    ##   ##  ##   ### ##    ##
//  ##     ## ##     ## ##    ## ########   #######  ##     ##     ######     ##    ##     ## #### ##    ##  ######
//
*/
/**
 *
 * Generate a random string of characters
 *
 */
function rndStr( $length = 10 ) {
    $characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen( $characters );
    $randomString     = '';
    for ( $i = 0; $i < $length; $i++ ) {
        $randomString .= $characters[rand( 0, $charactersLength - 1 )];
    }
    return $randomString;
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
 *
 * Inserts a row into a table
 *
 */
function insert_into_db( $param, $table, $output = true ) {
    global $db;
    // print_r( $param );

    if ( isset( $param['id'] ) && '' === $param['id'] ) {
        unset( $param['id'] );
        $message = "new";
    } else {
        $message = "updated";
    }

    //
    // get EXISTING COLUMNS from db table
    //
    $stmt = $db->query( "PRAGMA table_info($table)" );
    $stmt->execute();
    usleep(20);
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
    // prepare amount of PLACEHOLDERS '?,?,?'
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
    // $stmt = $db->prepare("INSERT INTO $table ($columns_needed) VALUES ($placeholder)");
    $stmt = $db->prepare( "INSERT OR REPLACE INTO $table ($columns_needed) VALUES ($placeholder)" );
    $stmt->execute( $vars );
    usleep(20);
    $count = $stmt->rowCount();

    $response = [];
    if ( $count ) {
        $response['data']['id'] = $db->lastInsertId();
        $response['code']       = 200;
        $response['message']    = $message;
        $response['param']      = $param;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['param']   = $param;
        $response['message'] = 'insert failed';
    }

    // return response
    if ( $output ) {
        return_JSON( $response );
    }
}
