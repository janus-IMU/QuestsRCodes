QuestsRCodes
============
This app was designed and implemented at the LIRIS lab (http://liris.cnrs.fr) in the course of the Janus project, sponsored by the IMU Labex (http://imu.universite-lyon.fr/).

QuestsRCodes is a system to create and run a QR code based treasure hunt.

The current version is mostly based on external QR code readers and uses extensively localstorage.

The game allows to specify the whole hunt in a JSON file.

Requirements
------------
To run, QuestsRCodes requires :
* a server with php
* a database system here TODO

Coding conventions and tags
------------------------
Many functionalities will not be developed in the first versions. When modifications are necessary for a given anticipated functionality, a tag will be added in the code.
Existing tags are the following:
* #BQ       → to interface with BrowserQuest
* #security → test data types, entry values and such
* #message  → message handling (through a message class for instance)

Order in which the javascript files call each other
---------------------------------------------------
* home calls class / jquery and then main
* main calls ??
* card calls position


Configuration
-------------
###client
####client/config.json:
{
    "server_type":"php", //the server type only php here
    "path":"../server"   //path to the server (optional), see Constants.DEFAULT_SERVER_PATH
}

####Game data
To this point the game data is only text based, but is to be put in a folder (in case we include media later). The folder is to have an explicit name and the file containing the quest is ALWAYS called game_data.json. It contains:
* a game Id;
* a game title;
* the default feedback when a QR code is not scanned at the appropriate moment;
* the feedback to be displayed when the quest is completed;
* the list of physical clues (QR codes), each of which has:
	* an Id (used in the generation of the QR code);
	* the color of the code (hexa);
	* an indication of where the code is to be put in the physical world;
* the list of riddles that will allow the player to find the clues they are associated to a id (the first riddle will be called "/"). Each riddle has:
	* a text;
	* a textual aid;
	* some riddles need a few riddles to be answered before they appear, that's what the trigger array stands for;
	* a list of clues which have a special feedback in the context of the riddle. Each clue is referenced by its identifier and its effect in the current context:
		* feedback;
		* the next riddle to be given to the player (nextQuestion → when next question is true it is the end of the quest / when the value is false it's not an accepted answer / otherwise one should use the id of a riddle).

Setting up a quest
----------------
When a quest is configured in a game_data.json file, the system can generate the QRcodes, to do so one should load ~/client/qrcodelist.html?game=NAMEOFYOURGAME (the name of your game being the name of the folder containing the information).

###server
See config.inc.sample.php

Install Server
------------
Server installation is done by loading page server/install/install.php

Client js side files
------------------
* home calls the libs and patterns (strings that are used) and the main;
* the game folder should be indicated in the main.js file, which calls game.js;
* game.js calls:
	* storage → to store game data in localstorage (to be modified to store game state online);
	* client  → connect to the server;
	* player  → create and update player;
	* overlay → to display an overlay;
	* path    → calls storage and handles the path of the player;
	* map     → to interpret the game_data;

the shared folder contains message constants (to be exchanged with the server) but I'm not sure whether it is used…

Backlog and known bugs
-------------------
* In the admin interface, rewrite game_data.json on first load to put the content in the database (for the admin), so that the users cannot access the locations.
* The server should handle
	* score board;
	* cooperation (for instance for triggers).
* Riddles could include media;
* Feedback could include media;
* The ideal would be an HTML5 QR code reader to remain in the app.
