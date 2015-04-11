chrome.storage.sync.get("settings", function(i){
	userSett = i.settings ? i.settings : defaultSettings; 
	for (var sett in defaultSettings) {
		if(!userSett.hasOwnProperty(sett)) userSett[sett] = defaultSettings[sett]; 
	};
	settings = userSett;

	if(settings.forumReplyButton)
		Array.prototype.forEach.call(document.querySelectorAll(".commentbox_1, .commentbox_2"), function(el){
			var usrName = el.querySelector("a[href^='../members/view_profile.php?user=']").innerHTML,
				replyButton = document.createElement("a");

			if(!el.querySelector(".edit_options"))
				el.insertAdjacentHTML("afterbegin", "<span class='edit_options'></span>");

			replyButton.innerHTML = "Reply";
			replyButton.href = "javascript:void(0)";
			replyButton.onclick = function(){
				$("textarea[name=message]").value += "[color=#00f]@"+ usrName + "[/color] ";
				$("textarea[name=message]").focus();
			}

			el.querySelector(".edit_options").insertBefore(replyButton, el.querySelector(".edit_options").firstChild);
			if(el.querySelector(".edit_options").children[1])
				replyButton.insertAdjacentHTML("afterend", " ");
		});
});