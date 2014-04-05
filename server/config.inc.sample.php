<?php
	include_once("constants.inc.php");
//rename to confing.inc.php
    $conf["db"]['type']="mysql";//only type supported so far
    $conf["db"]['prefix']=DEFAULT_PREFIX_TABLE;//replace by whatever prefix you want, or "" for none
    $conf["db"]['host']="localhost";
    $conf["db"]['user']="QuestRCode";
    $conf["db"]['pswd']="putyourcodehere";
    $conf["db"]['name']="QuestRCode";
    $conf["db"]['port']=ini_get("mysqli.default_port");
    
    $gametypes=json_decode(file_get_contents(GAMETYPES_PATH));
?>
