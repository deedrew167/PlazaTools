var replyDetails = chrome.extension.getBackgroundPage()["replyDetails_" + location.search.slice(1)],
	chatroomColors = {
		"v3original": "#0FF",
		"v3red": "#F00",
		"v3yellow": "#FF0",
		"v3green": "#0F0",
		"v3purple": "#F0F",
		"v3rp": "#00F"
	},
	chatId = 0;

if(typeof replyDetails == "undefined"){
	$("body").innerHTML = "Sorry, an error has occured. Please try again later.";
	throw new Error("Couldn't get variable from background page.");
}

$("body").style.backgroundColor = chatroomColors[replyDetails.chatroom];
document.title = "PlazaTools - Replying to " + replyDetails.replyTo;
$("#chatScreen").innerHTML = "Loading, please wait...";
$("#messageInput").value = "@" + replyDetails.replyTo + " ";
$("#messageInput").focus();
$("#messageForm").addEventListener("submit", function(e){
	e.preventDefault();
	sendMessage();
});

function reloadChat(){
	var getChat = new XMLHttpRequest();
	getChat.open("GET", "http://pc.3dsplaza.com/chat3/chatscreen.php?room="+replyDetails.chatroom+"&t="+Math.random()+"&id="+chatId, true);
	getChat.timeout = 5000;

	getChat.onload = function(){
		if($("#chatScreen").innerHTML == "Loading, please wait...")
			$("#chatScreen").innerHTML = "";

		chatId = this.response.split('<!--s-->')[0];
		$("#chatScreen").insertAdjacentHTML("afterbegin", getChat.responseText.split('<!--s-->')[1]);
	}

	getChat.send();
}

function sendMessage(){
	if($("#messageInput").value.trim() == "")
		return;

	$("#messageInput").disabled = true;

	var sendToChat = new XMLHttpRequest();
	sendToChat.open("POST", "http://pc.3dsplaza.com/chat3/sender.php?room="+replyDetails.chatroom, true);
	sendToChat.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	sendToChat.timeout = 5000;

	sendToChat.onload = function(){
		$("#messageInput").disabled = false;
		$("#messageInput").value = "@" + replyDetails.replyTo + " ";
		$("#messageInput").focus();
	}

	sendToChat.ontimeout = function(){
		sendMessage();
	}

	sendToChat.onerror = function(){
		sendMessage();
	}

	sendToChat.send("bericht=" + encodeURIComponent($("#messageInput").value));
}

reloadChat();
setInterval(function(){ reloadChat(); }, 7500);