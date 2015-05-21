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

function ptModify(data){
	if(data.match(/ ((?:https?:\/\/|www\.)[^\s\/$.?#].[^\s][^"|<|>| ]*)/gmi)){
		if(settings.chatImgurThumbnail)
			data = data.replace(/ (?:http:\/\/i.imgur.com\/)([a-zA-Z0-9]*)(\.jpg|\.png|\.gifv?)/gmi, function($0, $1, $2){
				var thumbnail = ($2 != ".gif" && $2 != ".gifv") ? $1 + 't' + $2 : $1 + ".gif";
				if(!$p("#ptImgurLinkThumbnail_"+$1))
					p.document.body.insertAdjacentHTML('afterbegin', '<div class="ptImgurLinkThumbnail" id="ptImgurLinkThumbnail_'+$1+'"><img src="http://i.imgur.com/' + thumbnail + '"></div>');

				return ' <a href="' + $0.trim() + '" class="ptImgurLink" onmouseenter="$p(\'#ptImgurLinkThumbnail_'+$1+'\').style.display=\'block\'" onmouseleave="$p(\'#ptImgurLinkThumbnail_'+$1+'\').style.display=\'none\'" onmousemove="ptImgurPopupPos(arguments[0], \''+$1+'\')" target="_blank">' + $0.trim() + '</a>';
			});
		if(settings.chatURLToHyperlink)
			data = data.replace(/ ((?:https?:\/\/)[^\s\/$.?#].[^\s][^"|<|>| ]*)/gmi, function($0){ return ' <a href="' + $0.trim() + '" target="_blank">' + $0.trim() + '</a>'; });
	}
	Array.prototype.forEach.call(window.parent.document.querySelectorAll(".ptImgurLinkThumbnail"), function(el){
		el.style.display = "none";
	});

	return data;
}

$("#demo").innerHTML = ptModify($("#demo").innerHTML);

// http://stackoverflow.com/a/26447781/1488896
(function() {
	// create XMLHttpRequest proxy object
	var oldXMLHttpRequest = XMLHttpRequest;

	// define constructor for my proxy object
	XMLHttpRequest = function() {
		var actual = new oldXMLHttpRequest();
		var self = this;

		this.onreadystatechange = null;

		// this is the actual handler on the real XMLHttpRequest object
		actual.onreadystatechange = function() {
			if (this.readyState == 4) {
				var data = actual.responseText;
				if(actual.responseText.split('<!--s-->')[1] != '')
					data = ptModify(data);

				self.responseText = data;
			}
			if (self.onreadystatechange) {
				return self.onreadystatechange();
			}
		};

		// add all proxy getters
		["status", "statusText", "responseType", "response",
		 "readyState", "responseXML", "upload"].forEach(function(item) {
			Object.defineProperty(self, item, {
				get: function() {return actual[item];}
			});
		});

		// add all proxy getters/setters
		["ontimeout, timeout", "withCredentials", "onload", "onerror", "onprogress"].forEach(function(item) {
			Object.defineProperty(self, item, {
				get: function() {return actual[item];},
				set: function(val) {actual[item] = val;}
			});
		});

		// add all pure proxy pass-through methods
		["addEventListener", "send", "open", "abort", "getAllResponseHeaders",
		 "getResponseHeader", "overrideMimeType", "setRequestHeader"].forEach(function(item) {
			Object.defineProperty(self, item, {
				value: function() {return actual[item].apply(actual, arguments);}
			});
		});
	}

	httpr = new XMLHttpRequest();
})();