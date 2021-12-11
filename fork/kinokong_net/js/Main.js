var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();
var currentFSMode = 2; 
var maxFSMode = 3;
var currentStatusLineText="";

var CategoryElement_set = [];
var CategoryElement_word = [];
var CategoryElement_url = [];

showHandler = function() {
	document.getElementById('pluginObjectNNavi').SetBannerState(1);
	pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
	pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
	pluginAPI.unregistKey(tvKey.KEY_MUTE);
	pluginAPI.setOffScreenSaver();
};
var Main = {
	version_vidget : "2.0",
	mode : 0, 
	WINDOW : 0,
	FULLSCREEN : 1,

	sURL : "", 
	index : 1, 
	smeh : 8, 
	page : 1, 

	listRowsPerPage : 21,
	playlist : 0,
	sta : 0, 

	prefixURL : "http://kinokong.net",
	janrURL : "http://kinokong.net/",
	janrText : "Фильмы",
	search : false, 
	resMore: false,
	perPage : 21,
	
	TVPlugin : 0,
	Audio : 0,
	hardware : 0,
	hardware_type : 0,
	serieC : false,
	serieE : false,
	serieB : false,
	
	sort: 0,
	topMenu : {},
	menu : false,
	menuIndex : 1,
	Category_Settings : 1,
	
	
};

var b = 1; 
var c = 1; 
var url = ""; 

