<?php

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

    $stmt = $db->prepare( "SELECT * FROM $API_param WHERE id = :id" );
    $stmt->execute( [':id' => $API_value] );
    $profile = $stmt->fetch( PDO::FETCH_ASSOC );
    $stmt->closeCursor();

    $response = [];
    if ( $profile ) {
        $response['code'] = 200;
        $response['data'] = $profile;
    } else {
        $response['code']    = 400;
        $response['data']    = [];
        $response['message'] = 'no file found';
    }
    return_JSON( $response );
}

function get_profiles_as_table( $param ) {
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
    global $db, $API_param, $API_value, $user_id;

    // $stmt = $db->prepare( "
    // SELECT p.*
    //     FROM project_sharing ps
    //     INNER JOIN project p ON ps.share_id = p.id
    //     WHERE ps.staff_id = $user_id
    // UNION
    // SELECT * FROM project  WHERE staff_id = $user_id
    // " );

    // // $stmt = $db->prepare( "SELECT * FROM project $where" );
    // $stmt->execute();
    // $profiles = $stmt->fetchAll( PDO::FETCH_ASSOC );
    // $stmt->closeCursor();
    // $response = [];
    // if ( $profiles ) {
    //     // deb( $profiles );
    //     $response['code'] = 200;
    //     $response['data'] = $profiles;
    // } else {
    //     $response['code']    = 400;
    //     $response['data']    = [];
    //     $response['message'] = 'no form profile found';
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
    $stmt->closeCursor();
    $response = [];
    if ( $project ) {

        // SELECT * FROM "project" INNER JOIN customer ON customer.id = project.customer_id
        $stmt = $db->prepare( "SELECT a.id, a.start_date, a.start_time FROM appointment a WHERE project_id =?" );
        $stmt->execute( [$API_param] );
        $project['appointments'] = $stmt->fetchAll( PDO::FETCH_ASSOC );
        $stmt->closeCursor();
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
    global $db, $API_param, $API_value, $user_id;

    if ( '' !== $API_value ) {
        $where = ' WHERE id = '.$API_value;
    } else {
        $where = '';
    }

    $stmt = $db->prepare( "
      SELECT p.*
          FROM project_sharing ps
          INNER JOIN project p ON ps.share_id = p.id
          WHERE ps.staff_id = $user_id
      UNION
      SELECT * FROM project  WHERE staff_id = $user_id
      " );

    // $stmt = $db->prepare( "SELECT * FROM project $where" );
    $stmt->execute();
    $projects = $stmt->fetchAll( PDO::FETCH_ASSOC );
    $stmt->closeCursor();
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
        $stmt = $db->prepare( "SELECT * FROM project WHERE customer_id = :id" );
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
    $stmt->closeCursor();
    $response = [];
    if ( $appointments ) {
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
    $stmt->closeCursor();
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
