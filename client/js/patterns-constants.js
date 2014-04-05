/**
 * QuestRCode
 * User: loizbek
 * Date: 18/09/13 (10:32)
 * Content: The list of element structures used in the system
 * TODO: Ideally the patterns should be self contained associating the proper variables to the pattern
 * for the time being this is handled manually
 */

var Patterns = {
    CONNECTION_FAILURE: "Could not connect to server",
    MESSAGE_FAILURE: "An error occured",
    CREATE_PLAYER_FAILURE: "The creation of the player failed…",
    LOAD_MAP_FAILURE: "The loading of the map failed…",
    RIDDLE_FAILURE: "This riddle ({0}) does not exist…",
    NEXT_RIDDLE_FAILURE: "The riddle ({0}) said to follow the current one ({1}) does not exist, check game_data.json",
    DEFAULT_FEEDBACK: "Not quite, no…",
    OVERLAY_CONTENT: "<div><div class='closeButton' /><div class='middle'>{0}</div></div>",
    OVERLAY_FORM: "<div><div class='middle'>{0}</div></div>",
    NEW_PLAYER_FORM: "<form id='newPlayer' action='javascript:triggerAddPlayer()'><p>Choisissez un nom&nbsp;</p><input type='text' id='user_name' /></form>",
    NEW_FEEDBACK:    "<div id='feedback'>{0}</div>",
    QRCODE: "<figure>\n\t{0}\n\t<figcaption>{1}</figcaption>\n</figure>",
    QUESTION: "{0}.&nbsp;{1}",
    VICTORY: "Bravo, vous avez mené à bien votre quête :)",
    HELP_BUTTON: "Aide",
    NEW_HELP:    "<div id='assistance'>{0}</div>",
    NO_HELP: "Pas d'aide pour cette question"

};

var Constants = {
    DEFAULT_SERVER_PATH: "../server",
    GAMETYPES_PATH: "../shared/gametypes.json",
    QR_URL_VAR_NAME: "codescanned",
    RIDDLES:{
        FIRST:"/",
        LAST: "*"
    },
    HINT: "??"
};