Main.onLoad = function() {
	window.onShow =  showHandler; 
	this.TVPlugin = document.getElementById("pluginTV");
	this.hardware_type = this.TVPlugin.GetProductType();
	this.hardware = this.TVPlugin.GetProductCode(1);
	this.hardware_char=this.hardware.substring(4,5);

	if (Player.init() && Audio.init() && Display.init()) {
		widgetAPI.sendReadyEvent();
		
		$("#main").show();
		$("#anchor").focus();
		$("#playlist").hide();
		$("#plain").hide();
		$("#black").hide();
		$("#search").hide();
		$(".window input").removeClass('plainText');
		Main.contentlist();
		
		Main.NewJanr(this.prefixURL+CategoryElement_url[Main.Category_Settings]);
		Display.help_line_1();
	
	}
};
Main.onUnload = function() {
	Player.deinit();
	URLtoXML.deinit();
};
Main.keyDown = function() {
	var keyCode = event.keyCode;

	switch (keyCode) {
	case tvKey.KEY_EXIT:
		widgetAPI.blockNavigation(event); 
		
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN){
			Player.stopVideo();
			Main.setWindowMode();			
		}else{
			widgetAPI.sendReturnEvent();
		}
		
		break;
	case tvKey.KEY_TOOLS: 
		if (this.playlist == 0 && !this.menu){
			$("#title").hide();
			$("#janr").hide();
			$("#search").show();
			$("#plain").show();
			$("#black").show();
			$("#help_line_3").show();
			if (Main.hardware_char =='D'){
				$('#chlist_search').remove();
			}
			$(".window input").removeClass('plainText');
			$("#plainText").addClass('plainText');
			
			this.page = 1;
			
			if (this.customKeyb) {
				if (!Keyboard.run) {
					Keyboard.callback = Search.onEnter;
					Keyboard.cyr = true;
					Keyboard.show();
				} else {
					Keyboard.callback(Keyboard.str);
				}
			} else {
				Search.Input();
			}
		};

		break;
		
	case tvKey.KEY_1:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(1);
		if (this.playlist == 0)
			Main.selectCategory(1);
		break;
	case tvKey.KEY_2:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(2);
		if (this.playlist == 0)
			Main.selectCategory(2);
		break;
	case tvKey.KEY_3:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
		    Player.PercentJump(3);
		if (this.playlist == 0)
			Main.selectCategory(3);
		break;
	case tvKey.KEY_4:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(4);
		if (this.playlist == 0)
			Main.selectCategory(4);
		break;
	case tvKey.KEY_5:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(5);
		if (this.playlist == 0)
			Main.selectCategory(5);
		break;
	case tvKey.KEY_6:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(6);
		if (this.playlist == 0)
			Main.selectCategory(6);
		break;
	case tvKey.KEY_7:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(7);
		if (this.playlist == 0)
			Main.selectCategory(7);
		break;
	case tvKey.KEY_8:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(8);
		if (this.playlist == 0)
			Main.selectCategory(8);
		break;
	case tvKey.KEY_9:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
			Player.PercentJump(9);
		if (this.playlist == 0)
			Main.selectCategory(9);
		break;
	case tvKey.KEY_0:
		if (this.playlist == 0)
			Main.selectCategory(0);
		break;
	case tvKey.KEY_CH_DOWN:
		if (this.playlist == 0)
			
		break;
	case tvKey.KEY_CH_UP:
		if (this.playlist == 0)
			
		break;
	case tvKey.KEY_PRECH:
		if (this.playlist == 0)
			
		break;
	case tvKey.KEY_RED:
		if (this.playlist == 0)
			Main.focusMenu();
		break;
	case tvKey.KEY_INFO:
		if (this.mode==this.FULLSCREEN){
			Display.showplayer();
			Display.statusLine (currentStatusLineText);
		}
		break;
		
	case tvKey.KEY_GREEN:
		if (this.playlist == 0)
			Favorites.open();
		break;
		
	case tvKey.KEY_YELLOW:
		if (Favorites.isVisible){
			Favorites.del();
		}else{
			if (this.playlist>0)
				Favorites.add();
		}
		
		break;
		
	case tvKey.KEY_BLUE: 
		    if (this.mode == this.WINDOW) { 
    			break;
    		} else {
			    currentFSMode = (currentFSMode < maxFSMode) ? currentFSMode + 1 : 1;
			    Player.setScreenMode(currentFSMode);
    		}
		
		break;
		
	case tvKey.KEY_ASPECT: 
		if (this.mode == this.WINDOW) {
			break;
		}
		else{
			currentFSMode = (currentFSMode < maxFSMode) ? currentFSMode + 1 : 1;
			Player.setScreenMode(currentFSMode);
			break;
		}

	case tvKey.KEY_STOP:
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN){
			Player.stopVideo();
			Main.setWindowMode();
		}
		break;

	case tvKey.KEY_PAUSE:
		if (Player.getState() == Player.PLAYING)
			this.handlePauseKey();
		break;

	case tvKey.KEY_PLAY:
		if (Player.getState() != Player.PLAYING && this.mode == this.FULLSCREEN){
			Main.handlePlayKey(url);
			this.sta = 1;
		}
		break;
	case tvKey.KEY_FF:
		if(Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipForwardVideo(30);
		}
		break;
	case tvKey.KEY_RW:
		if(Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipBackwardVideo(30);
		}
		break;

	case tvKey.KEY_RETURN:
	case tvKey.KEY_PANEL_RETURN:
		widgetAPI.blockNavigation(event); 
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
		{
			Player.stopVideo();
			Main.setWindowMode();
			break;
		};
			if(this.menu){
			Main.blurMenu();
			break;
		}	
		this.playlist=0;
		if(this.playlist==0){
			if(document.getElementById("spisok").style.display == "block"){
				if (Favorites.isVisible || this.search){
					this.search = false;
					Favorites.isVisible = false;
					Main.selectCategory(Main.Category_Settings);	
				}
			}
			//widgetAPI.blockNavigation(event);
			document.getElementById("spisok").style.display = "block";
			document.getElementById("playlist").style.display = "none";
			if (Favorites.isVisible){
				Display.help_line_4();
			} else {
				if (this.search){
					Display.help_line_5();
				} else {
					Display.help_line_1();
				}
			}			
		} 
		break;

	case tvKey.KEY_LEFT:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN){
			Player.skipBackwardVideo(120);
		}else{
			if (this.playlist == 0 && this.index>0) {
				if (this.index == 1) {
					this.smeh = Main.NewString(0, -1) ? (this.resMore?23:23) : 0;
					this.index = 1;
					Main.ActivString(this.smeh);
				}else{
					Main.ActivString(-1);
				}
			}else if ((this.playlist == 1) && this.index>0) {
				Main.selectUpPageVideo();
			}
		}
		break;

	case tvKey.KEY_RIGHT:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipForwardVideo(120);
		}else{
			if (this.playlist == 0 && this.index<URLtoXML.ImgDickr.length) {
				if (this.index == (this.resMore?24:24)) {
					this.index = 1;
					Main.NewString(0, 1);
					Main.ActivString(0);
				}else if (this.index<URLtoXML.ImgDickr.length-1) {
					Main.ActivString(1);
				}
			}else if (this.playlist == 1) {
				Main.selectNextPageVideo();
			}
			break;
		}

	case tvKey.KEY_UP:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			break;
		}
		if (this.menu) {
			Main.selectMenuItem('next');
		}
		if (this.playlist == 0 && !this.menu) {
			this.smeh = this.resMore?-8:-8;
			if (this.index>0 && this.index<=(this.resMore?8:8)) {
				Main.NewString(this.resMore?16:16, -1);
			}
			Main.ActivString(this.smeh);
		} else if (this.playlist == 1) {
			Main.selectUpVideo();
		}
		break;

	case tvKey.KEY_DOWN:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			break;
		}
		if (this.menu) {
			Main.selectMenuItem('prev');
		}
		if (this.playlist == 0 && !this.menu) {
			this.smeh = this.resMore?8:8;
			if (this.index>(this.resMore?16:16) && this.index<=(this.resMore?24:24)) {
				Main.NewString((this.resMore?-16:-16), 1);
			}

			if (this.index+this.smeh<URLtoXML.ImgDickr.length && this.index+this.smeh>0)
				Main.ActivString(this.smeh);
		} else if (this.playlist == 1) {

				if (b>=URLtoXML.pUrlSt.length-1) break;
			
			Main.selectNextVideo();
			this.sta = 1; 

		}
		break;

	case tvKey.KEY_ENTER:
	case tvKey.KEY_PANEL_ENTER:

		if (this.playlist == 0) {
			this.playlist = 1;
			Main.handleActiv();
			for ( var h = 1; h <= 200; h++) {
				widgetAPI.putInnerHTML(document.getElementById("str" + h), "");
			}
			URLtoXML.xmlHTTP = null;
			URLtoXML.Proceed(URLtoXML.UrlSt[this.index]);
			document.getElementById("spisok").style.display = "none";
			document.getElementById("playlist").style.display = "block";
			document.getElementById("descript").style.display = "block";
			widgetAPI.putInnerHTML(document.getElementById("description"),
				"<img align='left' style='border-style: solid; border-width:1px; border-color:#3399FF; margin:6px 10px 8px 3px; max-width: 350px; max-height: 350px; border-radius:5px; box-shadow:0 0 13px black;' src='"
					+ URLtoXML.ImgDickr[this.index] + "'/>"
					+ URLtoXML.pDes[this.index]);
		if(this.menu){
			Main.blurMenu();
		break;
		    }						
		}else if (this.playlist == 1) {
			this.sta = 1;
			url = URLtoXML.pUrlSt[b];
			Main.handlePlayKey(url);
		};

		if (Favorites.isVisible){
			Display.help_line_2_1();
		}else{
			Display.help_line_2();
		}
		
		break;
 
	
	default:
		break;

	}
	if (URLtoXML.sName[this.index])
		if (URLtoXML.sName[this.index].length > 180) {
			widgetAPI.putInnerHTML(document.getElementById("title"), URLtoXML.sName[this.index].substr(0, 180) + "...");
		}
		else {
			widgetAPI.putInnerHTML(document.getElementById("title"), URLtoXML.sName[this.index]);
		}
	Main.ListTop();
};
Main.NewString = function(per, a) {
	this.smeh = per; 
	this.page = this.page + a; 
	if (this.page < 0) {
		this.page = 0;
		this.smeh = 0;
		return 0;
	} else if (Favorites.isVisible) {
		return Favorites.changePage();
	}else{
		widgetAPI.putInnerHTML(document.getElementById("title"), "");	
		URLtoXML.xmlHTTP = null;
		if (this.search){
			this.sURL += '/page/' + this.page;
		}else{
			this.sURL = this.janrURL + 'page/' + this.page + '/';
		}
		URLtoXML.Proceed(this.sURL);
		return 1;
	}
};
Main.ActivString = function(smeh) {
	this.smeh = smeh;
	if (document.getElementById("imgst" + this.index))
		document.getElementById("imgst" + this.index).style.borderColor = "#e9e9e9";
	this.index = this.index + this.smeh;
	if (document.getElementById("imgst" + this.index))
		document.getElementById("imgst" + this.index).style.borderColor = "#3399FF";
};

