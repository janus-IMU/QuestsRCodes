/**
 * QuestRCode
 * Created by loizbek on 09/10/13.
 */

define(function(){
    var Overlay = Class.extend({
        init: function(selector, duration){
            if(typeof selector == "undefined"){
                selector = "#overlay";
            }
            if(typeof duration == "undefined"){
                duration = 1000;
            }
            this.duration = duration;
            this.selector = selector;
            $(this.selector).hide();

        },

        show: function(content, form){
            if(typeof content !== "undefined"){
                if( (typeof form !== "undefined") && form){
                    $(this.selector).html(Util.print(Patterns.OVERLAY_FORM,
                        [content]));
                }
                else{
                    $(this.selector).html(Util.print(Patterns.OVERLAY_CONTENT,
                                                        [content]));
                }
            }
            $(this.selector).fadeIn(this.duration);
        },
        hide: function(){
            $(this.selector).fadeOut(this.duration);
            $(this.selector).html("");
        }
    });
    return Overlay;
});