/**
 * To handle the path taken by the player to solve the quest
 * This will save the sequence of questions that they will go through and for each question, the various answers (QRCode scanned) along with the help they required
 * Created by loizbek on 11/10/13
 * Implemented by Élise & loizbek :-)
 */
define(['storage'], function(Storage){
    var Path = Class.extend({
        init: function(storedPath){
            if( (typeof storedPath !== "undefined") && (storedPath !== false)){
                this.riddles = storedPath.riddles;
                this.clues = storedPath.clues;
            }
            else{
                this.riddles = []; //La liste (chronologique) des identifiants des questions par lesquelles le joueur est passé et si elles sont terminées (les id sont des string, solved est un booléen)
                //contiendra des objets : {id: idQuestion, solved:true}
                this.clues = {}; //de la forme {idRiddle:[{"clueId":/*id du qrcode scanné*/, "timestamp":/*Moment du scan new Date().getTime()*/}, etc.], idRiddle2:etc.} idRiddle se trouve forcément dans this.riddles
                this.addRiddle(Constants.RIDDLES.FIRST);
            }
        },

        isOver: function(){
            return this.getCurrentRiddleId() == Constants.RIDDLES.LAST;
        },

        addRiddle:function(riddleId){
            if(riddleId === true){
                riddleId = Constants.RIDDLES.LAST;
            }
            this.riddles.push({id:riddleId, solved:false, triggered:false});
            Storage.savePath({"riddles":this.riddles, "clues":this.clues});
        },

        setRiddleAsTriggered: function(){
            if(this.getCurrentRiddleId() !== false){
                this.riddles[this.riddles.length - 1].triggered = true;
            }
            Storage.savePath({"riddles":this.riddles, "clues":this.clues});
        },

        solveCurrentRiddle:function(andSave){
            if(this.getCurrentRiddleId() !== false){
                this.riddles[this.riddles.length - 1].solved = true;
            }
            if(typeof andSave=="undefined"){
                andSave = true;
            }
            if(andSave){
                Storage.savePath({"riddles":this.riddles, "clues":this.clues});
            }
        },

        addClue: function(clueID, riddleId){
            if(typeof riddleId === "undefined"){
                riddleId = this.getCurrentRiddleId();
            }
            if(riddleId !== false){
                if(typeof this.clues[riddleId] === "undefined"){
                    this.clues[riddleId]=[];
                }
                this.clues[riddleId].push({clueId: clueID, timestamp:new Date().getTime()});
            }
            Storage.savePath({"riddles":this.riddles, "clues":this.clues});
        },

        addHelp: function(){
            riddleId = this.getCurrentRiddleId();
            if(riddleId !== false){
                if(typeof this.clues[riddleId] === "undefined"){
                    this.clues[riddleId]=[];
                }
                this.clues[riddleId].push({clueId: Constants.HINT, timestamp:new Date().getTime()});
            }
            Storage.savePath({"riddles":this.riddles, "clues":this.clues});
        },

        getCurrentRiddleId: function(){
            if(this.riddles.length>0){
                return this.riddles[this.riddles.length - 1].id;
            }
            else{
                return false;
            }
        },

        countRiddles: function(){
            return this.riddles.length;
        },

        getLastClueId: function(){
            //si pas de current riddle → false
            if(this.getCurrentRiddleId() === false){
                return false;
            }
            //si pas de clue pour ce riddle → false
            else{
                var riddleId = this.getCurrentRiddleId();
                if(typeof this.clues[riddleId] === "undefined"){
                    return false;
                }
                //sinon le dernier clueId du tableau associé à getCurrentRiddle
                else{
                    return this.clues[riddleId][this.clues[riddleId].length-1].clueId;
                }
            }
        },

        /*Gets the clue number cluePos associated to the riddlePos-th riddle*/
        getClue: function(riddlePos, cluePos){
            if(typeof this.riddles[riddlePos]!=="undefined"){
                if(typeof this.clues[this.riddles[riddlePos].id][cluePos].clueId !== "undefined"){
                    return this.clues[this.riddles[riddlePos].id][cluePos].clueId;
                }
            }
            else{
                return false;
            }
        },

        /**
         * Executes aFunction({id:riddleId, solved:boolean}, tmpResult) for all riddleIds in this.riddles in chronological order (from this.riddles[0] and on)
         * tempResult being the result of the previous call which will be "undefined" during the first loop
         */
        foreachRiddle: function(aFunction){
            var res = undefined;
            for (var i = 0; i < this.riddles.length; i++) {
                res = aFunction(this.riddles[i], res);
            }
            return res;
        },

        /**
         * Executes aFunction({clueId: clueID, timestamp:new Date().getTime()}, tempResult) for each clue associated with aRiddleId or with all clues if aRiddleId is undefined
         * tempResult being the result of the previous call of aFunction which will be "undefined" during the first loop
         */
        //parcours dans l'ordre chronologique des riddles, puis dans l'ordre des clues, on parcourt les cases des tableaux, puisque les new sont "pushés"
        foreachClue: function(aFunction, aRiddleId){
            var element, res = undefined;
            if(typeof riddleId !== "undefined"){
                for (var i = 0; i < this.clues[aRiddleId].length; i++) {
                    res = aFunction(this.clues[i], res);
                }
            }
            else{
                for (var i = 0; i < this.riddles.length; i++) {
                    for (var j = 0; j < this.riddles[i].length; j++) {
                        res = aFunction(this.clues[this.riddles[i]][j], res);
                    }
                }
            }
            return res;
        }
    });
    return Path;
});
