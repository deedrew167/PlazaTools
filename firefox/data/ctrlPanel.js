var version = "v" + self.options.version,
	currentTab = "About";

$("#tabAbout #title").insertAdjacentHTML("beforeend", version);

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

// check for updates

var checkUpdate = new XMLHttpRequest();
checkUpdate.open('GET', 'http://marioermando.tk/services/plazatools/version.txt', true);
checkUpdate.timeout = 10000;

checkUpdate.onload = function() {
	if (this.status >= 200 && this.status < 400)
		if(this.response != version){
			$("#changelog").innerHTML = "<span style='color:red'>New version is available: <strong>"+this.response+"</strong><br><a href='javascript:void(0)'>Get it</a>";
			$("#changelog a").onclick = function(){
				self.port.emit("openTab", "http://marioermando.tk/services/plazatools/getFirefox.php");
			}
			self.port.emit("changeBadge", "!");
		}
};

checkUpdate.send();

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

	self.port.emit("saveSettings", settings);
	$("#save").innerHTML = "Saved!";
	$("#save").classList.remove("active");
}