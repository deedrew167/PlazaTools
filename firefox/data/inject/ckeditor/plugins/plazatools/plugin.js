CKEDITOR.plugins.add('plazatools', {
	icons: 'smh,greentext',
	init: function(editor) {
		// cmds
		editor.addCommand('smh', {exec: function(editor){ editor.insertText("smh"); }} );
		editor.addCommand('greentext', {exec: function(editor){
			editor.applyStyle(new CKEDITOR.style({
				element: 'span',
				styles: {color: 'green'} 
		 	}));
		 	editor.insertText("> "+ editor.getSelection().getNative()); 
		}});

		// btns
		editor.ui.addButton( 'smh', {
			label: 'smh',
			command: 'smh',
			toolbar: 'insert'
		});
		editor.ui.addButton( 'greentext', {
			label: 'Insert Greentext',
			command: 'greentext',
			toolbar: 'insert'
		});
	}
});