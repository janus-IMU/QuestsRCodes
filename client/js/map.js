/**
 * The map of the treasure hunt with all allowed paths…
 * Created by loizbek on 11/10/13.
 */

define(function(){
    var Map = Class.extend({
        init: function(riddles, defaultfb, victoryfb){
            if(typeof defaultfb !== "undefined"){
                this.defaultfb = defaultfb;
            }
            if(typeof victoryfb !== "undefined"){
                this.victoryfb = victoryfb;
            }
            if (typeof riddles !== "undefined"){
                this.riddles = riddles;//#security
            }
            else{
                window.alert(Patterns.LOAD_MAP_FAILURE);
            }
        },

        getRiddleText: function(riddle){
            var res = false;
            if(typeof this.riddles[riddle] !== "undefined"){
                res = this.riddles[riddle].text;
            }
            else{
                window.alert(Util.print(Patterns.RIDDLE_FAILURE), [riddle]);
            }
            return res;
        },

        getVictoryMessage: function(){
            if(typeof this.victoryfb !== "undefined"){
                return this.victoryfb;
            }
            else{
                return Patterns.VICTORY;
            }

        },

        getRiddleHelp: function(riddle){
            var res = false;
            if(typeof this.riddles[riddle] !== "undefined"){
                if(typeof this.riddles[riddle].help === "undefined"){
                    res = Patterns.NO_HELP;
                }
                else{
                    res = this.riddles[riddle].help;
                }
            }
            else{
                window.alert(Util.print(Patterns.RIDDLE_FAILURE), [riddle]);
            }
            return res;
        },

        getFeedback: function(riddle, clue){
            var res = false;
            if(typeof this.riddles[riddle] !== "undefined"){
                if((typeof this.riddles[riddle].clues[clue] !== "undefined") &&
                   (typeof this.riddles[riddle].clues[clue].feedback !== "undefined")){
                    //personnalized feeback
                    res = this.riddles[riddle].clues[clue].feedback;
                }
                else if(typeof this.riddles[riddle].defaultFeedback !== "undefined"){
                    //default riddle feedback
                    res = this.riddles[riddle].defaultFeedback;
                }
                else if(typeof this.defaultfb !== "undefined"){
                    //default game feedback
                    res = this.defaultfb ;
                }
                else{
                    //hard coded default feedback
                    res = Patterns.DEFAULT_FEEDBACK;
                }
            }
            else{
                window.alert(Util.print(Patterns.RIDDLE_FAILURE), [riddle]);
            }
            return res;
        },

        /**
         * Returns the next question if someone answers clue to riddle and not trigger question is generated
         * true means the player completed the quest (unless trigger question)
         * false means not quite the appropriate answer
         * others should be a question Id
         */
        getAbsoluteNext: function(riddle, clue){
            var res = false;
            if(typeof this.riddles[riddle] !== "undefined"){
                if((typeof this.riddles[riddle].clues[clue] !== "undefined") &&
                   (typeof this.riddles[riddle].clues[clue].nextQuestion !== "undefined")){
                    res = this.riddles[riddle].clues[clue].nextQuestion;
                    if((typeof res !== "boolean") && (this.riddles[res] === "undefined")){
                        res = false;
                        window.alert(Util.print(Patterns.NEXT_RIDDLE_FAILURE), [res, riddle]);
                    }
                }
            }
            else{
                window.alert(Util.print(Patterns.RIDDLE_FAILURE), [riddle]);
            }
            return res;
        },

        //riddleState is under the form {solved:["id1","id2","id3"], triggered:["id2","id4"]}
        getTrigger: function(riddleState){
            for(var key in this.riddles){
                if($.inArray(key, riddleState.triggered) == -1){
                    //has never been triggered so it can be…
                    if(typeof this.riddles[key].trigger !== "undefined"){
                        var res = true;
                        for(var i=0; res && (i < this.riddles[key].trigger.length); i++){
                            res = res && ($.inArray(this.riddles[key].trigger[i], riddleState.solved) !== -1);
                        }
                        if(res === true){
                            return key; //a state should only trigger one riddle, otherwise it will be triggered on next success…
                        }
                    }
                }
            }
            return false;
        }


    });

    return Map;
});