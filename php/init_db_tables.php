<?php

/*
//
//  #### ##    ## #### ########
//   ##  ###   ##  ##     ##
//   ##  ####  ##  ##     ##
//   ##  ## ## ##  ##     ##
//   ##  ##  ####  ##     ##
//   ##  ##   ###  ##     ##
//  #### ##    ## ####    ##
//
*/

/*
//
//  ######## #### ######## ##       ########   ######
//  ##        ##  ##       ##       ##     ## ##    ##
//  ##        ##  ##       ##       ##     ## ##
//  ######    ##  ######   ##       ##     ##  ######
//  ##        ##  ##       ##       ##     ##       ##
//  ##        ##  ##       ##       ##     ## ##    ##
//  ##       #### ######## ######## ########   ######
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
        ['pos' => '20', 'row' => '4', 'name' => 'permission', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Permission', 'db' => 'permission/customer/id'],
        ['pos' => '30', 'row' => '4', 'name' => 'staff_id', 'type' => 'text', 'widths' => '100/100/100', 'edit' => 'hide', 'label' => 'Staff_id', 'db' => 'staff_id/customer/id']
    ];
    foreach ( $customerfields as $field ) {
        insert_into_db( $field, 'customer_fields' );
    }
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

    // $manager = ['username' => 'Manager', 'password' => 'password', 'firstname' => 'manager', 'lastname' => 'manager', 'email' => 'manager@manager.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'manager', 'permission' => '0', 'color' => '#cb7832'];
    // insert_into_db( $manager, 'staff' );

    // $staff = ['username' => 'Staff 0', 'password' => 'password', 'firstname' => 'staff', 'lastname' => 'staff', 'email' => 'staff@staff.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'staff', 'permission' => '0', 'color' => '#c9ac57'];
    // insert_into_db( $staff, 'staff' );

    $staff1 = ['username' => 'Staff 1', 'password' => 'password', 'firstname' => 'staff', 'lastname' => 'staff', 'email' => 'staff@staff.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'staff', 'permission' => '0', 'color' => '#988cca'];
    insert_into_db( $staff1, 'staff' );

    $staff2 = ['username' => 'Staff 2', 'password' => 'password', 'firstname' => 'staff', 'lastname' => 'staff', 'email' => 'staff@staff.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'staff', 'permission' => '0', 'color' => '#6a8759'];
    insert_into_db( $staff2, 'staff' );
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
            date TEXT NOT NULL  DEFAULT ""
        )' );

    $customer = ['username' => 'customer', 'staff_id' => '1', 'password' => 'password', 'firstname' => 'user', 'lastname' => 'user', 'email' => 'user@user.org', 'location' => 'Stapeler Str. 41, Havixbeck', 'comment' => 'lorem iopsum', 'role' => 'customer', 'permission' => '0'];
    insert_into_db( $customer, 'customer' );
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
function init_project_table() {
    global $db;
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
function init_appointment_table() {
    global $db;
    $db->exec( 'CREATE TABLE appointment(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT NOT NULL DEFAULT "",
            project_id TEXT NOT NULL DEFAULT "",
            staff_id TEXT NOT NULL DEFAULT "",
            title TEXT NOT NULL DEFAULT "",
            start_date TEXT NOT NULL DEFAULT "",
            start_time TEXT NOT NULL DEFAULT "",
            duration TEXT NOT NULL DEFAULT "",
            comment TEXT NOT NULL DEFAULT "",
            location TEXT NOT NULL DEFAULT "",
            lng TEXT NOT NULL DEFAULT "",
            lat TEXT NOT NULL DEFAULT "",
            map_link TEXT NOT NULL DEFAULT "",
            state TEXT NOT NULL DEFAULT "",
            date TEXT NOT NULL  DEFAULT ""
        )' );
}
/*
//
//  ######## #### ##       ########  ######
//  ##        ##  ##       ##       ##    ##
//  ##        ##  ##       ##       ##
//  ######    ##  ##       ######    ######
//  ##        ##  ##       ##             ##
//  ##        ##  ##       ##       ##    ##
//  ##       #### ######## ########  ######
//
*/
function init_files_table() {
    global $db;
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
//   ######  ##     ##    ###    ########  #### ##    ##  ######
//  ##    ## ##     ##   ## ##   ##     ##  ##  ###   ## ##    ##
//  ##       ##     ##  ##   ##  ##     ##  ##  ####  ## ##
//   ######  ######### ##     ## ########   ##  ## ## ## ##   ####
//        ## ##     ## ######### ##   ##    ##  ##  #### ##    ##
//  ##    ## ##     ## ##     ## ##    ##   ##  ##   ### ##    ##
//   ######  ##     ## ##     ## ##     ## #### ##    ##  ######
//
*/

function init_customer_sharing_table() {
    global $db;
    $db->exec( 'CREATE TABLE customer_sharing(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            staff_id TEXT NOT NULL DEFAULT "",
            shared_id TEXT NOT NULL DEFAULT "",
            shared_staff_id TEXT NOT NULL DEFAULT "",
            can_edit TEXT NOT NULL DEFAULT "false",
            date TEXT NOT NULL  DEFAULT ""
        )' );

    $customer_sharing = ['shared_id' => '4', 'staff_id' => '5', 'shared_staff_id' => '1'];
    insert_into_db( $customer_sharing, 'customer_sharing' );
}

function init_project_sharing_table() {
    global $db;
    $db->exec( 'CREATE TABLE project_sharing(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            staff_id TEXT NOT NULL DEFAULT "",
            shared_id TEXT NOT NULL DEFAULT "",
            shared_staff_id TEXT NOT NULL DEFAULT "",
            can_edit TEXT NOT NULL DEFAULT "false",
            date TEXT NOT NULL  DEFAULT ""
        )' );
    $project_sharing = ['shared_id' => '4', 'staff_id' => '5', 'shared_staff_id' => '1'];
    insert_into_db( $project_sharing, 'project_sharing' );
}

function init_appointment_sharing_table() {
    global $db;
    $db->exec( 'CREATE TABLE appointment_sharing(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            staff_id TEXT NOT NULL DEFAULT "",
            shared_id TEXT NOT NULL DEFAULT "",
            shared_staff_id TEXT NOT NULL DEFAULT "",
            can_edit TEXT NOT NULL DEFAULT "false",
            date TEXT NOT NULL  DEFAULT ""
        )' );
    $appointment_sharing = ['shared_id' => '4', 'staff_id' => '5', 'shared_staff_id' => '1'];
    insert_into_db( $appointment_sharing, 'appointment_sharing' );
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
function init_log_table() {
    global $db;
    $db->exec( 'CREATE TABLE access_log(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            "date" TEXT NOT NULL  DEFAULT "",
            ip TEXT NOT NULL DEFAULT "",
            "username" TEXT NOT NULL DEFAULT "",
            "user_id" TEXT NOT NULL DEFAULT "",
            user_role TEXT NOT NULL DEFAULT "",
            "API_endpoint" TEXT NOT NULL DEFAULT "",
            "API_param" TEXT NOT NULL DEFAULT "",
            "API_value" TEXT NOT NULL DEFAULT "",
            "POST" TEXT NOT NULL DEFAULT "",
            "HTTP_USER_AGENT" TEXT NOT NULL DEFAULT "",
            "user_token" TEXT NOT NULL DEFAULT ""
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
function create_dummy_data() {
    global $start, $db_path;
    include './dummy_content.php';
    // create_dummy_staff(100);
    // create_dummy_customer(1500);
    // create_dummy_project(15000);
    // create_dummy_appointment(30000);
    // create_dummy_staff( 10 );
    create_dummy_customer( 10 );
    create_dummy_project( 10 );
    create_dummy_appointment( 10, 3 );
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
            'username'   => $random_name[0].' '.$random_name[1],
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
    global $db;

    // get real customer
    $stmt = $db->prepare( "SELECT * FROM customer" );
    $stmt->execute();
    $user       = $stmt->fetchAll();
    $count_user = count( $user );

    for ( $i = 0; $i < $count; $i++ ) {
        $j = rand( 0, $count_user - 1 );

        $customer = [
            'title'            => random_body(),
            'customer_id'      => $user[$j]['id'],
            'staff_id'         => $user[$j]['staff_id'],
            'comment_staff'    => random_text(),
            'comment_customer' => random_text()
        ];
        insert_into_db( $customer, 'project' );
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

    // get real projects
    $stmt = $db->prepare( "SELECT * FROM project" );
    $stmt->execute();
    $user       = $stmt->fetchAll();
    $count_user = count( $user );

    for ( $i = 0; $i < $count; $i++ ) {
        $j             = rand( 0, $count_user - 1 );
        $customer_id   = $user[$j]['customer_id'];
        $staff_id      = $user[$j]['staff_id'];
        $project_id    = $user[$j]['id'];
        $project_title = $user[$j]['title'];
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
        $random_date_start = $random_date;
        $random_time_start = $random_hour.':'.$random_minute;

        $project = [
            'start_date'  => $random_date_start,
            'start_time'  => $random_time_start,
            'duration'    => $random_duration,
            'title'       => $project_title,
            'staff_id'    => $staff_id,
            'project_id'  => $project_id,
            'customer_id' => $customer_id,
            'state'       => random_int( 1, 4 ),
            'comment'     => random_text()
        ];
        insert_into_db( $project, 'appointment' );
    }
}

/*
//
//  ########     ###    ##    ## ########   #######  ##     ##    #### ########
//  ##     ##   ## ##   ###   ## ##     ## ##     ## ###   ###     ##  ##     ##
//  ##     ##  ##   ##  ####  ## ##     ## ##     ## #### ####     ##  ##     ##
//  ########  ##     ## ## ## ## ##     ## ##     ## ## ### ##     ##  ##     ##
//  ##   ##   ######### ##  #### ##     ## ##     ## ##     ##     ##  ##     ##
//  ##    ##  ##     ## ##   ### ##     ## ##     ## ##     ##     ##  ##     ##
//  ##     ## ##     ## ##    ## ########   #######  ##     ##    #### ########
//
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

// $customer_sharing = ['shared_id' => '4', 'staff_id' => '5', 'shared_staff_id' => '1'];
// insert_into_db( $customer_sharing, 'customer_sharing' );