Main.ListTop = function() { 
	document.getElementById("list2").style.top = (-421 * Math.floor((b-1)/this.listRowsPerPage))+"px";
};

Main.handlePauseKey = function() {
	switch (Player.getState()) {
	case Player.PLAYING:
		Player.pauseVideo();
		this.sta = 0;
		break;
	default:
		break;
	}
};

Main.handleActiv = function() {
	document.getElementById("list2").style.top = "0px"; 
	document.getElementById("str" + b).style.color = "#c0c0c0";

	b = 1;
	c = 1;
	document.getElementById("str" + b).style.color = "#3399FF";
};
Main.selectNextVideo = function() {
	if (b < 200) {
		c = b;
		document.getElementById("str" + c).style.color = "#c0c0c0";
		b++;
		document.getElementById("str" + b).style.color = "#3399FF";
		this.sta = 1;
	}
};
Main.selectUpVideo = function(){
	if (b > 1) {
		c = b;
		document.getElementById("str" + c).style.color = "#c0c0c0";
		b--;
		document.getElementById("str" + b).style.color = "#3399FF";
		this.sta = 1;
	} 	
};

Main.selectNextPageVideo = function() {
	if (b < 200) {
		c = b;
		document.getElementById("str" + c).style.color = "#c0c0c0";
		b+=this.listRowsPerPage;
		if (this.playlist == 1){
			if (b>=URLtoXML.pUrlSt.length-1)
				b=URLtoXML.pUrlSt.length-1;
		}

		if (b>200) b=200;
		document.getElementById("str" + b).style.color = "#3399FF";
		this.sta = 1;
	} 
};
Main.selectUpPageVideo = function(){
	if (b > 1) {
		c = b;
		document.getElementById("str" + c).style.color = "#c0c0c0";
		b-=this.listRowsPerPage;
		if (b<1) b=1;
		document.getElementById("str" + b).style.color = "#3399FF";
		this.sta = 1;
	}
};

