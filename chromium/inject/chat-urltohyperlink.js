var $ = function(e) { return document.querySelector(e); },
	$p = function(e) { return window.parent.document.querySelector(e); },
	p = window.parent,
	settings = JSON.parse($("#ptSettings").innerHTML);

function ptImgurPopupPos(e, id){
	el = $p("#ptImgurLinkThumbnail_"+id);
	frPos = $p("iframe.chat").getBoundingClientRect();
	el.style.left = frPos.left + e.clientX - (el.offsetWidth / 2) + 4 + "px";
	el.style.top = frPos.top + e.clientY + p.document.body.scrollTop - el.getBoundingClientRect().height - 2 + "px";
	el.style.display = "block";
}

(function(open) {
	XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
		if(url.match(/chatscreen.php/))
			this.addEventListener("load", function(){
				if($("#demo").innerHTML.match(/ ((?:https?:\/\/|www\.)[^\s\/$.?#].[^\s][^"|<|>| ]*)/gmi)){
					if(settings.chatImgurThumbnail)
						$("#demo").innerHTML = $("#demo").innerHTML.replace(/ (?:http:\/\/i.imgur.com\/)([a-zA-Z0-9]*)(\.jpg|\.png|\.gifv?)/gmi, function($0, $1, $2){
							var thumbnail = ($2 != ".gif" && $2 != ".gifv") ? $1 + 't' + $2 : $1 + ".gif";
							if(!$p("#ptImgurLinkThumbnail_"+$1))
								p.document.body.insertAdjacentHTML('afterbegin', '<div class="ptImgurLinkThumbnail" id="ptImgurLinkThumbnail_'+$1+'"><img src="http://i.imgur.com/' + thumbnail + '"></div>');

							return ' <a href="' + $0.trim() + '" class="ptImgurLink" onmouseenter="$p(\'#ptImgurLinkThumbnail_'+$1+'\').style.display=\'block\'" onmouseleave="$p(\'#ptImgurLinkThumbnail_'+$1+'\').style.display=\'none\'" onmousemove="ptImgurPopupPos(arguments[0], \''+$1+'\')" target="_blank">' + $0.trim() + '</a>';
						});
					if(settings.chatURLToHyperlink)
						$("#demo").innerHTML = $("#demo").innerHTML.replace(/ ((?:https?:\/\/)[^\s\/$.?#].[^\s][^"|<|>| ]*)/gmi, function($0){ return ' <a href="' + $0.trim() + '" target="_blank">' + $0.trim() + '</a>'; });
				}
				if(this.response.split('<!--s-->')[1] != ''){
					Array.prototype.forEach.call(window.parent.document.querySelectorAll(".ptImgurLinkThumbnail"), function(el){
						el.style.display = "none";
					});
					if(settings.chatMentionHighlight)
						$("#demo").innerHTML = $("#demo").innerHTML.replace(/(?:[^>]@)([\w~]+)/gmi, function($0, $1){ return ' <a href="http://pc.3dsplaza.com/members/view_profile.php?user=' + $1+ '" target="_blank">@' + $1 + '</a>'; });
				}
			}, false);
		open.call(this, method, url, async, user, pass);
	};
})(XMLHttpRequest.prototype.open);