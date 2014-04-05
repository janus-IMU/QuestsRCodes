/**
 * Created by loizbek on 11/10/13.
 */
define(['qrcode.min'],function(){
    //ugly as fuck see utils…
    Util.print=function(str, rplc){
        var regex = new RegExp("{[oc0-9]+}", "g");
        return str.replace(regex, function(item) {
            var val = item.substring(1, item.length - 1);
            var replace="";
            if(val==="o"){
                replace="{";
            }
            else if (val === "c"){
                replace = "}";
            }
            else{
                val = parseInt(val);
                if ( (val >= 0) && (val<rplc.length)){
                    replace = rplc[val];
                }
            }
            return replace;
        });
    };

    function showCodes(path){
        var dataSource = Util.loadJSON(path+"/game_data.json");
        $('h1').html(dataSource.id+":"+dataSource.title);
        dataSource = dataSource.physicalClues;
        /*First QRCode*/
        var url=window.location.href.replace(/qrcodelist.html\??.*/,"index.html");
        $('main').append(Util.print("<figure><div data-id='home'></div><caption><a href='{0}'>{0}</a><br/><br/>{1}</caption></figure>",
            [url, "The QRCode to launch the game (if needed)"]
        ));
        var qrcode = new QRCode($("[data-id=home]")[0], {
            text: url,
            width: 512,
            height: 512,
            colorDark : "black",
            colorLight : "#dddddd",
            correctLevel : QRCode.CorrectLevel.H
        });

        /*The Content*/
        for(var i=0;i<dataSource.length;i++){
            var url=window.location.href.replace(/qrcodelist.html\??.*/,"index.html?"+Constants.QR_URL_VAR_NAME+"="+dataSource[i].clueId);
            $('main').append(Util.print("<figure><div id='{0}'></div><caption><a href='{1}'>{1}</a><br/><br/>{2}</caption></figure>",
                [dataSource[i].clueId, url, dataSource[i].location]
            ));
            var qrcode = new QRCode(document.getElementById(dataSource[i].clueId), {
                text: url,
                width: 512,
                height: 512,
                colorDark : dataSource[i].color,
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }

    showCodes(Util.getUrlVars()["game"]);
});
