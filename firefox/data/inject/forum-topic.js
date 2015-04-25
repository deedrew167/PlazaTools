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
if($("textarea[name=message]")){
	var currName = $$(".loginbox_link")[3].href.match(/user=(.*)/)[1];
	Array.prototype.forEach.call(document.querySelectorAll(".commentbox_1, .commentbox_2"), function(el){
		if(!el.querySelector(".edit_options"))
				el.insertAdjacentHTML("afterbegin", "<span class='edit_options'></span>");

		if(settings.forumReplyButton){
			var usrName = el.querySelector("a[href^='../members/view_profile.php?user=']").innerHTML,
				replyButton = document.createElement("a");

			if(settings.forumNoBtnOnMyPosts && usrName == currName){}else{
				replyButton.innerHTML = "Reply";
				replyButton.href = "javascript:void(0)";
				replyButton.setAttribute('onclick',
					"if(typeof CKEDITOR != \"undefined\" && CKEDITOR.instances.message){"+
						"CKEDITOR.instances.message.insertHtml('<span style=\"color:blue\">@"+usrName+" </span>');"+
						"document.getElementById('cke_message').scrollIntoView();"+
						"CKEDITOR.instances.message.focus();"+
					"}else{"+
						"document.querySelector('textarea[name=message]').value += '[blue]@"+usrName+"[/blue] ';"+
						"document.querySelector('textarea[name=message]').focus();"+
					"}"
				);

				el.querySelector(".edit_options").insertBefore(replyButton, el.querySelector(".edit_options").firstChild);
				if(el.querySelector(".edit_options").children[1])
					replyButton.insertAdjacentHTML("afterend", " ");
			}
		}

		if(settings.forumQuoteButton){
			var usrName = el.querySelector("a[href^='../members/view_profile.php?user=']").innerHTML,
				quote = convertHTMLToBBCode(el.innerHTML.match(/<hr>((.|\n)*)<hr>/)[1]),
				quoteButton = document.createElement("a"),
				forumQuote = settings.forumQuoteTemplate.replace(/%USERNAME%/i, usrName).replace(/%QUOTE%/i, quote);

			if(settings.forumNoBtnOnMyPosts && usrName == currName){}else{
				quoteButton.innerHTML = "Quote";
				quoteButton.href = "javascript:void(0)";
				quoteButton.setAttribute('onclick',
					"if(typeof CKEDITOR != \"undefined\" && CKEDITOR.instances.message){"+
						"CKEDITOR.instances.bbcodeconvert.setData("+JSON.stringify(forumQuote)+");"+
						"CKEDITOR.instances.message.insertHtml(CKEDITOR.instances.bbcodeconvert.document.getBody().getHtml()+'<br>');"+
						"document.getElementById('cke_message').scrollIntoView();"+
						"CKEDITOR.instances.message.focus();"+
					"}else{"+
						"document.querySelector('textarea[name=message]').value += "+JSON.stringify(forumQuote)+";"+
						"document.querySelector('textarea[name=message]').focus();"+
					"}"
				);

				el.querySelector(".edit_options").insertBefore(quoteButton, el.querySelector(".edit_options").firstChild);
				if(el.querySelector(".edit_options").children[1])
					quoteButton.insertAdjacentHTML("afterend", " ");
			}
		}
	});

	// create an invisible ckeditor instance to convert BBCode to html to be inserted into the main editor
	$("body").insertAdjacentHTML("beforeEnd", "<textarea class='ckeditor' name='bbcodeconvert' style='display:none'></textarea>");
}