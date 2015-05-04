Array.prototype.forEach.call($$(".stickybox_1, .stickybox_2, .topicbox_1, .topicbox_2"), function(el){
	var ptsCount = el.innerHTML.match(/<\/a> \(([0-9]+)\)/) ? el.innerHTML.match(/<\/a> \(([0-9]+)\)/)[1] : 16;
	if(settings.forumLastPageButton && el.querySelector('br') && ptsCount > 15){
		var lastPage = el.getElementsByTagName('A')[0].href;
		lastPage += "&page=last";
		el.getElementsByTagName('BR')[0].insertAdjacentHTML("beforeBegin", " <a href='"+lastPage+"' style='font-size:10px'>[last page]</a>");
	}
});