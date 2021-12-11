var server=["http://getlist5.obovse.ru/jsapp/app.js","http://getlist4.obovse.ru/jsapp/app.js","https://rawgit.com/alexkdpu/JS/master/app.js"];
var box_client="ForkPlayerLoader";
var loader_platform="samsung_maple";
var version_client="sForkPlayer2.57m";
var version_local_files=180504;

var ttId;
(function (){
	var tCount=0;
    ttId = setInterval ( function ()  {
    	tCount++;
        if  ((document.readyState ==  "complete"&&tCount>15)||tCount>250) onComplete ();
    },  40 ); 
    function onComplete (){
	    clearInterval (ttId);
		loadstartinfo("Start loader");
	    
		n=40
		for(var i=0;i<=server.length;i++){
			addjs(server[i],n,i);
			n+=20000; //Timeout
		}
		
    }; 
})();

function addjs(u,t,i){
	setTimeout(function(){		
		if(typeof is_vod == "undefined"){
			if(i==server.length) loadstartinfo("Error! Сheck your internet connection");
			else{
				loadstartinfo("Source: "+(i+1)+"...");
				var script   = document.createElement('script');
				script.type  = 'text/javascript';
				script.async = true;
				script.src   = u;
				script.onload =function(){};
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		}
	 }
	,t);
}

function keyHandlerPress(event){
	console.log(event);
	keyHandler(event);
}
document.addEventListener("keydown",keyHandlerPress,true);

var startcmd0="";
function loadstartinfo(s){
	try{
	startcmd0+=s+"<br>";
	document.getElementById("startcmd").innerHTML=startcmd0;
	}
	catch(e){}
}

var widgetAPI = new Common.API.Widget();
var pluginAPI = new Common.API.Plugin();
var tvKey = new Common.API.TVKeyValue();
