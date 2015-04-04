var { ToggleButton } = require('sdk/ui/button/toggle'),
	panels = require("sdk/panel"),
	self = require("sdk/self"),
	tabs = require("sdk/tabs"),
	ss = require("sdk/simple-storage"),
	notifications = require("sdk/notifications"),

	button = ToggleButton({
		id: "plazatools",
		label: "PlazaTools",
		icon: {
			"16": "./assets/icon19.png",
			"32": "./assets/icon38.png"//,
			//"64": "./icon-64.png"
		},
		onChange: handleChange
	}),

	panel = panels.Panel({
		contentScriptOptions: {userSett: ss.storage.settings, version: self.version},
		contentScriptFile: [self.data.url("./global.js"), self.data.url("./ctrlPanel.js")],
		contentURL: self.data.url("./ctrlPanel.html"),
		onHide: handleHide
	}),

	pageWorker = require("sdk/page-worker").Page({
		contentScriptOptions: {userSett: ss.storage.settings, tabs: tabs},
		contentScriptFile: [self.data.url("./global.js"), self.data.url("./background.js")],
		contentURL: self.data.url("./background.html")
	});

function handleChange(state) {
	if (state.checked) {
		panel.show({
			position: button
		});
	}
}

function handleHide() {
	button.state('window', {checked: false});
}
// get settings from panel

panel.port.on("saveSettings", function(sett) {
	ss.storage.settings = sett;
	pageWorker.port.emit("settingsChange", sett);
});

tabs.on('ready', function(tab) {
	chatTabExists = false;
	for(var tab in tabs){
		if(tabs[tab].url.match(/http:\/\/pc.3dsplaza.com\/chat3\/(.*)chat.php?room=(.*)/))
			chatTabExists = true;
	}

	if(chatTabExists)
		pageWorker.port.emit("tabOpen", tabs);
});



pageWorker.port.on("showNotif", function(data) {
	notifications.notify(data);
});