<?php

ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

$db_path = 'db/teddst.db';

if ( !file_exists( $db_path ) ) {
    $db = new PDO( 'sqlite:'.$db_path );
    $db->exec( 'CREATE TABLE customer(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL DEFAULT ""
    )' );

} else {
    $db = new PDO( 'sqlite:'.$db_path );
}

$user = [
    'customername' => 'Paul Meyer',
    'firstname'    => 'Paul',
    'lastname'     => 'Meyer',
    'passwdord'    => 'password',
    'email'        => 'email',
    'comment'      => 'test',
    'phone'        => '12234',
    'street'       => 'Main',
    'street_nr'    => '99',
    'city'         => 'Munich',
    'city_nr'      => '123',
    'rolde'        => '10',
    'roless'       => '10',
    'permission'   => '10'
];
insert_into_db( $user, 'customer' );

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
}
