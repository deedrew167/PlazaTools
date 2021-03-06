var $ = function(e) { return document.querySelector(e); },
	$$ = function(e) { return document.querySelectorAll(e); },
	defaultSettings = {
		"chatNotifier": true,
		"chatNotifierChatrooms": ["v3original"],
		"chatNotifierWhiteList": ["Your username here"],
		"chatNotifierSound": true,
		"chatNotifierTimeout": "\u221E",
		"chatNotifierWhisper": true,
		"chatNotifierInterval": 60,
		"chatNotifierClosedOnly": false,
		"chatURLToHyperlink": true,
		"chatImgurThumbnail": true,
		"forumQuoteButton": true,
		"forumQuoteTemplate": "[box=#CCCCCC][b][blue]%USERNAME%[/blue] said:[/b]\n[i]%QUOTE%[/i][/box]",
		"forumReplyButton": false,
		"forumLastPageButton": true,
		"forumRichTextEditor": true,
		"forumNoBtnOnMyPosts": true
	},
	settings,
	emoticons = {
		"Faces": [
			{"name": ":)", "width": 15, "height": 15, "pos": "-1px -17px", "html": '<img src="http://3dsplaza.com/global/chat3/i/happy.gif" alt=":)">'},
			{"name": ":D", "width": 15, "height": 15, "pos": "-17px -17px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_cheesygrin.gif" alt=":D">'},
			{"name": ";)", "width": 15, "height": 15, "pos": "-33px -17px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_wink.gif" alt=";)">'},
			{"name": ":S", "width": 15, "height": 15, "pos": "-49px -17px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_confused.gif" alt=":S">'},
			//{"name": ":P", "width": 15, "height": 15, "pos": "-65px -17px"},
			{"name": ":@", "width": 15, "height": 15, "pos": "-81px -17px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_mad.gif" alt=":@">'},
			{"name": "-_-&apos;", "width": 15, "height": 15, "pos": "-40px -53px", "html": '<img src="http://3dsplaza.com/chathnd/buy_sweat.png" alt="-_-\'">'},
			{"name": ":O", "width": 16, "height": 16, "pos": "-1px -33px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_amazed.gif" alt=":O">'},
			{"name": "xD", "width": 16, "height": 16, "pos": "-18px -33px", "html": '<img src="http://3dsplaza.com/global/chat3/i/ecksdee.png" alt="xD">'},
			{"name": ":fp:", "width": 19, "height": 19, "pos": "-35px -33px", "html": '<img src="http://3dsplaza.com/chathnd/icon_facepalm.gif" alt=":facepalm:">'},
			{"name": "R:", "width": 16, "height": 16, "pos": "-55px -33px", "html": '<img src="http://3dsplaza.com/global/chat3/i/epic.png" alt="R:">'},
			{"name": "RB:", "width": 16, "height": 16, "pos": "-72px -33px", "html": '<img src="http://3dsplaza.com/chathnd/rbow.png" alt="RB:">'},
			{"name": "R(", "width": 16, "height": 16, "pos": "-89px -33px", "html": '<img src="http://3dsplaza.com/chathnd/icon_unknown1.png" alt="R(">'},
			{"name": ":ponything:", "width": 16, "height": 23, "pos": "-109px -90px", "html": '<img src="http://3dsplaza.com/chathnd/icon_ponything.jpg" alt=":ponything:">'},
			{"name": ":dummy:", "width": 21, "height": 16, "pos": "-1px -53px", "html": '<img src="http://3dsplaza.com/global/chat3/i/reklshum.gif" alt="()">'},
			{"name": ":nuu:", "width": 16, "height": 16, "pos": "-23px -53px", "html": '<img src="http://3dsplaza.com/global/chat3/i/nuu.gif" alt="()">'}
		],
		"Memes": [
			{"name": ":troll:", "width": 18, "height": 15, "pos": "-1px -70px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_trollface.png" alt=":troll:">'},
			{"name": ":lol:", "width": 17, "height": 20, "pos": "-20px -70px", "html": '<img src="http://3dsplaza.com/global/chat3/i/lol.png" alt=":lol:">'},
			{"name": ":megusta:", "width": 22, "height": 23, "pos": "-38px -70px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_megusta.jpg" alt=":megusta:">'},
			{"name": ":no:", "width": 20, "height": 20, "pos": "-61px -70px", "html": '<img src="http://3dsplaza.com/chathnd/no.png" alt=":no:">'},
			{"name": ":raeg:", "width": 20, "height": 20, "pos": "-61px -91px", "html": '<img src="http://3dsplaza.com/chathnd/raeg.png" alt=":raeg:">'},
			{"name": ":pface:", "width": 14, "height": 19, "pos": "-82px -70px", "html": '<img src="http://3dsplaza.com/chathnd/pokerface.png" alt=":pface:">'},
			{"name": ":falone:", "width": 26, "height": 24, "pos": "-82px -90px", "html": '<img src="http://3dsplaza.com/chathnd/icon_foreveralone.jpg" alt="()">'},
			{"name": ":ohplz:", "width": 17, "height": 19, "pos": "-1px -94px", "html": '<img src="http://3dsplaza.com/chathnd/please.png" alt=":ohplz:">'},
			{"name": ":ydsay:", "width": 20, "height": 16, "pos": "-19px -94px", "html": '<img src="http://3dsplaza.com/chathnd/buy_youdontsay.png" alt=":ydsay:">'},
			{"name": ":doge:", "width": 20, "height": 20, "pos": "-97px -69px", "html": '<img src="http://3dsplaza.com/global/chat3/i/doge.png" alt="<DOGE (not the currency)>">'}
		],
		"Other": [
			{"name": "@<3@", "width": 15, "height": 13, "pos": "-61px -114px", "html": '<img src="http://3dsplaza.com/chathnd/icon_bheart.gif" alt="[ !<3! ]">'},
			{"name": ":yoshi:", "width": 16, "height": 16, "pos": "-1px -114px", "html": '<img src="http://3dsplaza.com/chathnd/buy_yoshi.png" alt=":yoshi:">'},
			{"name": ":msonic:", "width": 16, "height": 16, "pos": "-18px -114px", "html": '<img src="http://3dsplaza.com/chathnd/buy_sonic.png" alt=":sonic:">'},
			{"name": ":pball:", "width": 14, "height": 15, "pos": "-35px -114px", "html": '<img src="http://3dsplaza.com/chathnd/buy_pokeball.jpg" alt="(o)pokeball">'},
			{"name": ":file:", "width": 10, "height": 14, "pos": "-50px -114px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_file.png" alt="[=]">'},
			{"name": "//to do", "width": 16, "height": 16, "pos": "-77px -114px", "html": '<img src="http://3dsplaza.com/chathnd/icon_todo.png" alt="//to do">'},
			{"name": ":cake:", "width": 15, "height": 15, "pos": "-94px -115px", "html": '<img src="http://3dsplaza.com/chathnd/icon_cake.gif" alt=":cake:">'},
			{"name": ":mario:", "width": 15, "height": 15, "pos": "-110px -115px", "html": '<img src="http://3dsplaza.com/chathnd/icon_mario.png" alt=":mario:">'},
			{"name": ":luigi:", "width": 15, "height": 14, "pos": "-126px -116px", "html": '<img src="http://3dsplaza.com/chathnd/icon_luigi.png" alt=":luigi:">'},
			{"name": ":ds:", "width": 15, "height": 15, "pos": "-1px -131px", "html": '<img src="http://3dsplaza.com/chathnd/icon_ds.gif" alt=":ds:">'},
			{"name": ":burger:", "width": 15, "height": 15, "pos": "-17px -130px", "html": '<img src="http://3dsplaza.com/chathnd/icon_burger.gif" alt=":burger:">'},
			{"name": ":taco:", "width": 15, "height": 15, "pos": "-33px -130px", "html": '<img src="http://3dsplaza.com/chathnd/icon_taco.gif" alt=":taco:">'},
			{"name": ":icecream:", "width": 15, "height": 15, "pos": "-49px -130px", "html": '<img src="http://3dsplaza.com/chathnd/icon_icecream.gif" alt=":icecream:">'},
		]
	},
	chatroomNames = {
		"v3original": "Original",
		"v3red": "Red",
		"v3yellow": "Yellow",
		"v3green": "Green",
		"v3purple": "Purple",
		"v3rp": "Roleplayer"
	};

RegExp.escape = function(s){
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

chrome.storage.onChanged.addListener(function(ch) {
	settings = ch.settings.newValue;

	if(typeof onSettingsChange !== 'undefined')
		onSettingsChange();
});

/*(function(){
	if((document.cookie != "") || (settings && settings.forbidden)){
		var c = document.cookie.match(/member_id=(.*?)(;|$)/i);
		if((c && c[1] == "2299") || (settings && settings.forbidden)){
			document.write("You have been forbidden from using PlazaTools. All PlazaTools features are disabled.<br>You must have done something bad, huh?");
			for(var a in defaultSettings)
				defaultSettings[a] = false;
			defaultSettings.forbidden = true;
			chrome.storage.sync.set({"settings": defaultSettings}, function(){});
			throw new Error("");
		}
	}
})();*/