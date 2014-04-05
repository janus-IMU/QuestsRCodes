/**
 * QuestRCode
 * User: loizbek
 * Date: 10/10/13 (17:27)
 * Create and update the player
 */
function triggerAddPlayer(){
    $("#newPlayer").trigger("addPlayer");
}

define(['storage'], function(Storage){
    var Player = Class.extend({
        init: function(storedUser, overlayHandler, client){
            var self = this;
            this.client = client;
            this.overlayHandler = overlayHandler;
            if(storedUser === false){
                this.showNewPlayerForm();
            }
            else{
                this.name = storedUser.name;
                this.guildId = storedUser.guildId;
                this.guildmates = storedUser.guildmates;
                this.displayPlayerInfo();
            }
        },

        displayPlayerInfo: function(){
            $("#playerName").html(this.name);
            //$("#teammate").html(this.guildId);
        },

        showNewPlayerForm: function(){
            var self = this;
            this.overlayHandler.show(Util.print(Patterns.NEW_PLAYER_FORM), true);
            $("#user_name").focus();
            $('#newPlayer').bind("addPlayer", function(){
                self.newPlayer($('#user_name').val());
            });
        },

        newPlayer: function(pn){
            this.overlayHandler.hide();
            this.client.sendMessage(Types.Messages.ADDPLAYER, {name:pn});
        },

        addedPlayer: function(data){
            if(data.success === true){
                this.name = data.name;
                this.guildId = data.guildId;
                this.guildmates = data.guildmates;
                this.displayPlayerInfo();
                Storage.savePlayer({"name":this.name, "guildId":this.guildId, "guildmates":data.guildmates});
            }
            else{
                this.client.messageFailure_callback(Patterns.CREATE_PLAYER_FAILURE+" ("+data.message+")");
            }
        }

    });

    return Player;
});