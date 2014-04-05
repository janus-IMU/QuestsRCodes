<?php
/**
 * QuestRCode
 * User: loizbek
 * Date: 18/09/13 (10:32)
 * Content: To test whether the server is up and running with a database connection
 */



include_once("config.inc.php");
require_once("db_handling.php");

$error = false;
try{
	$db = new QRC_db($conf["db"]);
}catch(Exception $e){
	$error = true;
	exit('{"dbConnection":false, "message":"'.$e->getMessage().'"}');
	
}
if(!$error){
	echo '{"dbConnection":true}';
}
?>
