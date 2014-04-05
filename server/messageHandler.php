<?php
// To handle the messages sent by the client

require_once("config.inc.php");
require_once("db_handling.php");

$dbConf = $conf["db"];
$messages = $gametypes->Messages;

Class MessageHandler{
	
    function __construct(){
		global $dbConf, $messages;
		$this->messages = $messages;
		try{
			$this->db = new QRC_db($dbConf);
		}
		catch(Exception $e){
			$res = '{"success":false, "message":"'.$e->getMessage().'", "messageId": '.$this->messages->ERROR.'}';
		}
    }
    
    function chooseAction(){
		switch($_GET["messageId"]){
			case $this->messages->ADDPLAYER :
				echo $this->db->createPlayer($_GET["name"]);
				break;
			case $this->message->ADDCLUE :
			    echo $this->db->storeGame($_GET["team"], $_GET["game"], $_GET["riddle"], $_GET["clue"], $_GET["timestamp"]);
			default:
				echo "unknown message";
		}
	}
}

$mh = new MessageHandler();
echo $mh->chooseAction();
?>
