<?php

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
//
//  ########  ########   #######  ######## #### ##       ########
//  ##     ## ##     ## ##     ## ##        ##  ##       ##
//  ##     ## ##     ## ##     ## ##        ##  ##       ##
//  ########  ########  ##     ## ######    ##  ##       ######
//  ##        ##   ##   ##     ## ##        ##  ##       ##
//  ##        ##    ##  ##     ## ##        ##  ##       ##
//  ##        ##     ##  #######  ##       #### ######## ########
//
*/
function get_profile( $param ) {
    global $db, $API_param, $API_value;

    if ( 'customer' === $API_param ) {
        $shared = ismine_or_shared( 'customer', $API_value );
    }

    $stmt = $db->prepare( "SELECT * FROM $API_param WHERE id = :id" );
    $stmt->execute( [':id' => $API_value] );
    $profile = $stmt->fetch( PDO::FETCH_ASSOC );
    $stmt->closeCursor();

    $response = [];
    if ( $profile ) {
        // SHARING
        $profile['shared'] = ( isset( $shared ) ) ? $shared : '';
        $response['code']  = 200;
        $response['data']  = $profile;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );
}

/*
//
//  ########    ###    ########  ##       ########
//     ##      ## ##   ##     ## ##       ##
//     ##     ##   ##  ##     ## ##       ##
//     ##    ##     ## ########  ##       ######
//     ##    ######### ##     ## ##       ##
//     ##    ##     ## ##     ## ##       ##
//     ##    ##     ## ########  ######## ########
//
*/
function get_table_or_list_from( $param ) {
    global $db, $API_param, $API_value, $user_id, $user_role;
    $table   = $API_param;
    $columns = ( '' !== $API_value ) ? $API_value : '*';
    $where   = ( '' !== $API_value ) ? ' WHERE id = '.$API_value : '';

    if ( isset( $param['startDate'] ) ) {
        $from_to = " AND start_date BETWEEN '$param[startDate]' AND '$param[endDate]'";
    } else {
        $from_to = '';
    }

    $sharings = ['customer', 'project', 'appointment'];

    if ( in_array( $API_param, $sharings ) && 'admin' !== $user_role ) {
        $sharing_table = $API_param.'_sharing';
        $stmt          = $db->prepare( "
          SELECT c.*
              FROM $sharing_table cs
              INNER JOIN $API_param c ON cs.share_id = c.id
              WHERE cs.staff_id = $user_id
              $from_to
          UNION
          SELECT *
              FROM $API_param
              WHERE staff_id = $user_id
              $from_to
          " );
        deb( $stmt );
    } else {
        $from_to = str_replace( ' AND start_date', ' WHERE start_date', $from_to );
        // deb( "SELECT $columns FROM $API_param $from_to" );
        $stmt = $db->prepare( "SELECT $columns FROM $API_param  $from_to" );
    }

    $stmt->execute();
    $data = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    $response = [];
    if ( $data ) {
        if ( 'customer' === $API_param ) {
            foreach ( $data as $key => $value ) {
                unset( $data[$key]['password'] );
            }
        }
        if ( 'project' === $API_param ) {
            foreach ( $data as $key => $value ) {
                $data[$key]['username'] = get_name_by_id( 'customer', $value['customer_id'] );
                unset( $data[$key]['comment_staff'] );
                unset( $data[$key]['comment_customer'] );
            }
        }
        if ( 'appointment' === $API_param ) {
            foreach ( $data as $key => $value ) {
                $data[$key]['username']    = get_name_by_id( 'customer', $value['customer_id'] );
                $data[$key]['staffname']   = get_name_by_id( 'staff', $value['staff_id'] );
                $data[$key]['projectname'] = get_name_by_id( 'project', $value['project_id'], 'title' );
                unset( $data[$key]['comment_staff'] );
                unset( $data[$key]['comment_customer'] );
            }
        }
        $response['code'] = 200;
        $response['data'] = $data;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no data profile found';
    }
    return_JSON( $response );
}

/*
//
//  ######## ########   #######  ##     ##
//  ##       ##     ## ##     ## ###   ###
//  ##       ##     ## ##     ## #### ####
//  ######   ########  ##     ## ## ### ##
//  ##       ##   ##   ##     ## ##     ##
//  ##       ##    ##  ##     ## ##     ##
//  ##       ##     ##  #######  ##     ##
//
*/
function get_profiles_from( $param ) {
    global $db, $API_param, $API_value;

    if ( 'customer' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM project" );
    }

    if ( 'staff' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM project" );
    }

    $stmt->execute();

    $profiles = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    $response = [];
    if ( $profiles ) {
        $response['code'] = 200;
        $response['data'] = $profiles;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
//
//  ########  ########   #######        ## ########  ######  ########
//  ##     ## ##     ## ##     ##       ## ##       ##    ##    ##
//  ##     ## ##     ## ##     ##       ## ##       ##          ##
//  ########  ########  ##     ##       ## ######   ##          ##
//  ##        ##   ##   ##     ## ##    ## ##       ##          ##
//  ##        ##    ##  ##     ## ##    ## ##       ##    ##    ##
//  ##        ##     ##  #######   ######  ########  ######     ##
//
*/
function get_project( $param ) {
    global $db, $API_param, $API_value;

    $shared = ismine_or_shared( 'project', $API_param );

    $stmt = $db->prepare( "--sql
      SELECT p.*, c.username AS customername, s.username AS staffname
      FROM project p
      INNER JOIN customer c
          ON p.customer_id = c.id
      INNER JOIN staff s
          ON p.staff_id = s.id
      WHERE p.id = :id" );
    $stmt->execute( [':id' => $API_param] );

    $project = $stmt->fetch( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    $response = [];
    if ( $project ) {

        // SHARING
        $project['shared'] = ( isset( $shared ) ) ? $shared : '';

        // get all appointments from this project
        $stmt = $db->prepare( "SELECT a.id, a.start_date, a.start_time FROM appointment a WHERE project_id =?" );
        $stmt->execute( [$API_param] );
        $project['appointments'] = $stmt->fetchAll( PDO::FETCH_ASSOC );
        $stmt->closeCursor();

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
//  ########    ###    ########  ##       ########
//     ##      ## ##   ##     ## ##       ##
//     ##     ##   ##  ##     ## ##       ##
//     ##    ##     ## ########  ##       ######
//     ##    ######### ##     ## ##       ##
//     ##    ##     ## ##     ## ##       ##
//     ##    ##     ## ########  ######## ########
//
*/
function get_projects_as_table( $param ) {
    // global $db, $API_param, $API_value, $user_id;

    // $stmt = $db->prepare( "--sql
    //   SELECT p.*
    //       FROM project_sharing ps
    //       INNER JOIN project p ON ps.share_id = p.id
    //       WHERE ps.staff_id = $user_id
    //   UNION
    //   SELECT * FROM project  WHERE staff_id = $user_id
    //   " );

    // $stmt->execute();
    // $projects = $stmt->fetchAll( PDO::FETCH_ASSOC );
    // $stmt->closeCursor();
    // $response = [];
    // if ( $projects ) {

    //     // get the username and remove the comments
    //     foreach ( $projects as $key => $value ) {
    //         $projects[$key]['username'] = get_name_by_id( 'customer', $value['customer_id'] );
    //         unset( $projects[$key]['comment_staff'] );
    //         unset( $projects[$key]['comment_customer'] );
    //     }
    //     // deb( $projects );
    //     $response['code'] = 200;
    //     $response['data'] = $projects;
    // } else {
    //     $response['code']    = 400;
    //     $response['data']    = [];
    //     $response['message'] = 'no profile found';
    // }
    // return_JSON( $response );
}

/*
//
//  ######## ########   #######  ##     ##
//  ##       ##     ## ##     ## ###   ###
//  ##       ##     ## ##     ## #### ####
//  ######   ########  ##     ## ## ### ##
//  ##       ##   ##   ##     ## ##     ##
//  ##       ##    ##  ##     ## ##     ##
//  ##       ##     ##  #######  ##     ##
//
*/
function get_projects_from( $param ) {
    global $db, $API_param, $API_value;

    if ( 'customer' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM project WHERE customer_id = :id" );
    }

    if ( 'staff' == $API_param ) {
        $stmt = $db->prepare( "SELECT * FROM project WHERE staff_id = :id" );
    }

    $stmt->execute( [':id' => $API_value] );

    $projects = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
//
//     ###    ########  ########   #######  #### ##    ## ######## ##     ## ######## ##    ## ########
//    ## ##   ##     ## ##     ## ##     ##  ##  ###   ##    ##    ###   ### ##       ###   ##    ##
//   ##   ##  ##     ## ##     ## ##     ##  ##  ####  ##    ##    #### #### ##       ####  ##    ##
//  ##     ## ########  ########  ##     ##  ##  ## ## ##    ##    ## ### ## ######   ## ## ##    ##
//  ######### ##        ##        ##     ##  ##  ##  ####    ##    ##     ## ##       ##  ####    ##
//  ##     ## ##        ##        ##     ##  ##  ##   ###    ##    ##     ## ##       ##   ###    ##
//  ##     ## ##        ##         #######  #### ##    ##    ##    ##     ## ######## ##    ##    ##
//
*/

function get_appointment( $param ) {
    global $db, $API_param, $API_value;

    $shared = ismine_or_shared( 'appointment', $API_param );

    $stmt = $db->prepare( "--sql
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
    $stmt->closeCursor();
    $response = [];
    if ( $appointments ) {
        $appointments['shared'] = ( isset( $shared ) ) ? $shared : '';

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
//  ########    ###    ########  ##       ########
//     ##      ## ##   ##     ## ##       ##
//     ##     ##   ##  ##     ## ##       ##
//     ##    ##     ## ########  ##       ######
//     ##    ######### ##     ## ##       ##
//     ##    ##     ## ##     ## ##       ##
//     ##    ##     ## ########  ######## ########
//
*/
function get_appointments_as_table( $param ) {
    // global $db, $API_param, $API_value;

    // if ( '' !== $API_value ) {
    //     $where = ' WHERE id = '.$API_value;
    // } else {
    //     $where = '';
    // }

    // if ( isset( $param['startDate'] ) ) {
    //     $from_to = "WHERE start_date BETWEEN '$param[startDate]' AND '$param[endDate]'";
    // } else {
    //     $from_to = '';
    // }

    // $stmt = $db->prepare( "SELECT * FROM appointment $from_to" );
    // $stmt->execute();
    // $appointments = $stmt->fetchAll( PDO::FETCH_ASSOC );
    // $stmt->closeCursor();
    // $response             = [];
    // $response['$from_to'] = $from_to;

    // if ( $appointments ) {

    //     // get the username and remove the comments
    //     foreach ( $appointments as $key => $value ) {
    //         $appointments[$key]['username']    = get_name_by_id( 'customer', $value['customer_id'] );
    //         $appointments[$key]['staffname']   = get_name_by_id( 'staff', $value['staff_id'] );
    //         $appointments[$key]['projectname'] = get_name_by_id( 'project', $value['project_id'], 'title' );
    //         unset( $appointments[$key]['comment_staff'] );
    //         unset( $appointments[$key]['comment_customer'] );
    //     }
    //     $response['code'] = 200;
    //     $response['data'] = $appointments;
    // } else {
    //     $response['code']    = 400;
    //     $response['data']    = [];
    //     $response['table']   = $appointments;
    //     $response['message'] = 'no dates found';
    // }
    // return_JSON( $response );
}

/*
//
//  ######## ########   #######  ##     ##
//  ##       ##     ## ##     ## ###   ###
//  ##       ##     ## ##     ## #### ####
//  ######   ########  ##     ## ## ### ##
//  ##       ##   ##   ##     ## ##     ##
//  ##       ##    ##  ##     ## ##     ##
//  ##       ##     ##  #######  ##     ##
//
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
    $stmt->closeCursor();
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

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

function ismine_or_shared( $table, $id ) {

    if ( !is_my_item( $table, $id ) ) {
        $shared = shared_with_me( $table.'_sharing', $id );
        if ( !$shared ) {
            $response['code']    = 403;
            $response['data']    = [];
            $response['message'] = 'not allowed to see';
            return_JSON( $response );
            exit;
        } else {
            return $shared;
        }
    }
}
function is_my_item( $table, $item_id ) {
    global $db, $user_id;
    $stmt = $db->prepare( "SELECT * FROM $table WHERE id = :item_id AND staff_id = :staff_id" );
    $stmt->execute( [':item_id' => $item_id, ':staff_id' => $user_id] );
    $data = $stmt->fetch( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    if ( $data ) {
        return true;
    } else {
        return false;
    }
}

function shared_with_me( $table, $share_id ) {
    global $db, $user_id;
    $stmt = $db->prepare( "SELECT * FROM $table WHERE share_id = :share_id AND staff_id = :staff_id" );
    $stmt->execute( [':share_id' => $share_id, ':staff_id' => $user_id] );
    $data = $stmt->fetch( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    if ( $data ) {
        $data['user_name'] = get_name_by_id( 'staff', $data['share_staff_id'] );

        return $data;
    } else {
        return false;
    }
}