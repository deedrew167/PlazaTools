function toggleEmoticonSelector(){
	if($("#ptEmoticonSelector").style.display == "none"){
		$("#ptEmoticonSelector").style.display = "block";
		$("#ptEmoticonSelectorButton").classList.add("active");
	}else{
		$("#ptEmoticonSelector").style.display = "none";
		$("#ptEmoticonSelectorButton").classList.remove("active");
	}
}

$("body").insertAdjacentHTML("afterbegin", '<div id="ptEmoticonSelector" style="display:none"></div><div id="ptEmoticonSelectorButton"></div>');

$("#ptEmoticonSelectorButton").addEventListener("click", function() {
	toggleEmoticonSelector();
});

for(var cat in emoticons){
	$("#ptEmoticonSelector").innerHTML += "<hr title='"+cat+"'>";

	for(var emo in emoticons[cat])
		$("#ptEmoticonSelector").innerHTML += "<div class='ptEmoticonSelectorEmoticon' data-emoticon='"+emoticons[cat][emo].name+"' style='background-position:"+emoticons[cat][emo].pos+";width:"+emoticons[cat][emo].width+"px;height:"+emoticons[cat][emo].height+"px'></div>";
}

Array.prototype.forEach.call(document.querySelectorAll(".ptEmoticonSelectorEmoticon"), function(el){
	el.addEventListener("click", function() {
			// smh plaza+
			var input = $('#plazaplusactive') ? $('#plazaplus' + $('#plazaplusactive').value) : $("#bericht");
			input.value += input.value == "" || input.value.slice(-1) == " " ? el.getAttribute("data-emoticon") : " " + el.getAttribute("data-emoticon");
			input.focus();
	});
});

Array.prototype.forEach.call(document.querySelectorAll("#ptEmoticonSelectorButton, .ptEmoticonSelectorEmoticon"), function(el){
	el.style.backgroundImage = "url(" + self.options.resourceURI["emoticonTileset"] + ")";
});

// inject the URL to hyperlink feature with a script tag because firefox won't allow me to change the prototype normally
$("body").insertAdjacentHTML("afterbegin", '<div id="ptSettings" style="display:none">'+JSON.stringify(settings)+'</div>');
var s = document.createElement('script');
s.setAttribute('type', 'text/javascript');
s.setAttribute('src', self.options.resourceURI["chat-urltohyperlink"]);
$("body").appendChild(s);