Main.handlePlayKey = function(url)
{
	if (this.sta == 1) {
		Player.stopVideo();
		url = URLtoXML.pUrlSt[b];
		Player.playVideo(url);
	}
	switch (Player.getState()) {
	case Player.STOPPED:
		Player.playVideo(url);
		break;
	case Player.PAUSED:
		Player.resumeVideo();
		break;
	default:
		break;
	}
	widgetAPI.putInnerHTML(document.getElementById("play_name"),URLtoXML.pName[b]);
	Main.ListTop();
};

Main.NewJanr = function(janr) {
	this.search = false;
	Favorites.isVisible = false;
	
	Main.setMenu();
	Main.clearBlocks();
	
	this.page = 1;
	this.janrURL = janr;
	this.sURL = janr + 'page/' + this.page + '/';
	document.getElementById("janr").style.display = "none";
	URLtoXML.xmlHTTP = null;
	URLtoXML.Proceed(this.sURL);
};
Main.setFullScreenMode = function() {
	if (this.mode != this.FULLSCREEN) {
		document.getElementById("main").style.display = "none";
		this.mode = this.FULLSCREEN;
	}
};

Main.setWindowMode = function() {
	if (this.mode != this.WINDOW) {
		Display.hideplayer();
		Player.setWindow();
		document.getElementById("main").style.display = "block";
		this.mode = this.WINDOW;
	}
};

