var $ = function(e) { return document.querySelector(e); },
	$$ = function(e) { return document.querySelectorAll(e); },
	defaultSettings = {
		"chatNotifier": true,
		"chatNotifierChatrooms": ["v3original"],
		"chatNotifierWhiteList": ["Your username here"],
		"chatNotifierSound": true,
		"chatNotifierWhisper": true,
		"chatNotifierInterval": 60,
		"chatURLToHyperlink": true,
		"chatImgurThumbnail": true,
		"forumReplyButton": true
		"forumReplyTemplate": "[box=#CCCCCC][blue][b]%USERNAME%[/blue] said:[/b]\n[i]%QUOTE%[/i][/box]\n"
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
			{"name": ":ydsay:", "width": 20, "height": 16, "pos": "-19px -94px", "html": '<img src="http://3dsplaza.com/chathnd/buy_youdontsay.png" alt=":ydsay:">'}
		],
		"Other": [
			{"name": "@<3@", "width": 15, "height": 13, "pos": "-61px -114px", "html": '<img src="http://3dsplaza.com/chathnd/icon_bheart.gif" alt="[ !<3! ]">'},
			{"name": ":yoshi:", "width": 16, "height": 16, "pos": "-1px -114px", "html": '<img src="http://3dsplaza.com/chathnd/buy_yoshi.png" alt=":yoshi:">'},
			{"name": ":msonic:", "width": 16, "height": 16, "pos": "-18px -114px", "html": '<img src="http://3dsplaza.com/chathnd/buy_sonic.png" alt=":sonic:">'},
			{"name": ":pball:", "width": 14, "height": 15, "pos": "-35px -114px", "html": '<img src="http://3dsplaza.com/chathnd/buy_pokeball.jpg" alt="(o)pokeball">'},
			{"name": ":file:", "width": 10, "height": 14, "pos": "-50px -114px", "html": '<img src="http://3dsplaza.com/global/chat3/i/icon_file.png" alt="[=]">'},
			{"name": "//to do", "width": 16, "height": 16, "pos": "-77px -114px", "html": '<img src="http://3dsplaza.com/chathnd/icon_todo.png" alt="//to do">'}
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

self.port.on("settingsChange", function(sett) {
	settings = sett;

	if(typeof onSettingsChange !== 'undefined')
		onSettingsChange();
});

var userSett = self.options.userSett ? self.options.userSett : defaultSettings;

for (var sett in defaultSettings) {
	if(!userSett.hasOwnProperty(sett)) userSett[sett] = defaultSettings[sett]; 
};

var settings = userSett;