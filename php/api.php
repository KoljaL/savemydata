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
 *
 * path to db file
 *
 */
$db_path = '../userdata/db/database.sqlite';

/*
 *
 * Splitting the URI into an array to get the endpoint
 * Created on Thu Mar 17 2022 at 02:22:13
 *
 */
$uri = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$uri = explode( '/', $uri );
// $API_endpoint = end( $uri );

// print_r( $uri );
$api          = array_search( 'api', $uri );
$API_endpoint = '';
$API_param    = '';
$API_value    = '';
if ( isset( $uri[$api + 1] ) ) {
    $API_endpoint = $uri[$api + 1];
}
if ( isset( $uri[$api + 2] ) ) {
    $API_param = $uri[$api + 2];
}
if ( isset( $uri[$api + 3] ) ) {
    $API_value = $uri[$api + 3];
}
// echo "<br>";
// echo "<br>";
// print_r( $API_endpoint );
// echo "<br>";
// print_r( $API_param );
// echo "<br>";
// print_r( $API_value );

// exit;

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
 *
 * This is a way to check if the database exists. If it doesn't exist, it will create it.
 * Created on Thu Mar 17 2022 at 02:22:51
 *
 */
if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    init_customertable();
    init_stafftable();
    init_staff_fields_table();
    init_appointment_table();
    init_project_table();
    init_files_table();
    include './dummy_content.php';
    create_dummy_staff( 3 );
    create_dummy_customer( 5 );
    create_dummy_project( 15 );
    create_dummy_appointment( 30 );
    echo "init done";
    exit;
} else {
    $db = new PDO( 'sqlite:'.$db_path );
}

/*
 *
 * Reading the JSON data from the client and decoding it.
 * Created on Thu Mar 17 2022 at 02:18:40
 *
 */
$request = json_decode( file_get_contents( 'php://input' ), true );
if ( $request ) {
    $keys = preg_replace( '/[^a-z0-9_]+/i', '', array_keys( $request ) );
} else {
    $request = $_POST;
}

/*
 *
 * This is a simple way to check if the endpoint is `login`.
 * If it is, it will call the `userlogin` function.
 *
*/
//DEBUG
//DEBUG
//DEBUG
if ( 'do' === $API_endpoint ) {
    get_projects_as_table( 'staff' );
    exit;
}
if ( 'reset' === $API_endpoint ) {
    unlink( $db_path );
}
//DEBUG
//DEBUG
//DEBUG
if ( 'login' === $API_endpoint ) {
    // make backup

    login_user( $request );
    require __DIR__.'/backup.php';
    exit;
} else {
    if ( isset( $request['user_token'] ) ) {
        $TOKEN = JWT::decode( $request['user_token'], new Key( $JWT_key, 'HS256' ) );
        $TOKEN = json_decode( json_encode( $TOKEN ), true );
    } else {
        echo "no key";
        // exit;
    }
}
/*
//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
//  ######## ##    ## ########  ########   #######  #### ##    ## ########  ######  //
//  ##       ###   ## ##     ## ##     ## ##     ##  ##  ###   ##    ##    ##    ## //
//  ##       ####  ## ##     ## ##     ## ##     ##  ##  ####  ##    ##    ##       //
//  ######   ## ## ## ##     ## ########  ##     ##  ##  ## ## ##    ##     ######  //
//  ##       ##  #### ##     ## ##        ##     ##  ##  ##  ####    ##          ## //
//  ##       ##   ### ##     ## ##        ##     ##  ##  ##   ###    ##    ##    ## //
//  ######## ##    ## ########  ##         #######  #### ##    ##    ##     ######  //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
*/

/*
 *
 * A switch statement. It will check what the endpoint is.
 * Then it will call the corresponding function.
 *
 */
