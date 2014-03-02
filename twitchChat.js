function unique(array) {
    return $.grep(array, function(el, index) {
        return index == $.inArray(el, array);
    });
}

var chatFilter = new function() {
    this.blacklist = ["b", "start", "a", "left", "right", "up", "down"];
    var self = this;
    
    
    this.check = function(message) {
        message = $.trim(message).toLowerCase();
        
        for(var i = 0; i < self.blacklist.length; i++ ) {
            if(self.blacklist[i] == message)
            {
                return false;
            }
        }
        
        return true;
    }
    
    this.remove_from_blacklist = function(item) {
        index = self.blacklist.indexOf($.trim(item));
        
        if (index > -1) {
            self.blacklist.splice(index, 1);
        }
    }
    
    this.add_to_blacklsit = function(items) {
        items = $.map(items, function(el){return el.toLowerCase()})
        self.blacklist = unique(self.blacklist.concat(items));
		filterPopup.draw_current_blacklist(self.blacklist);
    }
    
    this.change_filter = function() {
        
    }
}

var filterPopup = new function() {
    var self = this;
    var popupId = "chat-filter-popup";
    
    this.init = function() {
        self.draw_popup(chatFilter.blacklist);
        self.draw_current_blacklist(chatFilter.blacklist);
        
        $("#chat-filter-popup").on("click", "#filter-update-blacklist", function() {
            var items = $("#filter-input-items").val().split(";");
            chatFilter.add_to_blacklsit(items);
        });
        
        $("#chat-filter-popup").on("dblclick", "li", function(){
            chatFilter.remove_from_blacklist($(this).text());
            $(this).remove();
        });
        
        $("#chat-filter-popup").on("dblclick", ".emo-83", function(){
            var popupWindow = $(this).parent().parent();
            
            if(popupWindow.hasClass("filter_opened")) {
                popupWindow.removeClass("filter_opened");
                popupWindow.addClass("filter_closed");
                //popupWindow.height("28px");
                //popupWindow.css({"top" : 0, "left": 0});
            } else {
                popupWindow.removeClass("filter_closed");
                popupWindow.addClass("filter_opened");
                //popupWindow.css({"top": "300px", "left": "300px"})
                //popupWindow.height("300px");
            }
            
            
        });
    }
    
    this.draw_current_blacklist = function(items) {
        var appendNewItems = '';
        
        for(var i = 0; i < items.length; i++) {
            appendNewItems += '<li>' + items[i] + '</li>';
        }
            
        $("#filter-current-blacklist").html(appendNewItems);
    }
    
    this.show_popup = function() {
        
    }
    
    this.draw_popup = function() {
        var popupHtml = '';
        
        popupHtml += '<div class="filter_opened" id="'+ popupId +'">' + 
                        '<div>Drag <span class="emo-83" style="float: right"></span></div>' + 
                        '<span><label> <input type="radio" name="chooseMethod" />Black list </label> <label><input type="radio" name="chooseMethod" /> As Regexp</label> <label><input type="radio" name="chooseMethod" /> From file</label> <label><input type="radio" name="chooseMethod" /> Predefined</label></span>'+
                        '<div><input id="filter-input-items" type="text"  placeholder="Add phrases separated by ;" /><button id="filter-update-blacklist"> Add </button></div>' + 
                        '<div>Current: blacklsit: <ul id="filter-current-blacklist"></ul><p>By doubleclicking on the items you will remove them from the blacklist</p></div>'
                     '</div>';
                     
        $("body").append(popupHtml);
       
        self.style_popup();
        
    }
    
    this.style_popup = function() {
/*        var styles =  {
          "position": "absolute",
          "width": "300px",
          "height": "300px",
          "top"   : "300px",
          "left"  : "300px",
          "z-index": "1000",
          "background" : "#f5f5f5",
          "overflow"   : "auto"
        }
        
        $("#" + popupId).css(styles);
        
        $("#chat-filter-popup > div").css("margin", "10px");
        $("#chat-filter-popup label").css("display", "inline"); */
        $("#chat-filter-popup").draggable();
/*         $("#filter-update-blacklist").css("float", "right");
        $("#filter-current-blacklist").children().css({"float" : "left", "margin-right": "17px", "cursor": "pointer"}); */
    }
    
}

filterPopup.init();

$(document.head).append('<link rel="stylesheet" href="https://rawgithub.com/SayOmgPlz/TwitchFIlter/master/popup_styles.css">');

window.Chat.prototype.insert_chat_line = function (e){if(!chatFilter.check(e.message)){return;};if(this.restarting&&!this.history_ended)return;if(this.ignored[e.sender])return;if(e.sender==="jtv"||e.sender==="twitchnotify"){this.last_sender=e.sender,this.admin_message(this.format_message(e),e.sender==="twitchnotify");return}if(!e.is_action&&this.last_sender&&this.last_sender===e.sender&&this.last_sender!=="jtv"){var t='<p class="chat_line" style="display:block;">&raquo; '+this.format_message(e)+"</p>";this.insert_with_lock("#chat_line_list li:last",t)}else{this.last_sender=e.sender;var n=!!(Twitch.user.login()===CurrentChat.channel||CurrentChat.userData&&(CurrentChat.userData.is_staff||CurrentChat.userData.is_admin)||this.staff[Twitch.user.login()]||this.admins[Twitch.user.login()]||this.moderators[Twitch.user.login()]),r=e.is_action?"chat-line-action":"chat-line",i=!1,s=unescape(e.nickname);s.indexOf("ign-")===0&&(i=!0,s=s.substr("ign-".length));var o="chat-line-"+Math.round(Math.random()*1e9),u={id:o,showModButtons:n&&e.sender!=="jtv"&&e.sender!==Twitch.user.login(),timestamp:this.show_timestamps||!this.history_ended?e.timestamp:"",sender:e.sender,displayname:s,color:e.color},a="",f="";e.tagtype&&(f='<span class="tag %tagtype" title="%tagname">%tagname</span>&nbsp;',a=f.replace(/\%tagtype/g,e.tagtype).replace(/\%tagname/g,e.tagname)),e.turbo&&(f='<span class="tag %tagtype" title="%tagname">',f+='<a href="/products/turbo?ref=chat_badge" target="_blank">%tagname</a>',f+="</span> ",a+=f.replace(/\%tagtype/g,"turbo").replace(/\%tagname/g,"Turbo")),e.subscriber&&(f='<span class="tag %tagtype c%tagchannel" title="%tagname">',f+='<a href="/'+this.channel+'/subscribe?ref=in_chat_subscriber_link" target="_blank">%tagname</a>',f+="</span> ",a+=f.replace(/\%tagtype/g,"subscriber").replace(/\%tagname/g,"Subscriber").replace(/\%tagchannel/g,this.channel)),i&&(f='<span class="tag %tagtype" title="%tagname">%tagname</span>&nbsp;',a+=f.replace(/\%tagtype/g,"ign").replace(/\%tagname/g,"My IGN"));var l=ich[r](u)[0].outerHTML;l=l.replace(/\@tag/g,a),l=l.replace(/\@message/g,this.format_message(e)),!e.is_action&&e.sender!=="jtv"?this.insert_with_lock("#chat_line_list",l,e,o):this.insert_with_lock("#chat_line_list",l)}} 