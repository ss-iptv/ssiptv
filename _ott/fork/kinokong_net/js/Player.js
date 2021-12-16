var ScreenWidth = 960;
var ScreenHeight = 540;

var VideoWidth = 0;
var VideoHeight = 0;
var VideoDuration = 0;
var modeName="";


var Player = {
	plugin : null,
	state : -1,
	stopCallback : null,

	STOPPED : 0,
	PLAYING : 1,
	PAUSED : 2,
	FORWARD : 3,
	REWIND : 4,
	duration : 0,
    current_time : 0,
};

Player.init = function() {
	var success = true;
	this.state = this.STOPPED;
	Player.pluginScreen = document.getElementById("pluginScreen");

		Player.plugin = document.getElementById("pluginPlayer");
		
        if (!Player.plugin ){
        	Player.setWindow();
            success = false;
        }
		
		Player.plugin.OnCurrentPlayTime = 'Player.setCurTime';
		Player.plugin.OnStreamInfoReady = 'Player.OnStreamInfoReady';
		Player.plugin.OnBufferingStart = 'Player.onBufferingStart';
		Player.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
		Player.plugin.OnBufferingComplete = 'Player.onBufferingComplete';
	
	return success;
};

Player.deinit = function()
{
	if (Player.plugin) {
			Player.plugin.Stop();

	}
};

Player.setScreenMode = function(modesize) {
	if (VideoWidth <= 0 || VideoHeight <= 0) {return -1;}
	
	var wCorr = VideoWidth < (VideoHeight * 4 / 3) ? VideoHeight * 4 / 3 : VideoWidth ;
	
	var crop = {
		x : 0,
		y : 0,
		w : VideoWidth ,
		h : VideoHeight
	};
	
	var disp = {
		x : 0,
		y : 0,
		w : ScreenWidth,
		h : ScreenHeight
	};
 
   
	switch (modesize) {
	case 1:
		if ( VideoWidth/VideoHeight < 16/9 ) {
			modeName="FullScreen 4x3";
			var h1 = wCorr * 9 / 16;
			crop = {
				x : 0,
				y : parseInt( (VideoHeight - h1) / 2),
				w : VideoWidth ,
				h : parseInt(h1)
			};
		} else {
			modeName="FullScreen 16x9";
			var w1 = VideoHeight * 16 / 9;
			crop = {
				x : parseInt( (VideoWidth - w1) / 2),
				y : 0,
				w : parseInt(w1),
				h : VideoHeight
			};
		}
		break;
	case 2:
		if (VideoWidth/VideoHeight < 16/9 ) {
			modeName="Original 4x3";
			var h1 = ScreenHeight;
			var w1 = h1 * wCorr / VideoHeight;
			var x = (ScreenWidth - w1) / 2;
			if (x < 0)
				x = 0;
			disp = {
				x : parseInt(x),
				y : 0,
				w : parseInt(w1),
				h : parseInt(h1)
			};
		} else {
			modeName="Original 16x9";
			var w1 = ScreenWidth;
			var h1 = w1 * VideoHeight / VideoWidth;
			var y = (ScreenHeight - h1) / 2;
			if (y < 0)
				y = 0;
			disp = {
				x : 0,
				y : parseInt(y),
				w : parseInt(w1),
				h : parseInt(h1)
			};
		}
		;
		break;
	case 3:
		modeName="FullScreen 14x9";
		crop = {
			x : 0,
			y : parseInt(0.0625 * VideoHeight),
			w : VideoWidth ,
			h : parseInt(0.875 * VideoHeight)
		};
		break;
	default:
		break;
}

		Player.plugin.SetCropArea(crop.x, crop.y, crop.w, crop.h);
		Player.plugin.SetDisplayArea(disp.x, disp.y, disp.w, disp.h);
		
	currentStatusLineText = modeName + " (" + crop.w + "x" + crop.h + ")";
	widgetAPI.putInnerHTML(document.getElementById("player_info"), currentStatusLineText);
	Display.showplayer();
	if (this.state == this.PAUSED) {
			Player.plugin.Pause();
	}
};