switch ( $API_endpoint ) {
case 'userprofile':
    get_user_profile( $request );
    break;

case 'get_list_from':
    get_list_from( $request );
    break;

case 'newuser':
    new_user( $request );
    break;

case 'new_entry_in':
    new_entry_in( $request );
    break;
case 'delete_entry_in':
    delete_entry_in( $request );
    break;

case 'login':
    login_user( $request );
    break;

case 'get_projects_as_table':
    get_projects_as_table( $request );
    break;

case 'get_project':
    get_project( $request );
    break;

case 'edit_single_field':
    edit_single_field( $request );
    break;

case 'get_data_from':
    get_data_from( $request );
    break;

case 'upload_file':
    upload_file( $request );
    break;

case 'get_files_from':
    get_files_from( $request );
    break;

case 'get_appointments_from':
    get_appointments_from( $request );
    break;

case 'get_projects_from':
    get_projects_from( $request );
    break;

    break;
default:
    // echo 'Endpoint <b>'.$API_endpoint.'</b> not found';
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
// https://code-boxx.com/php-user-role-management-system/
// https://www.php-einfach.de/mysql-tutorial/crashkurs-pdo/

function get_projects_from( $param ) {
    if ( isAllowed() ) {
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
        if ( $param ) {

            $response['code'] = 200;
            $response['data'] = $projects;
        } else {
            $response['code']    = 400;
            $response['message'] = 'no file found';
        }
        return_JSON( $response );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

function get_appointments_from( $param ) {
    if ( isAllowed() ) {
        global $db, $API_param, $API_value;

        $stmt = $db->prepare( "SELECT * FROM appointment WHERE customer_id = :customer_id" );
        $stmt->execute( [':customer_id' => $API_param] );

        $files = $stmt->fetchAll( PDO::FETCH_ASSOC );

        $response = [];
        if ( $param ) {

            $response['code'] = 200;
            $response['data'] = $files;
        } else {
            $response['code']    = 400;
            $response['message'] = 'no file found';
        }
        return_JSON( $response );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

function get_files_from( $param ) {
    if ( isAllowed() ) {
        global $db, $API_param, $API_value;

        $stmt = $db->prepare( "SELECT * FROM files WHERE origin = :origin AND origin_id = :origin_id" );
        $stmt->execute( [':origin' => $API_param, ':origin_id' => $API_value] );

        $files = $stmt->fetchAll( PDO::FETCH_ASSOC );

        $response = [];
        if ( $param ) {

            $response['code'] = 200;
            $response['data'] = $files;
        } else {
            $response['code']    = 400;
            $response['message'] = 'no file found';
        }
        return_JSON( $response );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

function upload_file( $param ) {
    if ( isAllowed() ) {
        global $db, $API_param, $API_value, $TOKEN;

        // set filename and dir
        $uploaddir  = '../userdata/uploads/'.$param['origin'].'/'.$param['origin_id'].'/';
        $uploadfile = $uploaddir.rndStr( 4 ).'_'.basename( $_FILES['file']['name'] );

        // create folder if not exists
        if ( !is_dir( '../userdata/uploads/'.$param['origin'].'/'.$param['origin_id'] ) ) {
            mkdir( '../userdata/uploads/'.$param['origin'].'/'.$param['origin_id'] );
        }

        $response = [];
        if ( move_uploaded_file( $_FILES['file']['tmp_name'], $uploadfile ) ) {
            // prepare filepath for DOM
            $file_path = str_replace( '../', '', $uploadfile );

            // insert ino DB: missing NAME, FILETYPE DATE
            $sql = "INSERT INTO files (origin, origin_id, path, date) VALUES (?,?,?,?)";
            $db->prepare( $sql )->execute( [$param['origin'], $param['origin_id'], $file_path, 'data'] );

            $response['code']         = 200;
            $response['data']['id']   = $db->lastInsertId();
            $response['data']['path'] = $file_path;
        } else {
            $response['code']    = 400;
            $response['message'] = 'no file uploaded';
            $response['$_FILES'] = $_FILES;
            $response['$param']  = $param;
        }
        return_JSON( $response );
    } else {
        $response['code']    = 400;
        $response['POST']    = $_POST;
        $response['FILES']   = $_FILES;
        $response['param']   = $param;
        $response['$TOKEN']  = $TOKEN;
        $response['message'] = 'vorbidden to upload file';
        return_JSON( $response );
    }
}

//
//
//

function get_project( $param ) {
    if ( isAllowed() ) {
        global $db, $API_param, $API_value;

        $stmt = $db->prepare( "SELECT * FROM project WHERE id = $API_param" );
        $stmt->execute();
        $project  = $stmt->fetch( PDO::FETCH_ASSOC );
        $response = [];
        if ( $project ) {
            $stmt = $db->prepare( "SELECT * FROM appointment WHERE project_id = $API_param" );
            $stmt->execute();
            $appointments            = $stmt->fetchAll( PDO::FETCH_ASSOC );
            $project['appointments'] = $appointments;

            $project['customername'] = get_username_by_id( 'customer', $project['customer_id'] );
            $project['staffname']    = get_username_by_id( 'staff', $project['staff_id'] );

            $response['code'] = 200;
            $response['data'] = $project;
        } else {
            $response['code']    = 400;
            $response['message'] = 'no form profile found';
        }
        return_JSON( $response );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

function get_projects_as_table( $param ) {
    if ( isAllowed() ) {
        global $db, $API_param, $API_value;

        if ( '' !== $API_value ) {
            $where = ' WHERE id = '.$API_value;
        } else {
            $where = '';
        }
        $stmt = $db->prepare( "SELECT * FROM project $where" );
        $stmt->execute();
        $projects = $stmt->fetchAll( PDO::FETCH_ASSOC );

        $response = [];
        if ( $projects ) {

            // get the username and remove the comments
            foreach ( $projects as $key => $value ) {
                $projects[$key]['username'] = get_username_by_id( 'customer', $value['customer_id'] );
                unset( $projects[$key]['comment_staff'] );
                unset( $projects[$key]['comment_customer'] );
            }
            $response['code'] = 200;
            $response['data'] = $projects;
        } else {
            $response['code']    = 400;
            $response['table']   = $projects;
            $response['message'] = 'no form profile found';
        }
        return_JSON( $response );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

function get_username_by_id( $table, $id ) {
    global $db;
    $stmt = $db->prepare( "SELECT id, username FROM $table WHERE id = $id" );
    $stmt->execute();
    $user = $stmt->fetch( PDO::FETCH_ASSOC );
    // print_r( $user );
    if ( isset( $user['username'] ) ) {
        return $user['username'];
    } else {
        return 'Custonmer removed';
    }
}

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
//   ######   ######## ########    ########  ########   #######  ######## #### ##       ########    ########  #######  ########  ##     ##
//  ##    ##  ##          ##       ##     ## ##     ## ##     ## ##        ##  ##       ##          ##       ##     ## ##     ## ###   ###
//  ##        ##          ##       ##     ## ##     ## ##     ## ##        ##  ##       ##          ##       ##     ## ##     ## #### ####
//  ##   #### ######      ##       ########  ########  ##     ## ######    ##  ##       ######      ######   ##     ## ########  ## ### ##
//  ##    ##  ##          ##       ##        ##   ##   ##     ## ##        ##  ##       ##          ##       ##     ## ##   ##   ##     ##
//  ##    ##  ##          ##       ##        ##    ##  ##     ## ##        ##  ##       ##          ##       ##     ## ##    ##  ##     ##
//   ######   ########    ##       ##        ##     ##  #######  ##       #### ######## ########    ##        #######  ##     ## ##     ##
//
*/
/**
 *
 * This function is used to get all the profile form from the database
 *
 */

function get_data_from( $param ) {
    // if ( isAllowed() ) {
    global $db, $API_param, $API_value;
    $table = $API_param;

    if ( '' !== $API_value ) {
        $where = ' WHERE id = '.$API_value;
    } else {
        $where = '';
    }
    $stmt = $db->prepare( "SELECT * FROM $table $where" );
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
        $response['code']    = 400;
        $response['table']   = $form;
        $response['message'] = 'no form profile found';
    }
    return_JSON( $response );

    // } else {
    //     $response['code']    = 400;
    //     $response['message'] = 'vorbidden';
    //     return_JSON( $response );
    // }
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
    if ( isAllowed() ) {
        global $db, $API_param, $API_value;
        $response = [];
        $table    = $API_param;
        $id       = $API_value;

        $stmt = $db->prepare( "DELETE FROM $table WHERE id =?" );
        $stmt->execute( [$id] );
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
        $table    = $param['table'];
        unset( $param['table'] );
        // create_user( $param );
        insert_into_db( $param, $table );
    } else {
        $response['code']    = 400;
        $response['message'] = 'vorbidden';
        return_JSON( $response );
    }
}

function new_entry_in( $param ) {
    if ( isAllowed() ) {
        global $db, $API_param;
        $response = [];
        $table    = $API_param;
        unset( $param['user_id'] );
        unset( $param['user_token'] );
        // create_user( $param );
        insert_into_db( $param, $table );
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
function get_list_from( $param ) {
    if ( isAllowed() ) {
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
function edit_single_field( $param ) {
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
    if ( "0" === $TOKEN['role'] ) {
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

        $table = $param['table'];
        $stmt  = $db->prepare( "SELECT * FROM $table WHERE id=?" );
        $stmt->execute( [$param['id']] );
        $user = $stmt->fetch( PDO::FETCH_ASSOC );

        $response = [];
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
            'lang'       => $user['lang']
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
function insert_into_db( $param, $table, $output = true ) {
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
    // echo "INSERT INTO $table ($columns_needed) VALUES ($placeholder)";
    $stmt = $db->prepare( "INSERT INTO $table ($columns_needed) VALUES ($placeholder)" );
    $stmt->execute( $vars );

    $count = $stmt->rowCount();

    $response = [];
    if ( $count && $output ) {
        $response['data']['id'] = $db->lastInsertId();
        $response['code']       = 200;
        $response['message']    = 'insert successfull';
        $response['param']      = $param;
    } else {
        $response['code']    = 400;
        $response['param']   = $param;
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
    global $request, $API_endpoint, $API_param, $API_value;

    if ( 'reset' !== $API_endpoint ) {
        $response['GET']['$API_endpoint'] = $API_endpoint;
        $response['GET']['$API_param']    = $API_param;
        $response['GET']['$API_value']    = $API_value;

        $response['POST'] = $request;
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Content-Type: application/json; charset=UTF-8' );
        header( 'Access-Control-Allow-Methods: POST' );
        header( 'Access-Control-Max-Age: 3600' );
        header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
        echo json_encode( $response );
    }
    // exit;
}

/*
//
//  #### ##    ## #### ########    ########    ###    ########  ##       ########  ######
//   ##  ###   ##  ##     ##          ##      ## ##   ##     ## ##       ##       ##    ##
//   ##  ####  ##  ##     ##          ##     ##   ##  ##     ## ##       ##       ##
//   ##  ## ## ##  ##     ##          ##    ##     ## ########  ##       ######    ######
//   ##  ##  ####  ##     ##          ##    ######### ##     ## ##       ##             ##
//   ##  ##   ###  ##     ##          ##    ##     ## ##     ## ##       ##       ##    ##
//  #### ##    ## ####    ##          ##    ##     ## ########  ######## ########  ######
//
*/

function init_staff_fields_table() {
    global $db;
    $db->exec( 'CREATE TABLE IF NOT EXISTS staff_fields(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT "",
        label TEXT NOT NULL DEFAULT "",
        type TEXT NOT NULL DEFAULT "",
        row TEXT NOT NULL DEFAULT "",
        pos TEXT NOT NULL DEFAULT "",
        widths TEXT NOT NULL DEFAULT "",
        edit TEXT NOT NULL DEFAULT "",
        db TEXT NOT NULL DEFAULT "",
        date TEXT NOT NULL DEFAULT ""
    )' );

    $userfields = [
        ['pos' => '10', 'row' => '1', 'name' => 'username', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Username', 'db' => 'username/staff/id'],
        ['pos' => '20', 'row' => '1', 'name' => 'email', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Email', 'db' => 'email/staff/id'],
        ['pos' => '20', 'row' => '1', 'name' => 'password', 'type' => 'password', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Password', 'db' => 'password/staff/id'],
        ['pos' => '10', 'row' => '2', 'name' => 'firstname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Firstname', 'db' => 'firstname/staff/id'],
        ['pos' => '20', 'row' => '2', 'name' => 'lastname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Lastname', 'db' => 'lastname/staff/id'],
        ['pos' => '30', 'row' => '2', 'name' => 'instaname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Instaname', 'db' => 'instaname/staff/id'],
        ['pos' => '10', 'row' => '3', 'name' => 'comment', 'type' => 'textarea', 'widths' => '400/550/600', 'edit' => 'hide', 'label' => 'Comment', 'db' => 'comment/staff/id'],
        ['pos' => '10', 'row' => '4', 'name' => 'role', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Role', 'db' => 'role/staff/id'],
        ['pos' => '20', 'row' => '4', 'name' => 'permission', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Permission', 'db' => 'permission/staff/id'],
        ['pos' => '20', 'row' => '4', 'name' => 'lang', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Language', 'db' => 'lang/staff/id']
    ];
    foreach ( $userfields as $field ) {
        insert_into_db( $field, 'staff_fields' );
    }
    $db->exec( 'CREATE TABLE IF NOT EXISTS customer_fields(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT "",
        label TEXT NOT NULL DEFAULT "",
        type TEXT NOT NULL DEFAULT "",
        row TEXT NOT NULL DEFAULT "",
        pos TEXT NOT NULL DEFAULT "",
        widths TEXT NOT NULL DEFAULT "",
        edit TEXT NOT NULL DEFAULT "",
        db TEXT NOT NULL DEFAULT "",
        date TEXT NOT NULL DEFAULT ""
    )' );
    $customerfields = [
        ['pos' => '10', 'row' => '1', 'name' => 'username', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Username', 'db' => 'username/customer/id'],
        ['pos' => '20', 'row' => '1', 'name' => 'email', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Email', 'db' => 'email/customer/id'],
        ['pos' => '30', 'row' => '1', 'name' => 'password', 'type' => 'password', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Password', 'db' => 'password/customer/id'],
        ['pos' => '10', 'row' => '2', 'name' => 'firstname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Firstname', 'db' => 'firstname/customer/id'],
        ['pos' => '30', 'row' => '2', 'name' => 'instaname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Instaname', 'db' => 'instaname/customer/id'],
        ['pos' => '30', 'row' => '2', 'name' => 'birthdate', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Birthdate', 'db' => 'birthdate/customer/id'],
        ['pos' => '20', 'row' => '2', 'name' => 'street', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Street', 'db' => 'street/customer/id'],
        ['pos' => '20', 'row' => '2', 'name' => 'street_nr', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Street_nr', 'db' => 'street_nr/customer/id'],
        ['pos' => '20', 'row' => '2', 'name' => 'city', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'City', 'db' => 'city/customer/id'],
        ['pos' => '20', 'row' => '2', 'name' => 'city_nr', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'City_nr', 'db' => 'city_nr/customer/id'],
        ['pos' => '20', 'row' => '2', 'name' => 'phone', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'phone', 'db' => 'phone/customer/id'],
        ['pos' => '10', 'row' => '3', 'name' => 'comment', 'type' => 'textarea', 'widths' => '400/550/600', 'edit' => 'hide', 'label' => 'Comment', 'db' => 'comment/customer/id'],
        ['pos' => '10', 'row' => '4', 'name' => 'role', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Role', 'db' => 'role/customer/id'],
        ['pos' => '20', 'row' => '4', 'name' => 'permission', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Permission', 'db' => 'permission/customer/id']
    ];
    foreach ( $customerfields as $field ) {
        insert_into_db( $field, 'customer_fields' );
    }
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
function init_stafftable() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE staff(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL DEFAULT "",
            password TEXT NOT NULL DEFAULT "",
            firstname TEXT NOT NULL DEFAULT "",
            lastname TEXT NOT NULL DEFAULT "",
            email TEXT NOT NULL DEFAULT "",
            comment TEXT NOT NULL DEFAULT "",
            role TEXT NOT NULL DEFAULT "",
            permission TEXT NOT NULL DEFAULT "",
            lang TEXT NOT NULL DEFAULT "en",
            date TEXT NOT NULL DEFAULT ""
        )' );

    // create first users
    $admin = ['username' => 'admin', 'password' => 'password', 'firstname' => 'admin', 'lastname' => 'admin', 'email' => 'admin@admin.org', 'comment' => 'lorem iopsum', 'role' => '0', 'permission' => '0'];
    $user  = ['username' => 'user', 'password' => 'password', 'firstname' => 'user', 'lastname' => 'user', 'email' => 'user@user.org', 'comment' => 'lorem iopsum', 'role' => '1', 'permission' => '0'];
    insert_into_db( $admin, 'staff' );
    insert_into_db( $user, 'staff' );

    // send response
    // $response['code']    = 200;
    // $response['message'] = 'usertable created';

    // return_JSON( $response );
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
            username TEXT NOT NULL DEFAULT "",
            password TEXT NOT NULL DEFAULT "",
            firstname TEXT NOT NULL DEFAULT "",
            lastname TEXT NOT NULL DEFAULT "",
            email TEXT NOT NULL DEFAULT "",
            phone TEXT NOT NULL DEFAULT "",
            street TEXT NOT NULL DEFAULT "",
            street_nr TEXT NOT NULL DEFAULT "",
            city TEXT NOT NULL DEFAULT "",
            city_nr TEXT NOT NULL DEFAULT "",
            comment TEXT NOT NULL DEFAULT "",
            role TEXT NOT NULL DEFAULT "",
            permission TEXT NOT NULL DEFAULT "",
            date TEXT NOT NULL  DEFAULT ""
        )' );

    // create first users
    $first_customer = [
        'username'   => 'customer',
        'password'   => 'password',
        'firstname'  => 'customer',
        'lastname'   => 'customer',
        'email'      => 'customer@customer.org',
        'phone'      => '555-123456789',
        'street'     => 'Sesam',
        'street_nr'  => '10',
        'city'       => 'Clondyke',
        'city_nr'    => '10',
        'comment'    => 'lorem iopsum',
        'role'       => '10',
        'permission' => '10'
    ];

    // create_customer( $first_customer );
    insert_into_db( $first_customer, 'customer' );

    // send response
    $response['code']    = 200;
    $response['message'] = 'customertable created';

    return_JSON( $response );
}

function init_project_table() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE project(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL DEFAULT "",
            customer_id TEXT NOT NULL DEFAULT "",
            staff_id TEXT NOT NULL DEFAULT "",
            comment_staff TEXT NOT NULL DEFAULT "",
            comment_customer TEXT NOT NULL DEFAULT "",
            date TEXT NOT NULL  DEFAULT ""
        )' );
}

function init_appointment_table() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE appointment(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL DEFAULT "",
            start_time TEXT NOT NULL DEFAULT "",
            end_time TEXT NOT NULL DEFAULT "",
            duration TEXT NOT NULL DEFAULT "",
            staff_id TEXT NOT NULL DEFAULT "",
            project_id TEXT NOT NULL DEFAULT "",
            customer_id TEXT NOT NULL DEFAULT "",
            public TEXT NOT NULL DEFAULT 0,
            date TEXT NOT NULL  DEFAULT ""
        )' );
}

function init_files_table() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE files(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            origin TEXT NOT NULL DEFAULT "",
            origin_id TEXT NOT NULL DEFAULT "",
            path TEXT NOT NULL DEFAULT "",
            date TEXT NOT NULL  DEFAULT ""
        )' );
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
            'username'   => 'S_'.$random_name[0].'_'.$random_name[1],
            'password'   => 'password',
            'firstname'  => $random_name[0],
            'lastname'   => $random_name[1],
            'instaname'  => $random_name[1].'_'.$random_name[0],
            'email'      => $email,
            'comment'    => random_text(),
            'role'       => random_int( 1, 5 ),
            'permission' => random_int( 1, 5 ).','.random_int( 1, 5 ).','.random_int( 1, 5 )
        ];
        insert_into_db( $staff, 'staff' );
        // create_user( $user );
    }
}

function create_dummy_customer( $count ) {
    for ( $i = 0; $i < $count; $i++ ) {
        $random_name = random_name();
        $email       = $random_name[0]."@".$random_name[1].".com";
        $customer    = [
            'username'   => 'C_'.$random_name[0].'_'.$random_name[1],
            'instaname'  => $random_name[1].'_'.$random_name[0],
            'password'   => 'password',
            'firstname'  => $random_name[0],
            'lastname'   => $random_name[1],
            'email'      => $email,
            'comment'    => random_text(),
            'phone'      => random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ).random_int( 1, 9 ).'-'.random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ).random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ),
            'street'     => random_street(),
            'street_nr'  => random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ),
            'birthdate'  => random_int( 1, 30 ).'.'.random_int( 0, 12 ).'.'.random_int( 1960, 2002 ),
            'city'       => random_city(),
            'city_nr'    => random_int( 1, 9 ).random_int( 0, 9 ).random_int( 0, 9 ).random_int( 1, 9 ).random_int( 0, 9 ),
            'role'       => '10',
            'permission' => '10'
        ];
        // create_customer( $user );
        insert_into_db( $customer, 'customer' );
    }
}

function create_dummy_project( $count ) {
    for ( $i = 0; $i < $count; $i++ ) {
        $project = [
            'title'            => random_body(),
            'customer_id'      => get_ramdon_id_from( 'customer' ),
            'staff_id'         => get_ramdon_id_from( 'staff' ),
            'comment_staff'    => random_text(),
            'comment_customer' => random_text()
        ];
        insert_into_db( $project, 'project' );
    }
}

function create_dummy_appointment( $count ) {
    for ( $i = 0; $i < $count; $i++ ) {
        $days = 20;
        // random numbers
        if ( rand( 0, 1 ) ) {
            $random_date = date( 'Y-m-d', strtotime( '+'.mt_rand( 0, $days ).' days' ) );
        } else {
            $random_date = date( 'Y-m-d', strtotime( '-'.mt_rand( 0, $days ).' days' ) );
        }
        $random_hour     = str_pad( rand( 8, 18 ), 2, 0, STR_PAD_LEFT );
        $random_minute   = str_pad( rand( 0, 59 ), 2, 0, STR_PAD_LEFT );
        $durations       = [30, 60, 90, 120, 150, 180];
        $random_duration = $durations[mt_rand( 0, 5 )];
        // startdate
        $random_datetime_start = $random_date.' '.$random_hour.':'.$random_minute.':00';
        // enddate is startdate + duration
        $datetime = new DateTime( $random_datetime_start );
        $datetime->add( new DateInterval( 'PT'.$random_duration.'M' ) );
        $random_datetime_end = $datetime->format( 'Y-m-d H:i:s' );

        $project = [
            'start_time'  => $random_datetime_start,
            'end_time'    => $random_datetime_end,
            'duration'    => $random_duration,
            'staff_id'    => get_ramdon_id_from( 'staff' ),
            'project_id'  => get_ramdon_id_from( 'project' ),
            'customer_id' => get_ramdon_id_from( 'customer' ),
            'public'      => random_int( 0, 1 )
        ];
        insert_into_db( $project, 'appointment' );
    }
}

function get_ramdon_id_from( $table ) {
    global $db;
    $stmt = $db->prepare( "SELECT id FROM $table" );
    $stmt->execute();
    $IDs = $stmt->fetchAll( PDO::FETCH_ASSOC );
    // print_r( $IDs );
    $i = random_int( 0, count( $IDs ) - 1 );
    return $IDs[$i]['id'];
}
