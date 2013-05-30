<?php
$wpconfig = realpath("../../../../wp-config.php");
if (!file_exists($wpconfig))  {
	
	echo "Could not found wp-config.php. Error in path :\n\n".$wpconfig ;	
	die;	
}

require_once($wpconfig);
require_once(ABSPATH.'/wp-admin/admin.php');
global $wpdb;

include 'dialog_body.php';
exit;
?>