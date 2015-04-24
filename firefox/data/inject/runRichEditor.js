if(settings.forumRichTextEditor){
	if($("textarea[name=message]"))
		$("textarea[name=message]").classList.add("ckeditor");

	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', self.options.resourceURI["ckeditor"]);
	$("body").appendChild(s);
}