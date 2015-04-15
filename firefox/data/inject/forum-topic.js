var HTMLToBBCode = {
	"(^<hr>|<hr>$)": "",
	"\n": "",
	"<br><br><center><div class=\"edit_warning\">(.*?)</div></center>": "", // get rid of the edit warning
	"<br>": "\n",
	"<hr>": "[line]",
	"<b>": "[b]",
	"</b>": "[/b]",
	"<center>": "[center]",
	"</center>": "[/center]",
	"<font color=\"(red|orange|green|lime|blue|violet|pink|black|white)\">(.*?)<\/font>": function($0, $1, $2){ return "["+$1+"]"+$2+"[/"+$1+"]"; },
	"<img(?: class=\"user_image\"|) src=\"(.*)\">": function($0, $1){ return "[img]"+$1+"[/img]"; },
	"<a href=\"(.*?)\" target=\"_blank\">(.*?)</a>": function($0, $1, $2){ return "[link="+$1+"]"+$2+"[/link]"; },
	"<(?:.|\n)*?>": "" // dispose of unconverted tags
};

function convertHTMLToBBCode(html){
	for(exp in HTMLToBBCode){
		var regex = new RegExp(exp, 'gmi');
		html = html.replace(regex, HTMLToBBCode[exp]);
	}
	return html;
}
if($("textarea[name=message]"))
	Array.prototype.forEach.call(document.querySelectorAll(".commentbox_1, .commentbox_2"), function(el){
		if(!el.querySelector(".edit_options"))
				el.insertAdjacentHTML("afterbegin", "<span class='edit_options'></span>");

		if(settings.forumReplyButton){
			var usrName = el.querySelector("a[href^='../members/view_profile.php?user=']").innerHTML,
				replyButton = document.createElement("a");

			replyButton.innerHTML = "Reply";
			replyButton.href = "javascript:void(0)";
			replyButton.onclick = function(){
				$("textarea[name=message]").value += "[blue]@"+usrName+"[/blue] ";
				$("textarea[name=message]").focus();
			}

			el.querySelector(".edit_options").insertBefore(replyButton, el.querySelector(".edit_options").firstChild);
			if(el.querySelector(".edit_options").children[1])
				replyButton.insertAdjacentHTML("afterend", " ");
		}

		if(settings.forumQuoteButton){
			var usrName = el.querySelector("a[href^='../members/view_profile.php?user=']").innerHTML,
				quote = convertHTMLToBBCode(el.innerHTML.match(/<hr>((.|\n)*)<hr>/)[1]),
				quoteButton = document.createElement("a"),
				forumQuote = settings.forumQuoteTemplate.replace(/%USERNAME%/i, usrName).replace(/%QUOTE%/i, quote);

			quoteButton.innerHTML = "Quote";
			quoteButton.href = "javascript:void(0)";
			quoteButton.onclick = function(){
				$("textarea[name=message]").value += forumQuote;
				$("textarea[name=message]").focus();
			}

			el.querySelector(".edit_options").insertBefore(quoteButton, el.querySelector(".edit_options").firstChild);
			if(el.querySelector(".edit_options").children[1])
				quoteButton.insertAdjacentHTML("afterend", " ");
		}
	});