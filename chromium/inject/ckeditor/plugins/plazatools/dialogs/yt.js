/*
	(c) 2015 Erman Sayın
	http://ermansay.in
*/

CKEDITOR.dialog.add('ytDialog', function ( editor ) {
	return {
		title: 'Insert YouTube video',
		minWidth: 400,
		minHeight: 75,
		contents: [
			{
				id: 'tab-main',
				elements: [
					{
						type: 'text',
						id: 'youtubeURL',
						label: 'YouTube video link',
						validate: CKEDITOR.dialog.validate.regex(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/, "The link you have provided is not a valid YouTube video link.")
					}
				]
			}
		],
		onOk: function() {
			var id = this.getValueOf('tab-main', 'youtubeURL').match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)[1],
				oTag = editor.document.createElement('iframe');
			
			oTag.setAttribute('width', '560');
			oTag.setAttribute('height', '315');
			oTag.setAttribute('src', '//www.youtube.com/embed/' + id + '?rel=0');
			oTag.setAttribute('frameborder', '0');
			oTag.setAttribute('allowfullscreen', '1');
			oTag.setAttribute('data-youtube-id', id);

			editor.insertElement(oTag);
		}
	};
});