Main.toggleMode = function() {
	switch (this.mode) {
	case this.WINDOW:
		this.setFullScreenMode();
		break;

	case this.FULLSCREEN:
		this.setWindowMode();
		break;

	default:
		break;
	}
};

Main.setResSimple = function() {
	document.getElementById("spisok2").class = '';
	this.resMore = false;
};

Main.setResMore = function() {
	document.getElementById("spisok2").class = 'moreres';
	this.resMore = true;
};

Main.clearBlocks = function(){
	widgetAPI.putInnerHTML(document.getElementById("title"), '');
	for ( var h = 1; h <= 24; h++) {
		widgetAPI.putInnerHTML(document.getElementById("bloc" + h), "");
	}
	Main.index = 1;
	URLtoXML.ImgDickr = [];
	URLtoXML.UrlSt = [];
	URLtoXML.sName = [];
	URLtoXML.pDes = [];
};

Main.selectCategory = function(catID) 
{
	if(CategoryElement_word[catID] != undefined){
		if (this.playlist == 0) {
			Main.Category_Settings = catID;
			Main.NewJanr(this.prefixURL + CategoryElement_url[Main.Category_Settings], CategoryElement_word[Main.Category_Settings]);
		}

		if(Main.menu){
			Main.focusMenu();
			Main.selectMenu(1);
		}
	}
};
Main.contentlist = function() 
{
	CategoryElement_set = [];
	CategoryElement_word = [];
	CategoryElement_url = [];
    var category = data;
	for (var key in category){
		if (category.hasOwnProperty(key))
		{
			var value = data[key];
			CategoryElement_set[key] = value['chanel'];
			CategoryElement_word[value['chanel']] = value['title'];
			CategoryElement_url[value['chanel']] = value['url'];
		}
	}			
				
				Main.setMenu();
};
Main.focusMenu = function() 
{
	Main.menu = true;
	Main.menuIndex = 1;
	Main.selectMenu(Main.menuIndex);
	$("#spisok").each(function(){
		$(this).removeClass('selected');
	});
};
Main.setMenu = function() 
{
	Main.topMenu = {};
	Main.topMenu['category'] = CategoryElement_word;
	Main.showTopMenu(Main.topMenu);
};

