var version = "v" + chrome.runtime.getManifest().version,
	settings,
	isChecked = function(e) { if(e) return " checked"; },
	currentTab = "About";

chrome.storage.sync.get("settings", function(i){
	userSett = i.settings ? i.settings : defaultSettings; 
	for (var sett in defaultSettings) {
		if(!userSett.hasOwnProperty(sett)) userSett[sett] = defaultSettings[sett]; 
	};
	settings = userSett;

	if(settings.forbidden)
		$("#tabAbout #title").innerHTML = "FuckYou ";

	$("#tabAbout #title").insertAdjacentHTML("beforeend", version);
	$("#tabLoading").style.display = "none";

	for(var s in settings){
		if($("#"+s)){
			$("#"+s).value = settings[s];
			$("#"+s).checked = settings[s];
		}
	}

	for(var cr in settings.chatNotifierChatrooms)
		$("#"+settings.chatNotifierChatrooms[cr]).checked = true;

	var chatNotifierWhiteList = "";
	for(var n in settings.chatNotifierWhiteList){
		chatNotifierWhiteList += settings.chatNotifierWhiteList[n] + "\n";
	}
	$("#chatNotifierList").value = chatNotifierWhiteList.trim();
	$("#forumQuoteTemplate").value = settings.forumQuoteTemplate;

	Array.prototype.forEach.call($$(".tab"), function(el, i){
		el.addEventListener("click", function() {
			changeTab(el.innerHTML);
		});
	});

	$("#save").addEventListener("click", function() {
		saveSettings();
	});

	Array.prototype.forEach.call($$("#container input, #container textarea, #container select"), function(el, i){
		el.addEventListener("input", function() {
			$("#save").innerHTML = "Save changes";
			$("#save").classList.add("active");
		});
		el.addEventListener("change", function() {
			$("#save").innerHTML = "Save changes";
			$("#save").classList.add("active");
		});
	});

	changeTab(currentTab);

	chrome.notifications.getPermissionLevel(function(lvl){
		if(lvl == "denied"){
			$("#chatNotifierGroup").innerHTML = '<legend><input type="checkbox" name="chatNotifier" id="chatNotifier" checked><label for="chatNotifier">Notifier</label></legend>'+
				'You have denied us permission to show you notifications.<br>Please enable it from your browser settings to use this feature.';
			$("#Chat").classList.add("important");
		}
	});
});

function changeTab(tabName){
	Array.prototype.forEach.call($$("#container > div"), function(el, i){
		el.style.display = "none";
	});
	Array.prototype.forEach.call($$(".tab"), function(el, i){
		el.classList.remove("active");
	});
	$("#tabs #"+tabName).classList.add("active");
	$("#container #tab"+tabName).style.display = "block";
	currentTab = tabName;
	if(currentTab != "About"){
		$("#save").style.display = "block";
	}else{
		$("#save").style.display = "none";
	}
}

function saveSettings(){
	var settings = window.settings;
	settings.chatNotifierChatrooms = [];

	Array.prototype.forEach.call($$("#container input, #container select"), function(el){
		if(settings.hasOwnProperty(el.getAttribute('name')))
			settings[el.getAttribute('name')] = el.value;
	});
	Array.prototype.forEach.call($$("#container input[type=checkbox]"), function(el){
		if(settings.hasOwnProperty(el.getAttribute('name')))
			settings[el.getAttribute('name')] = el.checked;
	});
	Array.prototype.forEach.call($$("#chats input"), function(el){
		if(el.checked)
			settings.chatNotifierChatrooms.push(el.getAttribute('name'));
	});
	settings.chatNotifierWhiteList = $("#chatNotifierList").value.split("\n");
	settings.forumQuoteTemplate = $("#forumQuoteTemplate").value;
	chrome.storage.sync.set({"settings": settings}, function(){
		$("#save").innerHTML = "Saved!";
		$("#save").classList.remove("active");
		$("body").style.pointerEvents = "initial";
	});
	$("#save").innerHTML = "Saving...";
	$("body").style.pointerEvents = "none";
}