<?php

$license_key = $_GET['license_key'];
$file_name = 'licenses/' . $license_key . '.json';
if (!file_exists($file_name)) {
    http_response_code(404);
    return;
}

header('Content-Type: application/json');
http_response_code(200);
echo file_get_contents($file_name);

?>