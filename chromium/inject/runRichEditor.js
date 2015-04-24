chrome.storage.sync.get("settings", function(i){
	userSett = i.settings ? i.settings : defaultSettings; 
	for (var sett in defaultSettings) {
		if(!userSett.hasOwnProperty(sett)) userSett[sett] = defaultSettings[sett]; 
	};
	settings = userSett;

	if(settings.forumRichTextEditor){
		if($("textarea[name=message]"))
			$("textarea[name=message]").classList.add("ckeditor");

		var s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('src', chrome.extension.getURL("inject/ckeditor/ckeditor.js"));
		$("body").appendChild(s);
	}
});