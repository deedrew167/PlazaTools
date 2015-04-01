function toggleEmoticonSelector(){
	if($("#ptEmoticonSelector").style.display == "none"){
		$("#ptEmoticonSelector").style.display = "block";
		$("#ptEmoticonSelectorButton").classList.add("active");
	}else{
		$("#ptEmoticonSelector").style.display = "none";
		$("#ptEmoticonSelectorButton").classList.remove("active");
	}
}

chrome.storage.sync.get("settings", function(i){
	userSett = i.settings ? i.settings : defaultSettings; 
	for (var sett in defaultSettings) {
		if(!userSett.hasOwnProperty(sett)) userSett[sett] = defaultSettings[sett]; 
	};
	settings = userSett;

	$("body").insertAdjacentHTML("afterbegin", '<div id="ptEmoticonSelector" style="display:none"></div><div id="ptEmoticonSelectorButton"></div>');

	$("#ptEmoticonSelectorButton").addEventListener("click", function() {
		toggleEmoticonSelector();
	});

	for(var cat in emoticons){
		$("#ptEmoticonSelector").innerHTML += "<div class='ptEmotionSelectorCategory'>"+cat+"</div>";

		for(var emo in emoticons[cat])
			$("#ptEmoticonSelector").innerHTML += "<div class='ptEmoticonSelectorEmoticon' data-emoticon='"+emoticons[cat][emo].name+"' style='background-position:"+emoticons[cat][emo].pos+";width:"+emoticons[cat][emo].width+"px;height:"+emoticons[cat][emo].height+"px'></div>";
	}

	Array.prototype.forEach.call(document.querySelectorAll(".ptEmoticonSelectorEmoticon"), function(el){
		el.addEventListener("click", function() {
			$("#bericht").value += $("#bericht").value == "" || $("#bericht").value.slice(-1) == " " ? el.getAttribute("data-emoticon") : " " + el.getAttribute("data-emoticon");
			$("#bericht").focus();
		});
	});

	// inject the URL to hyperlink feature with a script tag because chrome won't allow me to change the prototype normally

	// so ghetto huh :/
	$("body").insertAdjacentHTML("afterbegin", '<div id="ptSettings" style="display:none">'+JSON.stringify(settings)+'</div>');
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', chrome.extension.getURL("inject/chat-urltohyperlink.js"));
	$("body").appendChild(s);
});