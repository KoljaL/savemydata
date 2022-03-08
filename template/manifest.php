<?php
$url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$url = str_replace('wp-content/plugins/tattoo-crm/theme/manifest.php', '', $url);
$manifest = [
    "lang"              => "en-US",
    "name"              => "Tattoo CRM",
    "short_name"        => "TattooCRM",
    "start_url"         => "$url",
    "scope"             => "$url",
    "display"           => "standalone",
    "background_color"  => "#fdfdfd",
    "theme_color"       => "#db4938",
    "orientation"       => "portrait-primary",
    "icons" => [
            [
                "src"   =>  "$url./icons/icon-72x72.png",
                "sizes" =>  "72x72",
                "type"  =>  "image/png"
              ],
              [
                "src"   =>  "$url./icons/icon-96x96.png",
                "sizes" =>  "96x96",
                "type"  =>  "image/png"
              ],
              [
                "src"   =>  "$url./icons/icon-128x128.png",
                "sizes" =>  "128x128",
                "type"  =>  "image/png"
              ],
              [
                "src"   =>  "$url./icons/icon-144x144.png",
                "sizes" =>  "144x144",
                "type"  =>  "image/png"
              ],
              [
                "src"   =>  "$url./icons/icon-152x152.png",
                "sizes" =>  "152x152",
                "type"  =>  "image/png"
              ],
              [
                "src"   =>  "$url./icons/icon-192x192.png",
                "sizes" =>  "192x192",
                "type"  =>  "image/png"
              ],
              [
                "src"   =>  "$url./icons/icon-384x384.png",
                "sizes" =>  "384x384",
                "type"  =>  "image/png"
              ],
              [
                "src"   =>  "$url./icons/icon-512x512.png",
                "sizes" =>  "512x512",
                "type"  =>  "image/png"
              ]
        ],
];

header('Content-Type: application/json');
echo json_encode($manifest);
