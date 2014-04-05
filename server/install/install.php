<?php
function install(){
	require_once("../config.inc.php");
	require_once("../db_handling.php");

	$error = false;
	try{
		$db = new QRC_db($conf["db"], true);
	}catch(Exception $e){
		$error = true;
		exit('{"dbConnection":false, "message":"'.$e->getMessage().'"}');
		
	}
	if(!$error){
		$db->execute_sqlfile('install.sql', DEFAULT_PREFIX_TABLE);
		return "done";
	}                 
}

echo "<p>install: ".install()."</p>";











?>
