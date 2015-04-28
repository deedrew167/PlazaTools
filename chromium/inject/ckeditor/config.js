/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.extraPlugins = 'bbcode,plazatools';
	config.scayt_autoStartup = true;

	config.width = '70%';

	config.toolbarGroups = [
		{name: 'undo'},
		{name: 'basicstyles', groups: ['basicstyles', 'colors', 'cleanup']},
		{name: 'links'},
		{name: 'align'},
		{name: 'insert'},
		{name: 'others'},
		//{name: 'styles'},
		{name: 'mode'},
		{name: 'tools'}
	];

	config.removeButtons = 'Subscript,Superscript,Anchor,BGColor,JustifyLeft,JustifyRight,JustifyBlock';

	//config.format_tags = 'p;h1;h2;h3;pre';

	//config.removeDialogTabs = 'image:advanced;link:advanced';
};