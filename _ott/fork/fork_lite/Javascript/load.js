var widgetAPI = new Common.API.Widget();
var pluginAPI = new Common.API.Plugin();
var tvKey = new Common.API.TVKeyValue();
var server=Array();
var box_client="ForkLmod 3.3JTV";
var timeout, initial, xhr;

function OnLoad() {
	try{
		try{ var hardware=document.getElementById("pluginTV").GetProductCode(1); }
		catch(e){hardware="";}
		
		try{ var mac=document.getElementById("pluginNetwork").GetMAC(1); }
		catch(e){mac="";}
	
		if(hardware==""){
			try{ hardware=document.getElementById("pluginTV").GetProductCode();}
			catch(e){hardware="";}
		}
		if(mac==""){
			try{ mac=document.getElementById("pluginNetwork").GetMAC(); }
			catch(e){mac="";}
		}
	    initial=box_client+"|"+mac+"|"+hardware+"|"+Math.random();
	    server[0]="http://obovse.ru/forklmod/forklmod.php";
	    server[1]="http://filmenter.ru/forklmod.php";
		server[2]="http://forklmod.at.ua/forklmodjtv.js";
		load_script(server[0]);
	}
	catch(e){sendError(e);}
 };

function OnUnLoad() {};
 
function load_script(xml_url)
{
    try
    {
	alert("Now loading "+xml_url);  
    xhr = new XMLHttpRequest();
    xhr.open("GET", xml_url+"?do=start&initial="+initial, true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) 
		{
		clearTimeout(timeout);
		if(xhr.status == 200){
        try {
            var str = xhr.responseText;
			eval(str);
			} catch(e){
				if(xml_url==server[0]) {
				document.getElementById("version").innerHTML=box_client+": Timeout ("+(timeload/1000)+"s) Reserve external load ...";
				load_script(server[1]);		
				}
				if(xml_url==server[1]) {
				document.getElementById("version").innerHTML=box_client+": Timeout ("+(timeload/1000)+"s) Reserve external load 2 ...";
				load_script(server[2]);		
				}
				sendError(e+"|"+xml_url+"|");
			}
		}
		else{
			if(xml_url==server[0]) {
				document.getElementById("version").innerHTML=box_client+": Error code "+xhr.status+" Reserve external load ...";
				load_script(server[1]);		
				}
				if(xml_url==server[1]) {
				document.getElementById("version").innerHTML=box_client+": Error code "+xhr.status+" Reserve external load 2 ...";
				load_script(server[2]);		
				}
				if(xml_url==server[2]) {
				document.getElementById("version").innerHTML=box_client+": Error code "+xhr.status+" End stack of external load! Reboot please<br/>Сообщите об ошибке на вашем типе оборудования в группе ВК <br/>http://vk.com/smarttv_ru";

				}
		}
		}
	};
		if(xml_url==server[2]) var timeload=16000;
		else if(xml_url==server[1]) timeload=13000;
		else timeload=10000;
		timeout = setTimeout(function () {
	    alert("Time over "+xml_url);
	    xhr.abort();
		if(xml_url==server[0]) {
		document.getElementById("version").innerHTML=box_client+": Timeout ("+(timeload/1000)+"s) Reserve external load...";
		load_script(server[1]);		
		}
		else if(xml_url==server[1]) {
		document.getElementById("version").innerHTML=box_client+": Timeout ("+(timeload/1000)+"s) Reserve external load 2...";
		load_script(server[2]);		
		}
		else {
		document.getElementById("version").innerHTML=box_client+": Timeout ("+(timeload/1000)+"s) End stack of external load! Reboot please<br/>Сообщите об ошибке на вашем типе оборудования в группе ВК<br/>http://vk.com/smarttv_ru";
		alert("End stack load!");
		}
		}, timeload); 
		xhr.send(null);
    } 
    catch(e){}
};
function sendError(e)
{
	try {
	url=server[0]+"?do=booterror&initial="+initial+"&e="+e;
	alert(url);
	var xml = new XMLHttpRequest();
	xml.open("GET", url, true); 
	xml.onreadystatechange = function() {
    if(xml.readyState == 4){}      
	};
	xml.send(null);
	} catch (e) {alert(e);}
};
function cleandir(){
    var fileSystemObj = new FileSystem();
	var d=curWidget.id;
	var res=0;
	var arrFiles = ["ch_array.xml","channels.jtv","url.dat","pl_array.xml","enter.xml","enter1.xml","enter2.xml","enter3.xml","enter4.xml","enter5.xml"];
		for (var i=0; i < arrFiles.length; i++) {      
        	if(fileSystemObj.deleteCommonFile(curWidget.id + '/'+arrFiles[i])) res++;		
		}
}