var	chatrooms = {
		"v3original": 0,
		"v3red": 0,
		"v3yellow": 0,
		"v3green": 0,
		"v3purple": 0,
		"v3rp": 0
	},
	tabChatrooms = [],
	soundPlayer = document.createElement('audio');

	soundPlayer.src = "assets/notif.ogg";
	soundPlayer.preload = "auto";

function createNotification(title, content, icon, timeout, details) {
	var notifId = encodeURIComponent("pt_" + details.toString());

	window["replyDetails_"+notifId] = {replyTo: details.messageSender, chatroom: details.cr};

	self.port.emit("showNotif", {title: title, text: content, iconURL: icon, data: JSON.stringify(details), onClick: function(data){
		data = JSON.parse(data);
		for(var tab in tabs){
			if(tab.url.match(/http:\/\/pc.3dsplaza.com\/chat3\/chat.php?room=(.*)/)){
				//self.emit("activateTab", tab);
				tab.activate();
			}else{
				//self.emit("openTab", "http://pc.3dsplaza.com/chat3/chat.php?room=" + data.cr);
				tabs.open("http://pc.3dsplaza.com/chat3/chat.php?room=" + data.cr);
			}
		}
	}});
			
	if(settings.chatNotifierSound)
		soundPlayer.play();
}

function getAvatar(username, storage, callback) {
	var getProfile = new XMLHttpRequest();
	getProfile.open('GET', 'http://dsi.3dsplaza.com/members/view_profile.php?user='+username, true);
	getProfile.timeout = 10000;

	getProfile.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			var avatarURL = this.response.match(/.png'> <img style='width: 50px; height: 50px; border: 1px solid black;' src='(.*).jpg'>/) ? this.response.match(/.png'> <img style='width: 50px; height: 50px; border: 1px solid black;' src='(.*).jpg'>/)[1] + ".jpg" : "";
			if(this.response.match(/.png'> <img style='width: 50px; height: 50px; border: 1px solid black;' src='default.png'>/)){
				callback(storage, "");
			}else{
				callback(storage, avatarURL);
			}
		} else {
			callback(storage, "");
		}
	};

	getProfile.onerror = function() {
		callback(storage, "");
	};

	getProfile.ontimeout = function() {
		callback(storage, "");
	};

	getProfile.send();
}

function updateChatId(cr){
	var getChat = new XMLHttpRequest();
	getChat.open('GET', 'http://pc.3dsplaza.com/chat3/chatscreen.php?room='+cr, true);
	getChat.timeout = 10000;

	getChat.onload = function() {
		if (this.status >= 200 && this.status < 400){
			chatrooms[cr] = this.response.split('<!--s-->')[0];
			checkChat(cr);
		}else{
			setTimeout(function(){
				updateChatId(cr);
			}, 5000);
		}
	};

	getChat.onerror = function() {
		setTimeout(function(){
			updateChatId(cr);
		}, 5000);
	}

	getChat.ontimeout = function() {
		setTimeout(function(){
			updateChatId(cr);
		}, 5000);
	}

	getChat.send();
}

