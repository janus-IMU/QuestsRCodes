/**
 * QuestRCode
 * User: loizbek
 * Date: 20/09/13 (00:45)
 * Content: The game itself, linking cards, table and user
 */
define(['storage', 'client', 'player', 'overlay', 'path', 'map'], function(Storage, Client, Player, Overlay, Path, Map){
    var Game = Class.extend({
        init: function(dataSource){//dataSource, either an object or a string pointing to a directory containing a game_data.json file (no '/' at the end of the path)
            if(typeof dataSource == "string"){
                dataSource = Util.loadJSON(dataSource+"/game_data.json");
            }
            this.id = dataSource.id;
            this.overlay = new Overlay();
            this.client = new Client();
            this.map = new Map(dataSource.riddles, dataSource.defaultFeedback, dataSource.victoryFeedback);
            //environment variables
            $('title').html(dataSource.title);
            $('h1').html(dataSource.title);
            Storage.init(this.id);
            var tmp=Storage.loadQuest();
            this.player = new Player(tmp.player, this.overlay, this.client);
            this.path = new Path(tmp.path);
            var self=this;
            if(tmp.player!==false){
                this.evalScan();
                this.displayPathInfo();
            }
            else{
                this.client.onAddedPlayer(function(data){
                    self.player.addedPlayer(data);
                    self.evalScan();
                    self.displayPathInfo();
                });

            }
            if(!this.path.isOver()){
                $('#help').html(Patterns.HELP_BUTTON);
                $('#help').click(function(){self.showHelp()});
            }
            else{
                $('#help').html("");
                $('#help').attr("id","done");
            }
        },

        /**
         * Evaluates the clue that has just been scanned based on the current path and on the map
         */
        evalScan: function(){
            if(!this.path.isOver()){
                var code = Util.getUrlVars()[Constants.QR_URL_VAR_NAME];
                if(typeof code !== "undefined"){
                    this.path.addClue(code);
                    this.showFeedback();
                    var next = this.map.getAbsoluteNext(this.path.getCurrentRiddleId(), this.path.getLastClueId());
                    if(next !== false){
                        this.path.solveCurrentRiddle(false);
                        var trueNext = this.map.getTrigger(this.getSolvedAndTriggered());
                        if(trueNext !== false){
                            this.path.addRiddle(trueNext); //solved before
                            this.path.setRiddleAsTriggered();
                        }
                        else{
                            this.path.addRiddle(next); //solved before
                        }
                    }
                }
            }
        },


        /**
         * Sends to the database the full path of the player
         */
        uploadClue: function(){
            this.client.sendMessage(Messages.ADDCLUE,
                {"team": this.client.team,
                 "game": this.id,
                 "riddle": this.path.getCurrentRiddleId(),
                 "clue": this.path.getLastClueId(),
                 "timestamp":this.path.getClue(this.path.getCurrentRiddleId(), this.path.getLastClueId()).timestamp});
        },

        /**
         * Display methods
         */
        displayPathInfo: function(){
            if(this.path.isOver()){
                $('#question').html(Util.print(this.map.getVictoryMessage(), []));
            }
            else{
                $('#question').html(Util.print(Patterns.QUESTION, [this.path.countRiddles(), this.map.getRiddleText(this.path.getCurrentRiddleId())]));
            }
        },

        //Displays the feedback for the last clue added
        showFeedback: function(){
            this.overlay.show(Util.print(Patterns.NEW_FEEDBACK, [this.map.getFeedback(this.path.getCurrentRiddleId(), this.path.getLastClueId())]));
            var self=this;
            $(".closeButton").click(function(){self.overlay.hide();});

        },

        //Displays help
        showHelp: function(){
            this.overlay.show(Util.print(Patterns.NEW_HELP, [this.map.getRiddleHelp(this.path.getCurrentRiddleId())]));
            this.path.addHelp();
            var self=this;
            $(".closeButton").click(function(){self.overlay.hide();});
        },

        innerFunctions: {//to be called in an iterator
            testRforTriggered: function(riddle, res){
                if(typeof res == "undefined"){
                    res = [];
                }
                if(riddle.triggered===true){
                    res.push(riddle.id);
                }
                return res;
            },
            testRforSolved: function(riddle, res){
                if(typeof res == "undefined"){
                    res = [];
                }
                if(riddle.solved===true){
                    res.push(riddle.id);
                }
                return res;
            },
            testRforSolvedOrTriggered: function(riddle, res){

                if(typeof res == "undefined"){
                    res = {solved:[], triggered:[]};
                }
                if(riddle.solved===true){
                    res.solved.push(riddle.id);
                }
                if(riddle.triggered===true){
                    res.triggered.push(riddle.id);
                }
                return res;
            }
        },

        //list of solved riddles
        getSolved: function(){
            var self=this;
            return this.path.foreachRiddle(self.innerFunctions.testRforSolved);
        },
        //list of triggered riddles
        getTriggered: function(){
            var self=this;
            return this.path.foreachRiddle(self.innerFunctions.testRforTriggered);
        },
        //all at once
        getSolvedAndTriggered: function(){
            var self=this;
            return this.path.foreachRiddle(self.innerFunctions.testRforSolvedOrTriggered);
        }
    });
    return Game;
});
