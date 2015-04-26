/* 
	This plugin is a part of PlazaTools which can be found at http://ermansay.in/services/plazatools
	(c) 2015 Erman Sayın
	http://ermansay.in
*/

CKEDITOR.plugins.add('plazatools', {
	icons: 'smh,greentext,highlight,youtube',
	init: function(editor) {
		// styles
		var styles = {
			greentext: new CKEDITOR.style({
				element: 'span',
				styles: {color: 'green'} 
			}),
			highlight: new CKEDITOR.style({
				element: 'span',
				styles: {"background-color": '#FFFF00'} 
			})
		};

		// dialogs
		CKEDITOR.dialog.add('ytDialog', this.path + 'dialogs/yt.js' );

		// cmds
		editor.addCommand('smh', {exec: function(editor){
			editor.insertText("smh");
		}});
		editor.addCommand('greentext', {exec: function(editor){
			editor.applyStyle(styles.greentext);
			editor.insertText("> "+ editor.getSelection().getNative());
		}});
		editor.addCommand('highlight', {exec: function(editor){
			editor.applyStyle(styles.highlight);
		}});
		editor.addCommand('youtube', new CKEDITOR.dialogCommand('ytDialog'));

		// btns
		editor.ui.addButton('smh', {
			label: 'smh',
			command: 'smh',
			toolbar: 'insert'
		});
		editor.ui.addButton('greentext', {
			label: 'Insert Greentext',
			command: 'greentext',
			toolbar: 'insert'
		});
		editor.ui.addButton('highlight', {
			label: 'Highlight',
			command: 'highlight',
			toolbar: 'colors'
		});
		editor.ui.addButton('youtube', {
			label: 'Insert YouTube video',
			command: 'youtube',
			toolbar: 'insert'
		});

		// button state handlers

		// highlight
		editor.attachStyleStateChange(styles.highlight, function(state){
			editor.getCommand("highlight").setState(state);
		});
	}
});