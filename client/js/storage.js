/**
 * QuestRCode
 * User: loizbek
 * Date: 09/10/13 (01:24)
 * Storage and state update handled here…
 */

define( function(){
    var Storage = {
        gameName : "QRquests",
        init: function(gameId){
            this.gameId = gameId;
        },

        useable: function(){
            return typeof Modernizr !== "undefined";
        },

        hasLocalStorage: function() {
            return this.useable() && Modernizr.localstorage;
        },

        loadQuest: function(aGameId){
            var retval = {};
            if(typeof aGameId == "undefined"){
                aGameId = this.gameId;
                if(typeof aGameId === "undefined"){
                    window.alert("did not init the storage");//#security did not check that everywhere (this.gameId do in storeQuest and maybe other places)
                }
            }
            if(this.hasLocalStorage() && (typeof localStorage.QRquests !== "undefined")) {
                var tmp = JSON.parse(localStorage.QRquests);
                if(tmp && tmp.games && tmp.games[aGameId]){
                    retval.path = tmp.games[aGameId];
                }
                else{retval.path=false;}
            }
            retval.player = this.loadPlayer();
            return retval;
        },

        loadPlayer: function(){
        /*#BQ : to interface with browserquest and use the same "player/guild" variables*/
            var retval = false;
            if(this.hasLocalStorage() && (typeof localStorage.QRquests !== "undefined")) {
                var tmp = JSON.parse(localStorage.QRquests);
                if(tmp && tmp.player){
                    retval = tmp.player;
                }
            }
            return retval;
        },

        savePlayer: function(aPlayer){
            var tmp = {};
            if(this.hasLocalStorage()){
                if(typeof localStorage.QRquests !== "undefined") {
                    tmp = JSON.parse(localStorage.QRquests);
                }
                tmp.player = aPlayer;
                localStorage.QRquests = JSON.stringify(tmp);
            }
        },

        savePath: function(aPath){
            //{"riddles":this.riddles, "clues":this.clues}
            var tmp = {};
            if(this.hasLocalStorage()){
                if(typeof localStorage.QRquests !== "undefined") {
                    tmp = JSON.parse(localStorage.QRquests);
                    if(typeof tmp.games==="undefined"){
                        tmp.games={}
                    }
                    tmp.games[this.gameId] = aPath;
                }
                localStorage.QRquests = JSON.stringify(tmp);
            }
        }

    };

    return Storage;
});
