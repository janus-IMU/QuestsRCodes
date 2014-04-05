/**
 * QuestRCode
 * User: loizbek
 * Date: 09/10/13 (01:32)
 * Communication with the server, when this handles node.js, it will be done here
 */

define(function(){
    var Client = Class.extend({
        init: function(){
            this.config = Util.loadJSON("config.json");
            /*handlers, work for php, should be adaptable for node and websocket…*/
            var self = this;
            this.handlers = [];
                this.handlers[Types.Messages.WELCOME] = function(data){self.connect_callback};
                this.handlers[Types.Messages.ADDEDPLAYER] = function(data){self.addedPlayer_callback(data);};
            this.failureHandlers=[];

            //Based on server type
            if(this.config.server_type == "php"){
                this.connection = new PhpConnection(this);//this.config.path, this.callback_connect);
            }
        },

        sendMessage: function(messageType, data){
            this.connection.send(messageType, data);
        },

        connect_callback: function(data){
            if ((typeof this.connection !== "undefined") && (this.connection.isConnected())){
                /*window.alert('youpi');*/
            }
            else{
                window.alert(Patterns.CONNECTION_FAILURE + '(' + data.message +').');
            }
        },

        /*The default callback function for when a message fails to be delivered to the server,
          invoked if this.failureHandlers[message] does not exist*/
        messageFailure_callback: function(data){
            window.alert(Patterns.MESSAGE_FAILURE + '(' + data.message +').');
        },

        onAddedPlayer: function(callback){
            this.addedPlayer_callback = callback;
        }
    });

 /*   var Message = Class.extend({
       init: function(messageId, clientType){
           if(clientType == "php"){
               this = new PhpMessage(messageId);
           }
           else{}
       }
    });*/

    var Connection = Class.extend({
        init: function(client){
            this.client = client;
        },
        send: function(message){

        }

    });

    var PhpConnection = Connection.extend({
        init: function(client){
            this._super(client);
            this.connected = false;
            this.path =  this.client.config.path;
            /*just tests that the php server is running with a db access*/
            if(typeof this.path === "undefined"){
                this.path = Constants.DEFAULT_SERVER_PATH;
            }
            this.path = this.path+'/'; /*#security : no slash at the end of path*/
            this.connect();
        },

        isConnected: function(connect){
            if(typeof connect == "undefined"){
                return this.connected;
            }
            else{
                this.connected = connect;
            }
        },

        connect: function(callback_connect){
            var self = this;
            $.ajax({
                type: 'GET',
                url: this.path + "test.php",
                data: { },
                dataType: "json"
            }).done(function(res){
                self.isConnected(res.dbConnection);
                self.client.connect_callback(res);
            }).fail(function(res){
                self.client.connect_callback(res);
            });
        },

        //sends a message to the server
        send: function(messageId, sentData){
            var self = this;
            sentData.messageId = messageId; //#message
            $.ajax({
                type: 'GET',
                url: this.path + "messageHandler.php",
                data: sentData,
                dataType: "json"
            }).done(function(res){
                self.client.handlers[res.messageId](res);
            }).fail(function(res){
                if(typeof self.client.failureHandlers[res.messageId] !== "undefined"){
                    self.client.failureHandlers[res.messageId](res);
                }
                else{
                    self.client.messageFailure_callback(res);
                }
            });
        }
    });

    return Client;
});
