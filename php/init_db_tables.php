<?php

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

    $stafffields = [
        ['pos' => '10', 'row' => '1', 'name' => 'username', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Username', 'db' => 'username/staff/id'],
        ['pos' => '20', 'row' => '1', 'name' => 'email', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Email', 'db' => 'email/staff/id'],
        ['pos' => '20', 'row' => '1', 'name' => 'password', 'type' => 'password', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Password', 'db' => 'password/staff/id'],
        ['pos' => '10', 'row' => '2', 'name' => 'firstname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Firstname', 'db' => 'firstname/staff/id'],
        ['pos' => '20', 'row' => '2', 'name' => 'lastname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Lastname', 'db' => 'lastname/staff/id'],
        ['pos' => '30', 'row' => '2', 'name' => 'instaname', 'type' => 'text', 'widths' => '100/150/300', 'edit' => 'hide', 'label' => 'Instaname', 'db' => 'instaname/staff/id'],
        ['pos' => '10', 'row' => '3', 'name' => 'comment', 'type' => 'textarea', 'widths' => '400/550/600', 'edit' => 'hide', 'label' => 'Comment', 'db' => 'comment/staff/id'],
        ['pos' => '10', 'row' => '3', 'name' => 'location', 'type' => 'text', 'widths' => '400/550/600', 'edit' => 'hide', 'label' => 'Location', 'db' => 'location/staff/id'],
        ['pos' => '10', 'row' => '4', 'name' => 'role', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Role', 'db' => 'role/staff/id'],
        ['pos' => '20', 'row' => '4', 'name' => 'permission', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Permission', 'db' => 'permission/staff/id'],
        ['pos' => '30', 'row' => '4', 'name' => 'lang', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Language', 'db' => 'lang/staff/id'],
        ['pos' => '40', 'row' => '4', 'name' => 'color', 'type' => 'color', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Color', 'db' => 'color/staff/id']
    ];
    foreach ( $stafffields as $field ) {
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
    $db->exec( 'CREATE TABLE staff(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL DEFAULT "",
            password TEXT NOT NULL DEFAULT "",
            firstname TEXT NOT NULL DEFAULT "",
            lastname TEXT NOT NULL DEFAULT "",
            email TEXT NOT NULL DEFAULT "",
            comment TEXT NOT NULL DEFAULT "",
            location TEXT NOT NULL DEFAULT "",
            role TEXT NOT NULL DEFAULT "",
            permission TEXT NOT NULL DEFAULT "",
            color TEXT NOT NULL DEFAULT "#f6b73c",
            avatar TEXT NOT NULL DEFAULT "",
            lang TEXT NOT NULL DEFAULT "en",
            date TEXT NOT NULL DEFAULT ""
        )' );

    // create first staffs
    $admin = ['username' => 'Admin', 'password' => 'password', 'firstname' => 'admin', 'lastname' => 'admin', 'email' => 'admin@admin.org', 'location' => 'Masbeck 57, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'admin', 'permission' => '0', 'color' => '#e9553b'];
    insert_into_db( $admin, 'staff' );

    $manager = ['username' => 'Manager', 'password' => 'password', 'firstname' => 'manager', 'lastname' => 'manager', 'email' => 'manager@manager.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'manager', 'permission' => '0', 'color' => '#cb7832'];
    insert_into_db( $manager, 'staff' );

    $staff = ['username' => 'Staff 0', 'password' => 'password', 'firstname' => 'staff', 'lastname' => 'staff', 'email' => 'staff@staff.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'staff', 'permission' => '0', 'color' => '#c9ac57'];
    insert_into_db( $staff, 'staff' );

    $staff1 = ['username' => 'Staff 1', 'password' => 'password', 'firstname' => 'staff', 'lastname' => 'staff', 'email' => 'staff@staff.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'staff', 'permission' => '0', 'color' => '#988cca'];
    insert_into_db( $staff1, 'staff' );

    $staff2 = ['username' => 'Staff 2', 'password' => 'password', 'firstname' => 'staff', 'lastname' => 'staff', 'email' => 'staff@staff.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'staff', 'permission' => '0', 'color' => '#6a8759'];
    insert_into_db( $staff2, 'staff' );
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
    $db->exec( 'CREATE TABLE customer(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            staff_id TEXT NOT NULL DEFAULT "",
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
            ids_can_read TEXT NOT NULL DEFAULT "",
            ids_can_write TEXT NOT NULL DEFAULT "",
            date TEXT NOT NULL  DEFAULT ""
        )' );

    $customer = ['username' => 'customer', 'staff_id' => '1', 'password' => 'password', 'firstname' => 'user', 'lastname' => 'user', 'email' => 'user@user.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'customer', 'permission' => '0'];
    insert_into_db( $customer, 'customer' );
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
            ids_can_read TEXT NOT NULL DEFAULT "",
            ids_can_write TEXT NOT NULL DEFAULT "",
            date TEXT NOT NULL  DEFAULT ""
        )' );
}

function init_appointment_table() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE appointment(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL DEFAULT "",
            start_date TEXT NOT NULL DEFAULT "",
            start_time TEXT NOT NULL DEFAULT "",
            duration TEXT NOT NULL DEFAULT "",
            staff_id TEXT NOT NULL DEFAULT "",
            project_id TEXT NOT NULL DEFAULT "",
            customer_id TEXT NOT NULL DEFAULT "",
            comment TEXT NOT NULL DEFAULT "",
            location TEXT NOT NULL DEFAULT "",
            lng TEXT NOT NULL DEFAULT "",
            lat TEXT NOT NULL DEFAULT "",
            map_link TEXT NOT NULL DEFAULT "",
            ids_can_read TEXT NOT NULL DEFAULT "",
            ids_can_write TEXT NOT NULL DEFAULT "",
            date TEXT NOT NULL  DEFAULT ""
        )' );
}

function init_files_table() {
    global $db;
    // create user table
    $db->exec( 'CREATE TABLE files(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            staff_id TEXT NOT NULL DEFAULT "",
            origin TEXT NOT NULL DEFAULT "",
            origin_id TEXT NOT NULL DEFAULT "",
            name TEXT NOT NULL DEFAULT "",
            type TEXT NOT NULL DEFAULT "",
            path TEXT NOT NULL DEFAULT "",
            path_thumb TEXT NOT NULL DEFAULT "",
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

function create_dummy_data() {
    global $start, $db_path;
    include './dummy_content.php';
    // create_dummy_staff(100);
    // create_dummy_customer(1500);
    // create_dummy_project(15000);
    // create_dummy_appointment(30000);
    // create_dummy_staff( 10 );
    create_dummy_customer( 15 );
    create_dummy_project( 15 );
    create_dummy_appointment( 100, 10 );
    echo "<center><h1>";
    echo round( filesize( $db_path ) / 1000, 0 )."kb of ";
    echo 'data created in: '.round(  ( microtime( true ) - $start ), 1 ).'s';
    echo "</h1></center>";
    exit;
}
/*
//
//   ######  ########    ###    ######## ########
//  ##    ##    ##      ## ##   ##       ##
//  ##          ##     ##   ##  ##       ##
//   ######     ##    ##     ## ######   ######
//        ##    ##    ######### ##       ##
//  ##    ##    ##    ##     ## ##       ##
//   ######     ##    ##     ## ##       ##
//
*/

function create_dummy_staff( $count ) {
    for ( $i = 0; $i < $count; $i++ ) {
        $random_name = random_name();
        $email       = $random_name[0]."@".$random_name[1].".com";
        $staff       = [
            'username'   => 'S'.substr( $random_name[0], 1 ).'_'.$random_name[1],
            'password'   => 'password',
            'firstname'  => $random_name[0],
            'lastname'   => $random_name[1],
            'instaname'  => $random_name[1].'_'.$random_name[0],
            'email'      => $email,
            'location'   => 'Stapeler Str. 41, Havixbeck',
            'comment'    => random_text(),
            'role'       => 'staff',
            'permission' => random_int( 1, 5 ).','.random_int( 1, 5 ).','.random_int( 1, 5 ),
            'color'      => random_color()
        ];
        insert_into_db( $staff, 'staff' );
        // create_user( $user );
    }
}

/*
//
//   ######  ##     ##  ######  ########  #######  ##     ## ######## ########
//  ##    ## ##     ## ##    ##    ##    ##     ## ###   ### ##       ##     ##
//  ##       ##     ## ##          ##    ##     ## #### #### ##       ##     ##
//  ##       ##     ##  ######     ##    ##     ## ## ### ## ######   ########
//  ##       ##     ##       ##    ##    ##     ## ##     ## ##       ##   ##
//  ##    ## ##     ## ##    ##    ##    ##     ## ##     ## ##       ##    ##
//   ######   #######   ######     ##     #######  ##     ## ######## ##     ##
//
*/
function create_dummy_customer( $count ) {
    for ( $i = 0; $i < $count; $i++ ) {
        $random_name = random_name();
        $email       = $random_name[0]."@".$random_name[1].".com";
        $customer    = [
            'staff_id'   => get_ramdon_id_from( 'staff' ),
            'username'   => 'C'.substr( $random_name[0], 1 ).'_'.$random_name[1],
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
            'role'       => 'customer',
            'permission' => '10'
        ];
        // create_customer( $user );
        insert_into_db( $customer, 'customer' );
    }
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
function create_dummy_appointment( $count, $days ) {
    global $db;
    for ( $i = 0; $i < $count; $i++ ) {

        // get real projects
        $stmt = $db->prepare( "SELECT * FROM project" );
        $stmt->execute();
        $user          = $stmt->fetchAll();
        $count_user    = count( $user );
        $j             = rand( 0, $count_user - 1 );
        $customer_id   = $user[$j]['customer_id'];
        $staff_id      = $user[$j]['staff_id'];
        $project_id    = $user[$j]['id'];
        $project_title = $user[$j]['title'];
        // echo $customer_id;
        // echo $staff_id;
        // echo $project_id;
        // exit;

        // $days = 550;
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
        // $random_datetime_start = $random_date.'T'.$random_hour.':'.$random_minute;
        $random_date_start = $random_date;
        $random_time_start = $random_hour.':'.$random_minute;
        // enddate is startdate + duration
        // $datetime = new DateTime($random_datetime_start);
        // $datetime->add(new DateInterval('PT'.$random_duration.'M'));
        // $random_datetime_end = $datetime->format('Y-m-d H:i:s');

        $project = [
            'start_date'  => $random_date_start,
            'start_time'  => $random_time_start,
            // 'start_time'  => $random_datetime_start,
            // 'end_time'    => $random_datetime_end,
            'duration'    => $random_duration,
            'title'       => $project_title,
            'staff_id'    => $staff_id,
            'project_id'  => $project_id,
            'customer_id' => $customer_id,
            'comment'     => random_text()
            // 'public'      => random_int(0, 1)
        ];
        insert_into_db( $project, 'appointment' );
    }
}

/**
 *
 * It returns a random id from a table
 * @param table The name of the table you want to get a random ID from.
 * @return id of a random row from the table.
 *
 */
function get_ramdon_id_from( $table ) {
    global $db;
    $stmt = $db->prepare( "SELECT id FROM $table" );
    $stmt->execute();
    $IDs = $stmt->fetchAll( PDO::FETCH_ASSOC );
    // print_r( $IDs );
    $i = random_int( 0, count( $IDs ) - 1 );
    return $IDs[$i]['id'];
}
