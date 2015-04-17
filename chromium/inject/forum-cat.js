chrome.storage.sync.get("settings", function(i){
	userSett = i.settings ? i.settings : defaultSettings; 
	for (var sett in defaultSettings) {
		if(!userSett.hasOwnProperty(sett)) userSett[sett] = defaultSettings[sett]; 
	};
	settings = userSett;

	Array.prototype.forEach.call($$(".stickybox_1, .stickybox_2, .topicbox_1, .topicbox_2"), function(el){
		if(settings.forumLastPageButton && el.querySelector('br')){
			var lastPage = el.getElementsByTagName('A')[0].href;
			lastPage += "&page=last";
			el.getElementsByTagName('BR')[0].insertAdjacentHTML("beforeBegin", " <a href='"+lastPage+"' style='font-size:10px'>[last page]</a>");
		}
	});
});