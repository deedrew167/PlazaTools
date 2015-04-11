var HTMLToBBCode = {
	"(^<hr>|<hr>$)": "",
	"\n": "",
	"<center><div class=\"edit_warning\">(.*?)</div></center>": "", // get rid of the edit warning
	"<br>": "\n",
	"<hr>": "[line]",
	"<b>": "[b]",
	"</b>": "[/b]",
	"<center>": "[center]",
	"</center>": "[/center]",
	"<img(?: class=\"user_image\"|) src=\"(.*)\">": function($0, $1){ return "[img]"+$1+"[/img]"; },
	"<a href=\"(.*?)\" target=\"_blank\">(.*?)</a>": function($0, $1, $2){ return "[link="+$1+"]"+$2+"[/link]"; },
	"<(?:.|\n)*?>": "" // dispose of unconverted tags
}

function convertHTMLToBBCode(html){
	for(exp in HTMLToBBCode){
		var regex = new RegExp(exp, 'gmi');
		html = html.replace(regex, HTMLToBBCode[exp]);
	}
	return html;
}

if(settings.forumReplyButton)
	Array.prototype.forEach.call(document.querySelectorAll(".commentbox_1, .commentbox_2"), function(el){
		var usrName = el.querySelector("a[href^='../members/view_profile.php?user=']").innerHTML,
			quote = convertHTMLToBBCode(el.innerHTML.match(/<hr>((.|\n)*)<hr>/)[1]),
			replyButton = document.createElement("a");

		if(!el.querySelector(".edit_options"))
			el.insertAdjacentHTML("afterbegin", "<span class='edit_options'></span>");

		replyButton.innerHTML = "Reply";
		replyButton.href = "javascript:void(0)";
		replyButton.onclick = function(){
			$("textarea[name=message]").value += "[box=#CCCCCC][blue][b]"+ usrName + "[/blue] said:[/b]\n[i]"+ quote + "[/i][/box]\n";
			$("textarea[name=message]").focus();
		}

		el.querySelector(".edit_options").insertBefore(replyButton, el.querySelector(".edit_options").firstChild);
		if(el.querySelector(".edit_options").children[1])
			replyButton.insertAdjacentHTML("afterend", " ");
	});