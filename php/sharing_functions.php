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
              INNER JOIN $API_param c ON cs.shared_id = c.id
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
    //       INNER JOIN project p ON ps.shared_id = p.id
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

/*
//
//   ######  ##     ##    ###    ########  ########    #### ######## ######## ##     ##
//  ##    ## ##     ##   ## ##   ##     ## ##           ##     ##    ##       ###   ###
//  ##       ##     ##  ##   ##  ##     ## ##           ##     ##    ##       #### ####
//   ######  ######### ##     ## ########  ######       ##     ##    ######   ## ### ##
//        ## ##     ## ######### ##   ##   ##           ##     ##    ##       ##     ##
//  ##    ## ##     ## ##     ## ##    ##  ##           ##     ##    ##       ##     ##
//   ######  ##     ## ##     ## ##     ## ########    ####    ##    ######## ##     ##
//
*/
function share_item( $param ) {
    global $db, $API_param, $API_value, $user_id, $user_role;

    // shareID.staff_id !== $user_id -> not allowed to share

    if ( 'Customer' === $API_param ) {
        // get ID from staff, whitch email is submitted
        $sharingEmail_ID = get_by_from( 'id', 'email', $param['sharingEmail'], 'staff' );
        if ( $sharingEmail_ID ) {
            // for response
            $data['itemName']  = get_by_from( 'username', 'id', $param['shared_id'], 'customer' );
            $data['staffName'] = get_by_from( 'username', 'id', $sharingEmail_ID, 'staff' );
            // saves the sharing in DB ang get back, if its a new or a updated entry
            $data['state'] = sharing( 'customer_sharing', $param['shared_id'], $sharingEmail_ID, $user_id, $param['can_edit'] );
        }
    }

    if ( 'Project' === $API_param ) {
        // get ID from staff, whitch email is submitted
        $sharingEmail_ID = get_by_from( 'id', 'email', $param['sharingEmail'], 'staff' );
        if ( $sharingEmail_ID ) {
            // for response
            $data['itemName']  = get_by_from( 'title', 'id', $param['shared_id'], 'project' );
            $data['staffName'] = get_by_from( 'username', 'id', $sharingEmail_ID, 'staff' );
            // saves the sharing in DB ang get back, if its a new or a updated entry
            $data['state'] = sharing( 'project_sharing', $param['shared_id'], $sharingEmail_ID, $user_id, $param['can_edit'] );
        }
    }

    if ( 'Appointment' === $API_param ) {
        // get ID from staff, whitch email is submitted
        $sharingEmail_ID = get_by_from( 'id', 'email', $param['sharingEmail'], 'staff' );
        if ( $sharingEmail_ID ) {
            // for response
            $data['itemName']  = get_by_from( 'title', 'id', $param['shared_id'], 'appointment' );
            $data['staffName'] = get_by_from( 'username', 'id', $sharingEmail_ID, 'staff' );
            // saves the sharing in DB ang get back, if its a new or a updated entry
            $data['state'] = sharing( 'appointment_sharing', $param['shared_id'], $sharingEmail_ID, $user_id, $param['can_edit'] );
        }
    }

    //
    // response
    //
    $response = [];
    if ( $sharingEmail_ID ) {
        $response['code'] = 200;
        $response['data'] = $data;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );
}

/**
 *
 * It inserts a row into a table with the shared_id and staff_id
 *
 */
function sharing( $share_table, $shared_id, $staff_id, $shared_staff_id, $can_edit ) {
    global $db;
    $state    = [];
    $can_edit = ( 1 == $can_edit ) ? 'true' : 'false';

    // check if entry exists
    $stmt = $db->prepare( "SELECT id FROM $share_table WHERE staff_id = '$staff_id' AND shared_staff_id = '$shared_staff_id' " );
    $stmt->execute();
    $id = $stmt->fetch( PDO::FETCH_ASSOC );
    $stmt->closeCursor();

    // if entry exists, UPDATE column: 'can_edit'
    if ( $id ) {
        $stmt = $db->prepare( "UPDATE $share_table SET can_edit='$can_edit' WHERE id='$id[id]'" );
        deb( "UPDATE $share_table SET can_edit='$can_edit' WHERE id='$id[id]'" );
        $stmt->execute();
        $state = 'update';

    }
    //
    // if not INSERT values
    else {
        $stmt = $db->prepare( "INSERT INTO $share_table ('shared_id', 'staff_id','shared_staff_id','can_edit') VALUES (?,?,?,?)" );
        $stmt->execute( [$shared_id, $staff_id, $shared_staff_id, $can_edit] );
        $state = 'new';
    }
    return $state;

}

/**
 * It returns all the sharings of a specific item
 */
function load_sharings() {
    global $db, $API_param, $API_value, $user_id, $user_role;
    $table = $API_param.'_sharing';
    $stmt  = $db->prepare( "SELECT * FROM $table WHERE staff_id = '$API_value' " );
    deb( "SELECT * FROM $table WHERE staff_id = '$API_value' " );
    $stmt->execute();
    $sharings = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();

    $response = [];
    if ( $sharings ) {
        foreach ( $sharings as $key => $value ) {
            if ( 'project' === $API_param
                || 'appointment' === $API_param ) {
                $sharings[$key]['itemName'] = get_by_from( 'title', 'id', $sharings[$key]['shared_id'], $API_param );
            }
            if ( 'customer' === $API_param ) {
                $sharings[$key]['itemName'] = get_by_from( 'username', 'id', $sharings[$key]['shared_id'], $API_param );
            }
            $sharings[$key]['staffName'] = get_by_from( 'username', 'id', $sharings[$key]['shared_staff_id'], 'staff' );

        }

        $response['code'] = 200;
        $response['data'] = $sharings;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );
}