Player.playVideo = function() 
{
	pluginAPI.unregistKey(tvKey.KEY_TOOLS);
	this.state = this.PLAYING;
	Main.setFullScreenMode();
	this.plugin.Play(url);

};

Player.setWindow = function() 
{

		Player.plugin.SetDisplayArea(0, 0, 0, 0);
	
};

Player.setFullscreen = function()
{

		Player.plugin.SetDisplayArea(0, 0, ScreenWidth, ScreenHeight);	
	
};

Player.pauseVideo = function() 
{
	this.state = this.PAUSED;
	this.plugin.Pause();
	Display.showplayer();
	document.getElementById("but_pause").style.display="block";
	document.getElementById("but_play").style.display="none";
};

Player.stopVideo = function()
{
	if (this.state != this.STOPPED) {
		pluginAPI.registKey(tvKey.KEY_TOOLS);
		
		this.plugin.Stop();
		this.state = this.STOPPED;
		if (this.stopCallback) {
			
		}

	}
};

Player.resumeVideo = function() 
{
	this.state = this.PLAYING;
	this.plugin.Resume();
    Display.showplayer();
	document.getElementById("but_pause").style.display="none";
	document.getElementById("but_play").style.display="block";
};

Player.getState = function() 
{
	return this.state;
};

Player.skipForwardVideo = function(time) {
	this.skipState = this.FORWARD;

		Player.plugin.JumpForward(time);
	
	Display.showplayer();
};

Player.skipBackwardVideo = function(time) {
	this.skipState = this.REWIND;

		Player.plugin.JumpBackward(time);
	
	Display.showplayer();
};

Player.PercentJump = function(percent) {
	this.statusmessage = percent*10 + "%";
	var jump_to_minutes = Math.round((VideoDuration*percent/10));
	jump_to_minutes = jump_to_minutes - this.current_time;
	jump_to_minutes = jump_to_minutes / 1000;
		if (jump_to_minutes > 0) Player.plugin.JumpForward(jump_to_minutes);
		if (jump_to_minutes < 0) Player.plugin.JumpBackward(jump_to_minutes*-1);
	
	widgetAPI.putInnerHTML(Display.statusDiv,(this.statusmessage));
	Display.showplayer();
};

Player.PercentJumpForward = function(percent) {
	this.statusmessage = percent + "%";
	var jump_to_minutes = Math.round((VideoDuration*percent/100));
	jump_to_minutes = jump_to_minutes / 1000;

		Player.plugin.JumpForward(jump_to_minutes);
	
	widgetAPI.putInnerHTML(Display.statusDiv,(this.statusmessage));
	Display.showplayer();
};

Player.PercentJumpBackward = function(percent) {
	this.statusmessage = "-" + percent + "%";
	var jump_to_minutes = Math.round((VideoDuration*percent/100));
	jump_to_minutes = jump_to_minutes / 1000;
		Player.plugin.JumpBackward(jump_to_minutes);
	
	widgetAPI.putInnerHTML(Display.statusDiv,(this.statusmessage));
	Display.showplayer();
};

Player.JumpToTime = function(time) {
	var jump_to_minutes = time / 1000;
		Player.plugin.JumpForward(jump_to_minutes);
	
	Display.showplayer();
};

Player.setCurTime = function(time) {
	this.current_time = time;
	Display.setTime(time);
};

Player.onBufferingComplete = function() 
{
   alert("onBufferingComplete");
};   

Player.onBufferingProgress = function(percent)
{
	Display.statusLine ("Buffering "+percent+"%");

};

Player.onBufferingStart =function()
{
	alert ("buffering start");
};

Player.OnStreamInfoReady = function() {
	alert("OnStreamInfoReady");
	VideoDuration = Player.plugin.GetDuration();
	VideoWidth = Player.plugin.GetVideoWidth();
	VideoHeight = Player.plugin.GetVideoHeight();
	Display.setTotalTime(VideoDuration);
	Player.setScreenMode (currentFSMode);
};
