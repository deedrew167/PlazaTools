function toggleEmoticonSelector(){
	if($("#ptEmoticonSelector").style.display == "none"){
		$("#ptEmoticonSelector").style.display = "block";
		$("#ptEmoticonSelectorButton").classList.add("active");
	}else{
		$("#ptEmoticonSelector").style.display = "none";
		$("#ptEmoticonSelectorButton").classList.remove("active");
	}
}

chrome.storage.sync.get("settings", function(i){
	userSett = i.settings ? i.settings : defaultSettings; 
	for (var sett in defaultSettings) {
		if(!userSett.hasOwnProperty(sett)) userSett[sett] = defaultSettings[sett]; 
	};
	settings = userSett;

	$("body").insertAdjacentHTML("afterbegin", '<div id="ptEmoticonSelector" style="display:none"></div><div id="ptEmoticonSelectorButton"></div><div id="ptImgurUploadButton"></div><input type="file" id="ptImgurUploadInput">');

	$("#ptEmoticonSelectorButton").addEventListener("click", function() {
		toggleEmoticonSelector();
	});

	// imgur upload thingy

	$("#ptImgurUploadButton").addEventListener("click", function() {
		$("#ptImgurUploadInput").click();
	});

	var upload2Imgur = function(file){
		var fd = new FormData(),
			el = $("#ptImgurUploadInput");

		fd.append("image", file);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://api.imgur.com/3/image.json");
		xhr.setRequestHeader("Authorization", "Client-ID 0609f1f5d0e4a2b");
		xhr.timeout = 60000;
		xhr.onloadend = function() {
			document.getElementById("pt_imgurUploading").remove();
			el.value = '';
			try {
				var resp = JSON.parse(xhr.responseText);
			} catch(e) {
				alert("An error occured while uploading to Imgur.");
				return;
			}

			if(xhr.status != 200 || resp.success == false){
				var err = resp.data ? "\n\"" + resp.data.error + "\"" : "";
				alert("An error occured while uploading to Imgur." + err);
				return;
			}
			var input = $('#plazaplusactive') ? $('#plazaplus' + $('#plazaplusactive').value) : $("#bericht");
			input.value += input.value == "" || input.value.slice(-1) == " " ? resp.data.link : " " + resp.data.link;
			input.focus();
		};

		xhr.ontimeout = function(){
			document.getElementById("pt_imgurUploading").remove();
			el.value = '';
			alert("Upload timed out.");
		};

		xhr.upload.onprogress = function(e) {
			document.getElementById("pt_imgurUploadingBarPercentage").style.width = Math.round(e.loaded/e.total*100) + "%";
		};

		xhr.send(fd);

		document.body.insertAdjacentHTML("afterbegin", "<div id='pt_imgurUploading' style='position:fixed;z-index:99999;width:100%;height:100%;background:rgba(0,0,0,.5);color:#FFFFFF;text-shadow:0 6px rgba(0,0,0,.2);font-family:sans-serif;font-size:72px;display:flex;justify-content:center;align-items:center'>Uploading to imgur..." + 
			"<div id='pt_imgurUploadingBar' style='position:absolute;left:0;right:0;width:40%;height:15px;margin:10px auto;background:#fff;box-shadow:0 5px rgba(0,0,0,.2)'>" +
			"<div id='pt_imgurUploadingBarPercentage' style='width:0;height:15px;background:rgb(68,201,255);transition:width 2s'></div></div>" +
			"<div id='pt_imgurCancelUpload' style='position:absolute;left:0;right:0;width:70px;margin:40px auto;padding:5px;font-size:18px;border:solid 2px;border-radius:5px;text-shadow:none;text-align:center;cursor:pointer'>Cancel</div></div>");

		$("#pt_imgurCancelUpload").addEventListener("click", function(){
			document.getElementById("pt_imgurUploading").remove();
			el.value = '';
			xhr.abort();
		});
	};

	$("#ptImgurUploadInput").addEventListener("change", function() {
		upload2Imgur(this.files[0]);
	});

	document.onpaste = function(e){
		var items = (e.clipboardData  || e.originalEvent.clipboardData).items;
		var blob = null;
		for (var i = 0; i < items.length; i++) {
			if (items[i].type.indexOf("image") === 0) {
				blob = items[i].getAsFile();
			}
		}

		if (blob !== null) {
			var reader = new FileReader();
			reader.onload = function(e) {
				upload2Imgur(reader.result.replace(/^data:image\/(png|jpg);base64,/, ""));
			};
			reader.readAsDataURL(blob);
		}
	}

	for(var cat in emoticons){
		$("#ptEmoticonSelector").innerHTML += "<hr title='"+cat+"'>";

		for(var emo in emoticons[cat])
			$("#ptEmoticonSelector").innerHTML += "<div class='ptEmoticonSelectorEmoticon' data-emoticon='"+emoticons[cat][emo].name+"' style='background-position:"+emoticons[cat][emo].pos+";width:"+emoticons[cat][emo].width+"px;height:"+emoticons[cat][emo].height+"px'></div>";
	}

	Array.prototype.forEach.call(document.querySelectorAll(".ptEmoticonSelectorEmoticon"), function(el){
		el.addEventListener("click", function() {
			// smh plaza+
			var input = $('#plazaplusactive') ? $('#plazaplus' + $('#plazaplusactive').value) : $("#bericht");
			input.value += input.value == "" || input.value.slice(-1) == " " ? el.getAttribute("data-emoticon") : " " + el.getAttribute("data-emoticon");
			input.focus();
		});
	});

	// inject the URL to hyperlink feature with a script tag because chrome won't allow me to change the prototype normally

	// so ghetto huh :/
	$("body").insertAdjacentHTML("afterbegin", '<div id="ptSettings" style="display:none">'+JSON.stringify(settings)+'</div>');
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', chrome.extension.getURL("inject/chat-urltohyperlink.js"));
	$("body").appendChild(s);
});