Main.selectMenu = function(index) 
{
	Main.menuIndex = index;
	$("#menu > li").removeClass("active");
	$("#menu_"+index).addClass("active");
	
};
Main.selectMenuItem = function(direction) 
{    
	var menu = $("#menu_"+Main.menuIndex).attr('data');
	switch(menu)
	{			
		case 'category':
			if(direction == 'next'){
				if(CategoryElement_word.length > 0){
					var loop = true;
					while(loop){
						Main.Category_Settings = (Main.Category_Settings < (CategoryElement_word.length - 1)) ? parseInt(Main.Category_Settings) + 1 : 0;
						if(CategoryElement_word[Main.Category_Settings] != undefined){
							loop = false;
							Main.selectCategory(Main.Category_Settings);
						}
					}
				}
			} else {
				if(CategoryElement_word.length > 0){
					var loop = true;
					while(loop){
						Main.Category_Settings = (Main.Category_Settings > 0) ? parseInt(Main.Category_Settings) - 1 : CategoryElement_word.length - 1;
						if(CategoryElement_word[Main.Category_Settings] != undefined){
							loop = false;
							Main.selectCategory(Main.Category_Settings);
						}
					}
				}
			}
			break;
	}
};
Main.blurMenu = function() 
{
	Main.menu = false;
	Main.menuIndex = 1;
	$("#menu > li").removeClass("active");
	$("#bloc" + Main.index).addClass('selected');
};
Main.showTopMenu = function(data)
{  
	var i = 0;	
	$("#menu").empty();	
	$.each(data, function(key,obj) {	
		i++;
		$("#menu").append('<li id="menu_'+i+'" data="'+key+'"></li>');
		
		$.each(obj, function(id,val) {
			if((key == 'category' && Main.Category_Settings == id)){
			   $("#menu_"+i).append('<span>'+val+'</span>');
			   
			}
		});
	});
};
var data = {

			"1" : {
				"chanel" : "1",
				"title"	 : "Cмотреть фильмы онлайн",
				"url"	 : "/films/"
			},
			"2"  : {
				"chanel" : "2",
				"title"	 : "Аниме",
				"url"	 : "/anime/"
			},
			"3" : {
				"chanel" : "3",
				"title"	 : "Сериалы",
				"url"	 : "/serial/"
			},
			"4" : {
				"chanel" : "4",
				"title"	 : "Боевик",
				"url"	 : "/films/boevik/"
			},
			"5" : {
				"chanel" : "5",
				"title"	 : "Военные",
				"url"	 : "/films/voennyy/"
			},
			"6"		 : {
				"chanel" : "6",
				"title"	 : "Вестерн",
				"url"	 : "/films/vestern/"
			},
			"7"	 : {
				"chanel" : "7",
				"title"	 : "Детективы",
				"url"	 : "/films/detektiv/"
			},
			"8"		 : {
				"chanel" : "8",
				"title"	 : "Отечественный",
				"url"	 : "/films/otechestvennyy/"
			},					
			"9" : {
				"chanel" : "9",
				"title"	 : "Драмы",
				"url"	 : "/films/drama/"
			},
			"10"		 : {
				"chanel" : "10",
				"title"	 : "Триллеры",
				"url"	 : "/films/triller/"
			},
			"11"		 : {
				"chanel" : "11",
				"title"	 : "Исторический",
				"url"	 : "/films/istoricheskiy/"
			},
			"12"		 : {
				"chanel" : "12",
				"title"	 : "Фантастика",
				"url"	 : "/films/fantastika/"
			},
			"13"	 : {
				"chanel" : "13",
				"title"	 : "Комедии",
				"url"	 : "/films/komediya/"
			},
			"14"	 : {
				"chanel" : "14",
				"title"	 : "Криминал",
				"url"	 : "/films/kriminal/"
			},
			"15"	 : {
				"chanel" : "15",
				"title"	 : "Мелодрамы",
				"url"	 : "/films/melodrama/"
			},
			"16"	 : {
				"chanel" : "16",
				"title"	 : "Смотреть передачи и тв шоу",
				"url"	 : "/dokumentalnyy/"
			},
			"17"	 : {
				"chanel" : "17",
				"title"	 : "Смотреть HD 720",
				"url"	 : "/films/720p/"
			},
			"18"	 : {
				"chanel" : "18",
				"title"	 : "Приключения",
				"url"	 : "/films/priklyucheniya/"
			},
			"19"	 : {
				"chanel" : "19",
				"title"	 : "Фэнтези",
				"url"	 : "/films/fentezi/"
			},
			"20"	 : {
				"chanel" : "20",
				"title"	 : "Смотреть новинки",
				"url"	 : "/films/novinki/"
			},
			"21"	 : {
				"chanel" : "21",
				"title"	 : "Семейные фильмы",
				"url"	 : "/films/semeynyy/"
			},
			"22"	 : {
				"chanel" : "22",
				"title"	 : "Ужасы",
				"url"	 : "/films/uzhasy/"
			},
			"23"	 : {
				"chanel" : "0",
				"title"	 : "Мультфильмы",
				"url"	 : "/multfilm/"
			}
			
};
