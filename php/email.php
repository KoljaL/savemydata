<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

 $server = 'w01ad1ea.kasserver.com';
 $user   = 'info@carlimero.com';
 $pass   = 'gBZ3vhHDhWuYLJar';
 $mbox = imap_open("{w011e9e8.kasserver.com:993/imap/ssl}", "spam@rasal.de", "ySUsYZbqPWsyW6HY");

 $mail_from = 'spam@rasal.de';
  
 $MC = imap_check($mbox);

// Rufe eine Übersicht aller Nachrichten im Eingangspostfach INBOX ab
$result = imap_fetch_overview($mbox, "1:{$MC->Nmsgs}", 0);
foreach ($result as $overview) {
    // echo "{$overview->from}<br>";

    if ($mail_from === $overview->from) {
        echo "{$overview->from}<br>";
    }
}
