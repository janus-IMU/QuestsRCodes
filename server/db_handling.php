<?php
require_once("config.inc.php");
$messages = $gametypes->Messages;

//Quick and very dirty every single type of query is here, no other representation of the environment (well, anyway this is php not a node.js server)
Class QRC_db{
	private $type;
	private $db_handler;
	
	/**
	 * $data expects the following structure :
	 * $data["type"] :"mysql" (no other db handled for now)
	 * 		- for "mysql" : 
	 * 			+ $data["prefix"] (table prefix)
	 * 			+ $data["host"], $data["user"], $data["pswd"] and $data["name"] (the db name)
	 * $empty : whether the database is expected to be completely empty
	 */
	function __construct($data, $empty=false){
		global $messages;
		$this->messages = $messages;
		if($data["type"] == "mysql"){
			$this->type = $data["type"];
			$this->prefix = $data["prefix"];
			$this->db_handler = new mysqli($data["host"], $data["user"], $data["pswd"], $data["name"], $data["port"]);
			if($this->db_handler->connect_error){
				throw new Exception('Could not connect to database');
			}
			$res = $this->db_handler->query("SELECT COUNT(*) as `nb` FROM `".$this->prefix."players`");
			if(!$empty && !$res){
				throw new Exception('Tables not created');
			}
			else if($empty && $res){
				throw new Exception('Tables already exist');
			}
		}
		else{
			throw new Exception($data["type"]." is not yet handled…");
		}
	}
	
	function createPlayer($name){
		$error = "";
		if($this->type == "mysql"){
			$query = "SELECT (MAX(`teamId`)+1) AS `myTeam` FROM `".$this->prefix."players`;";
			$res = $this->db_handler->query($query);
			if($res && $res->num_rows == 1){
				$myTeam = $res->fetch_object()->myTeam;
				$query = "INSERT INTO `".$this->prefix."players` (`id`, `name`, `teamId`) VALUES (NULL, '".$name."', '".$myTeam."');";
				$this->db_handler->query($query);
				if($res){
					if($myTeam==""){$myTeam=1;}
					$res = '{"success":true, "messageId": '.$this->messages->ADDEDPLAYER.', "name":"'.$_GET["name"].'", "guildId":'.$myTeam.', "guildmates":[]}';
				}
				else{ $error = $this->db_handler->error; }
			}
			else{
				$error = $this->db_handler->error;
			}
		}
		else{
			$error = "mmm, ".$this->type."what can we do ?";
		}
		if($error != ""){
			$res = '{"success":false, "message":"'.$error.'", "messageId": '.$this->messages->ERROR.'}';
		}
		return $res;
	}

	function storeAction($team, $game, $riddle, $clue, $timestamp){
//ICITE ccf. create player
	}


	/**
	 * loads an sql file and executes all queries
	 *
	 * Before executing a query, $replaced is... replaced by $replacing. This is
	 * useful when the SQL file contains generic words. Drop table queries are
	 * not executed.
	 *
	 * @param string filepath
	 * @param string replaced
	 * @param string|bool replacing (false to replace by stored prefix)
	 * @return void
	 * @author straight from piwigo, thanks!
	 */

	function execute_sqlfile($filepath, $replaced, $replacing=false){
	  $sql_lines = file($filepath);
	  if($replacing === false){
		  $replacing = $this->prefix;
	  }
	  $query = '';
	  foreach ($sql_lines as $sql_line)
	  {
		$sql_line = trim($sql_line);
		if (preg_match('/(^--|^$)/', $sql_line))
		{
		  continue;
		}
		$query.= ' '.$sql_line;
		// if we reached the end of query, we execute it and reinitialize the
		// variable "query"
		if (preg_match('/;$/', $sql_line))
		{
		  $query = trim($query);
		  $query = str_replace($replaced, $replacing, $query);
		  // we don't execute "DROP TABLE" queries
		  if ('mysql' == $this->type)
		  {
			if (!preg_match('/^DROP TABLE/i', $query))
			{
			  echo $query;/**/
			  ($result = $this->db_handler->query($query)) or exit("Error in ".$query);
			}
		  }
		  $query = '';
		}
	  }
	}
}


?>
