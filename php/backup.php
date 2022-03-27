<?php

ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

$folder_to_backup = '../userdata';
$backup_folder    = 'backups';
//  array($backup_folder, 'privat', 'config');
$not_to_backup    = [$backup_folder];
$backup_file_name = $backup_folder.'/'.date( "Y_m_d" ).'.zip';

// create the backup_folder if it not exist
if ( !file_exists( $backup_folder ) ) {mkdir( $backup_folder, 0777, true );}

// Backup function
function run_backup( $folder_to_backup, $backup_file_name, $not_to_backup ) {
    // Remove existing archive
    if ( file_exists( $backup_file_name ) ) {unlink( $backup_file_name );}

    $zip = new ZipArchive();
    if ( !$zip->open( $backup_file_name, ZIPARCHIVE::CREATE ) ) {return false;}

    $folder_to_backup = str_replace( '\\', '/', realpath( $folder_to_backup ) );
    if ( is_dir( $folder_to_backup ) === true ) {
        $files = new RecursiveIteratorIterator(
            new RecursiveCallbackFilterIterator(
                new RecursiveDirectoryIterator(
                    $folder_to_backup, RecursiveDirectoryIterator::SKIP_DOTS ),
                function ( $fileInfo, $key, $iterator ) use ( $not_to_backup ) {
                    return $fileInfo->isFile() || !in_array( $fileInfo->getBaseName(), $not_to_backup );
                } ) );

        foreach ( $files as $file ) {
            // run through the filelist and add to zip
            $file = realpath( $file );
            if ( is_dir( $file ) === true ) {
                $zip->addEmptyDir( str_replace( $folder_to_backup.'/', '', $file.'/' ) );
            } elseif ( is_file( $file ) === true ) {
                $zip->addFromString( str_replace( $folder_to_backup.'/', '', $file ), file_get_contents( $file ) );
            }
        }
    } elseif ( is_file( $folder_to_backup ) === true ) {
        $zip->addFromString( basename( $folder_to_backup ), file_get_contents( $folder_to_backup ) );
    }
    return $zip->close();
} // Backup function

// get size of the lastest backup file
$files = scandir( $backup_folder, SCANDIR_SORT_DESCENDING );
// print_r( $files );

foreach ( $files as $file ) {
    if ( date( "Y_m_d" ).'.zip' === $file ) {
        // backup today already done
        exit;
    }
}
$last_file_size = filesize( $backup_folder.'/'.$files[0] );

// run di dance
run_backup( $folder_to_backup, $backup_file_name, $not_to_backup );

// get size of this backupfile
$files          = scandir( $backup_folder, SCANDIR_SORT_DESCENDING );
$this_file_name = $files[0];
$this_file_size = filesize( $backup_folder.'/'.$files[0] );

// delete this backup, if the same size like last backup
if ( $last_file_size == $this_file_size ) {
    unlink( $backup_folder.'/'.$files[0] );
}
// echo 'no changes';