function remove_sharing() {
    global $db, $API_param, $API_value, $user_id, $user_role;
    $table = $API_param.'_sharing';

    $stmt = $db->prepare( "DELETE FROM $table WHERE id = '$API_value' " );
    $stmt->execute();
    $stmt->closeCursor();

    $response         = [];
    $response['code'] = 200;
    return_JSON( $response );

}
/*
//
//     ###    ##       ##           ######  ##     ##    ###    ########  #### ##    ##  ######    ######
//    ## ##   ##       ##          ##    ## ##     ##   ## ##   ##     ##  ##  ###   ## ##    ##  ##    ##
//   ##   ##  ##       ##          ##       ##     ##  ##   ##  ##     ##  ##  ####  ## ##        ##
//  ##     ## ##       ##           ######  ######### ##     ## ########   ##  ## ## ## ##   ####  ######
//  ######### ##       ##                ## ##     ## ######### ##   ##    ##  ##  #### ##    ##        ##
//  ##     ## ##       ##          ##    ## ##     ## ##     ## ##    ##   ##  ##   ### ##    ##  ##    ##
//  ##     ## ######## ########     ######  ##     ## ##     ## ##     ## #### ##    ##  ######    ######
//
*/
function all_sharings() {
    global $db, $API_param, $API_value, $user_id, $user_role;
    $sharings = false;
    $response = [];

    // CUSTOMER
    $stmt = $db->prepare( "SELECT * FROM customer_sharing WHERE staff_id = '$user_id' " );
    $stmt->execute();
    $customer = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    if ( $customer ) {
        $sharings = true;
        foreach ( $customer as $key => $value ) {
            $shared_user               = get_by_from( 'username', 'id', $customer[$key]['shared_id'], 'customer' );
            $cust[$key]['shared_user'] = "<a href='#customer/profile/".$customer[$key]['shared_id']."'>".$shared_user."</a>";

            $shared_with               = get_by_from( 'username', 'id', $customer[$key]['shared_staff_id'], 'staff' );
            $shared_with_email         = get_by_from( 'email', 'id', $customer[$key]['shared_staff_id'], 'staff' );
            $cust[$key]['shared_with'] = "<a href='mailto:".$shared_with_email."'>".$shared_with."</a>";
        }
        $response['data']['customers'] = $cust;
    }

    // PROJECTS
    $stmt = $db->prepare( "SELECT * FROM project_sharing WHERE staff_id = '$user_id' " );
    $stmt->execute();
    $projects = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    if ( $projects ) {
        $sharings = true;
        foreach ( $projects as $key => $value ) {
            $shared_project              = get_by_from( 'title', 'id', $projects[$key]['shared_id'], 'project' );
            $pro[$key]['shared_project'] = "<a href='#project/id/".$projects[$key]['shared_id']."'>".$shared_project."</a>";

            $shared_with              = get_by_from( 'username', 'id', $projects[$key]['shared_staff_id'], 'staff' );
            $shared_with_email        = get_by_from( 'email', 'id', $projects[$key]['shared_staff_id'], 'staff' );
            $pro[$key]['shared_with'] = "<a href='mailto:".$shared_with_email."'>".$shared_with."</a>";
        }
        $response['data']['projects'] = $pro;
    }

    // APPOINTMENTS
    $stmt = $db->prepare( "SELECT * FROM appointment_sharing WHERE staff_id = '$user_id' " );
    $stmt->execute();
    $appointments = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    if ( $appointments ) {
        $sharings = true;
        foreach ( $appointments as $key => $value ) {
            // $appointments[$key]['shared_with']  = get_by_from( 'username', 'id', $appointments[$key]['shared_staff_id'], 'staff' );
            $date = get_by_from( 'start_date', 'id', $appointments[$key]['shared_id'], 'appointment' );
            $time = get_by_from( 'start_time', 'id', $appointments[$key]['shared_id'], 'appointment' );

            $shared_project                  = get_by_from( 'title', 'id', $appointments[$key]['shared_id'], 'appointment' );
            $app[$key]['shared_appointment'] = "<span class=numeric>".$date." ".$time."</span>&nbsp;&nbsp;&nbsp; <a href='#appointment/id/".$appointments[$key]['shared_id']."'> ".$shared_project."</a>";

            $shared_with              = get_by_from( 'username', 'id', $appointments[$key]['shared_staff_id'], 'staff' );
            $shared_with_email        = get_by_from( 'email', 'id', $appointments[$key]['shared_staff_id'], 'staff' );
            $app[$key]['shared_with'] = "<a href='mailto:".$shared_with_email."'>".$shared_with."</a>";
        }
        $response['data']['appointments'] = $app;
    }

    if ( $sharings ) {
        $response['code'] = 200;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no sharings found';
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

function shared_with_me( $table, $shared_id ) {
    global $db, $user_id;
    $stmt = $db->prepare( "SELECT * FROM $table WHERE shared_id = :shared_id AND staff_id = :staff_id" );
    $stmt->execute( [':shared_id' => $shared_id, ':staff_id' => $user_id] );
    $data = $stmt->fetch( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
    if ( $data ) {
        $data['user_name'] = get_name_by_id( 'staff', $data['shared_staff_id'] );

        return $data;
    } else {
        return false;
    }
}