function checkChat(cr){
	if(chatrooms[cr] == 0)
		return;

	var reloadChat = new XMLHttpRequest();
	reloadChat.open('GET', 'http://pc.3dsplaza.com/chat3/chatscreen.php?room='+cr+'&t='+Math.random()+'&id='+chatrooms[cr], true);
	reloadChat.timeout = 10000;

	reloadChat.onload = function(){
		if (this.status >= 200 && this.status < 400){
			if(this.response.split('<!--s-->')[1] == '')
				return;

			chatrooms[cr] = this.response.split('<!--s-->')[0];
			var messages = this.response.split("<!--d-->").reverse();

			messageLoop:
			for(var m in messages){
				var message = messages[m].match(/<\/b><\/span> (.*)<!---cmid:/) ? messages[m].match(/<\/b><\/span> (.*)<!---cmid:/)[1] : "",
					messageSender = (
						messages[m].match(/<u>(.*) as (.*):<\/u>/) ?
						messages[m].match(/<u>(.*) as (.*):<\/u>/)[1] :
						messages[m].match(/<u>(.*):<\/u>/) ?
						messages[m].match(/<u>(.*):<\/u>/)[1] :
						"[Someone]"
					).replace(/<(?:.|\n)*?>/gm, '').trim();

				// normalize message
				for(var cat in emoticons){
					for(var emo in emoticons[cat]){
						var emoRegex = new RegExp(RegExp.escape(emoticons[cat][emo].html), 'g');
						message = message.replace(emoRegex, emoticons[cat][emo].name);
					}
				}

				var decoder = document.createElement("textarea");

				decoder.innerHTML = message.replace(/<(?:.|\n)*?>/gm, '').trim();
				message = decoder.value;

				for(var n in settings.chatNotifierWhiteList){
					if(settings.chatNotifierWhiteList[n] == "")
						continue;

					var messageRegex = new RegExp(RegExp.escape(settings.chatNotifierWhiteList[n]), 'i');
					if(message.match(messageRegex)){
						getAvatar(messageSender, {message: message, messageSender: messageSender, cr: cr}, function(storage, avatar){
							createNotification(storage.messageSender +" mentioned you in Chatroom "+chatroomNames[storage.cr]+"!", storage.message, avatar, settings.chatNotifierTimeout, storage);
						});
						continue messageLoop;
					}
				}

				if(messages[m].match(/<span style="font-size: 75%; background-color: cyan; opacity: 0.75; color: blue;">to you<\/span>/)){
					getAvatar(messageSender, {message: message, messageSender: messageSender, cr: cr}, function(storage, avatar){
						createNotification(storage.messageSender +" whispered to you in Chatroom "+chatroomNames[storage.cr]+"!", storage.message.replace(/(to you)$/, ''), avatar, settings.chatNotifierTimeout, storage);
					});
				}
			}
		}
	};

	reloadChat.onloadend = function() {
		var lastId = chatrooms[cr],
			interval = tabChatrooms.indexOf(cr) == -1 ? settings.chatNotifierInterval : 7.5;

		if(typeof window["checkChatInt_" + cr] != "undefined")
			clearTimeout(window["checkChatInt_" + cr]);

		window["checkChatInt_" + cr] = setTimeout(function(){
			if(lastId == chatrooms[cr])
				checkChat(cr);
		}, interval * 1000);
	};

	reloadChat.send();
}

function onSettingsChange(){
	for(var cr in chatrooms){
		if(!settings.chatNotifier || settings.chatNotifierChatrooms.indexOf(cr) == -1 && tabChatrooms.indexOf(cr) == -1){ // if the looped chat isn't on the settings and tabs
			chatrooms[cr] = 0;
			continue;
		}

		if(chatrooms[cr] == 0){
			updateChatId(cr);
		}else{
			checkChat(cr);
		}
	}
}


// initialization
tabs = self.options.tabs;

for(var tab in tabs){
	if(tabs[tab].url.match(/http:\/\/pc.3dsplaza.com\/chat3\/(.*)chat.php?room=(.*)/))
		tabChatrooms.push(tabs[tab].url.match(/room=(.*)/)[1]);
}

for(var cr in chatrooms){
	if(!settings.chatNotifier)
		break;

	if(settings.chatNotifierChatrooms.indexOf(cr) == -1 && tabChatrooms.indexOf(cr) == -1)
		continue;

	updateChatId(cr);
}
/* chrome feature that wouldn't work on firefox, might work on it later
self.port.on("tabOpen", function(tabs) {
	window.tabs = tabs;
	tabChatrooms = [];
	for(var tab in tabs){
		if(tabs[tab].url.match(/http:\/\/pc.3dsplaza.com\/chat3\/(.*)chat.php?room=(.*)/)){
			tabChatrooms.push(tabs[tab].url.match(/room=(.*)/)[1]);
		}
	}
	onSettingsChange();
});
*/