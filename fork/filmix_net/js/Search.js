var Search = {

};
var ime = ''; 
var rezylt = ''; 

Search.Input = function() {
	Display.help_line_3();
	ime = new IMEShell("plainText", Search.imeReady, 'en');
};
Search.imeReady = function(imeObject) {
	ime.setKeypadPos(550, 90); 
	ime.setEnterFunc(Search.onEnter); 
	document.getElementById("plainText").focus();												
	ime.setOnCompleteFunc(Search.SearchOk); 
	ime.setKeyFunc(tvKey.KEY_RETURN, Search.textobjKeyFunc);
															
};
Search.onEnter = function(string) {
	if(string != ''){
		$("#anchor").focus(); 
		Main.search = true;
		Favorites.isVisible = false;
		Main.clearBlocks();
		
		$("#menu").html("");
		$("#menu").append('<li><span>Поиск: '+string+'</span></li>');

		URLtoXML.xmlHTTP = null;
		Main.sURL = Main.prefixURL+"/engine/ajax/search_new.php?do=search&mode=advanced&change_search=0&count_blocks=0&country=0&year_one=0&year_range_ot=0&year_range_do=0&ganrs%5B%5D=0&imdb_ot=0&imdb_do=10&imdbk_ot=0&imdbk_do=10&sortr=none&sortd=all&sort=asc&story=" + string;
		alert(Main.sURL);
		URLtoXML.Proceed(Main.sURL);

		$("#title").show();
		$("#plain").hide();
		$("#search").hide();
		$("#black").hide();
		$("#help_line_3").hide();
        Display.help_line_5();
		if (Main.keybMode == true && Main.customKeyb) {
			Keyboard.hide();
		}
	}
};

Search.textobjKeyFunc = function(keyCode) {
	$("#anchor").focus();
	$("#title").show();
	$("#plain").hide();
	$("#search").hide();
	$("#black").hide();
	$("#help_line_3").hide();
	Display.help_line_1();
	if (Main.keybMode == true && Main.customKeyb) {
		Keyboard.hide();
	}
};
Search.SearchOk = function(arg) { 
	rezylt = arg;
};
