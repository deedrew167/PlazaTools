if($("#whi"))
	$("#whi").addEventListener("keydown", function(e) {
		if (e.keyCode == 13 && $("#whi").value.trim() != "") { $("input[style='width: 15px;']").click(); }
	}, false);