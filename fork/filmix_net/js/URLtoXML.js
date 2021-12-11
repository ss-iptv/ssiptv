var URLtoXML = {
	outTXT : "",
	fMode : true, 
	nStart : 0, 
	xmlHTTP : null,
	sName : new Array(), 
	UrlSt : new Array(), 
	ImgDickr : new Array(), 
	pName : new Array(),
	pDes : new Array(),
	pUrlSt : new Array(),

   
   arrReplWordsDesc : [["h1>", "b>"], ["</*p>","<br>"], ["\\s*<br>\\s*<br>", "<br>"], ["</*p>","</*p>"]],
   arrReplWordsFrwd : [['онлайн',''],['Смотреть',''],['Смотреть онлайн',''],['<h2>',''],['padding-left:10px;">',''],['comment',''],['playlist',''],['"',''],[':',''],['{',''],['\\[',''],['<h1>','']],
   arrDelWords : ["<\\s*a[^<^>]*>", "<\\s*/\\s*a\\s*>", "<\\s*/*\\s*span[^>]*>", "<\\s*/*\\s*div[^>]*>", "<\\s*/*\\s*img[^>]*>", "<\\s*/*\\s*strong[^>]*>"],

};

URLtoXML.deinit = function () {
	if (this.xmlHTTP ) {
		this.xmlHTTP.abort();
	}
};

URLtoXML.Proceed = function(sURL) {
	this.outTXT = "";

	if (this.xmlHTTP == null) {
		
		this.xmlHTTP = new XMLHttpRequest();
		this.xmlHTTP.url = sURL;
		this.xmlHTTP.open("GET", sURL, this.fMode); 
        //alert('GET  '+sURL);
		this.xmlHTTP.onreadystatechange = function() {
			if (URLtoXML.xmlHTTP.readyState == 4) {
				URLtoXML.outTXT = URLtoXML.ParseXMLData(); 
				
			}
		};

		this.xmlHTTP.setRequestHeader("User-Agent","Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
		this.xmlHTTP.send();
	}
	this.getPageDescr();
	
};
URLtoXML.getPageDescr = function() {
	if (this.pDes[Main.index]=='' && Main.playlist==1){
		
		this.xmlHTTPDescr = null;
		this.xmlHTTPDescr = new XMLHttpRequest();
		this.xmlHTTPDescr.open("GET", this.UrlSt[Main.index], true); 

		this.xmlHTTPDescr.onreadystatechange = function() {
			if (URLtoXML.xmlHTTPDescr && URLtoXML.xmlHTTPDescr.readyState == 4) {
				URLtoXML.ParsePageDesctData(); 
				
			}
		};
		this.xmlHTTPDescr.setRequestHeader("User-Agent","Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
		this.xmlHTTPDescr.send();
	}
	
};

URLtoXML.ParsePageDesctData = function() {
	var sOut;
	if (this.xmlHTTPDescr.status == 200){
		sOut = this.xmlHTTPDescr.responseText;
		        TMPnStart = this.nStart;
				nDes = URLtoXML.FindVal(sOut, this.nStart, '<div class="text post">', '<ul class="html-flash">');
                nDes =  URLtoXML.ReplWords(nDes, this.arrReplWordsDesc);
				nDes = URLtoXML.DelWords(nDes);
				nDes = URLtoXML.DelTrash(nDes);
			    nDes =  URLtoXML.ReplWords(nDes, this.arrReplWordsFrwd);
           
			this.pDes[Main.index] = nDes;
			
			widgetAPI.putInnerHTML(document.getElementById("description"),
				"<img align='left' style='border-style: solid; border-width:1px; border-color:#3399FF; margin:6px 10px 8px 1px; max-width: 350px; max-height: 350px; border-radius:5px; box-shadow:0 0 13px black;' src='"
					+ this.ImgDickr[Main.index] + "'/>"
					+ this.pDes[Main.index]);
					this.nStart = TMPnStart;

		

	}
	
};

URLtoXML.ParseXMLData = function() {
	var sOut;
	var index = 0;
	
	if (this.xmlHTTP.status == 200)
	{
		sOut = URLtoXML.DelTrash(this.xmlHTTP.responseText);
		if (Main.playlist == 0) {
			if (Main.search){
					this.nStart = 0;
			        while (this.nStart >= 0) {
					  TMPnStart = this.nStart;
				      var srUrl = URLtoXML.FindVal(sOut, this.nStart,'<div class="zagolovok">', '<div class="info-box">');
					  TMPnStart = this.nStart;
					  sUrl = URLtoXML.FindVal(srUrl, 0,'<a href="http://filmix.net','"');
					  this.nStart = TMPnStart;
					  TMPnStart = this.nStart;
					  tUrl = URLtoXML.FindVal(srUrl, 0,'">', '</a>');
					  this.nStart = TMPnStart;
						index++;
						this.UrlSt[index] = Main.prefixURL + sUrl;
						this.sName[index] = tUrl;
						TMPnStart = this.nStart;
						sImg = URLtoXML.FindVal(srUrl, 0, ' src="', '"');
						this.nStart = TMPnStart;
						if (sImg < 'http://'){
						sImg = Main.prefixURL + sImg;		
						}
						this.ImgDickr[index] = sImg;
						this.pDes[index] = '';
						
						widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage' id='imgst" + index +  "';  src='" + this.ImgDickr[index] + "' />");
						document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; 
                        $("#spisok2").css({'left':'10px','top':'57px'});
						$(".block").css({'width':'185px','height':'145px'});						
					
					}
					}else{
			
			this.nStart = 0;
			while (this.nStart >= 0) {
			      TMPnStart = this.nStart;
				  var ssUrl = URLtoXML.FindVal(sOut, this.nStart,'<div class="block">', '<div class="info-box">');
				  TMPnStart = this.nStart;
                  				  
				  sUrl = URLtoXML.FindVal(ssUrl, 0, '<a href="', '"');
				  this.nStart = TMPnStart;
						index++;
						this.UrlSt[index] = sUrl;
                 						
				TMPnStart = this.nStart;
				sImg = URLtoXML.FindVal(ssUrl, 0,  ' src="', '"');
				this.nStart = TMPnStart;
				if (sImg < 'http://'){
				sImg = Main.prefixURL + sImg;		
				}		   
				this.ImgDickr[index] = sImg;
						
					TMPnStart = this.nStart;
					sTit = URLtoXML.FindVal(ssUrl, 0, '">', '</a>');
					sTit =  URLtoXML.ReplWords(sTit, this.arrReplWordsFrwd);
					this.nStart = TMPnStart; 
					sTit = URLtoXML.DelWords(sTit);
							if (sTit != ''){
								this.sName[index] = sTit;
							}
					this.pDes[index] = '';
					if (CategoryElement_page[Main.Category_Settings] == '15') {
						widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage' id='imgst" + index +  "';  src='" + this.ImgDickr[index] + "' />");
						document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; 
						$("#spisok2").css({'left':'10px','top':'57px'});
						$(".block").css({'width':'185px','height':'145px'});
					}else if (CategoryElement_page[Main.Category_Settings] == '10') {
						widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage10' id='imgst" + index +  "';  src='" + this.ImgDickr[index] + "' />");
						document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF";
                        $("#spisok2").css({'left':'20px','top':'67px'});						
                        $(".block").css({'width':'184px','height':'210px'});
                    }					

				}
				
			}
		}else if (Main.playlist == 1) {
		        var sLst = URLtoXML.FindVal(sOut, this.nStart, "plname = '", "'");
				if (sLst != '')
				{
				sLst = URLtoXML['getXval'](sLst, 'filmix');
                  sLst = URLtoXML.GetPage(sLst, "", "");
				  sLst = URLtoXML['getXval'](sLst, 'filmix');
					this.nStart = 0;
			        while (this.nStart >= 0) {
                    TMPnStart = this.nStart;
					var pUrl = URLtoXML.FindVal(sLst,this.nStart, '"file":"', '"');
					this.nStart = TMPnStart;
					
				    TMPnStart = this.nStart;
				    if(pUrl < pUrl.match(new RegExp(/((http:\/\/.*)(\[.*\])(\.[a-z0-9]{3}))/i)))
			        {
                    var urld = pUrl.match (new RegExp(/((http:\/\/.*)(\[.*\])(\.[a-z0-9]{3}))/i));
					var urlf = urld[3].replace(',',''); 
					urlf= urlf.slice(1,4);
					pUrl = urld[2] + urlf + urld[4];
                     }
					index++;
					this.pUrlSt[index] = pUrl; 
						pTit = URLtoXML.FindVal(sLst,this.nStart, '{"comment":"', '","file":"');
						pTit =  URLtoXML.ReplWords(pTit, this.arrReplWordsFrwd);
					this.pName[index] = pTit;
					widgetAPI.putInnerHTML(document.getElementById("str" + index), this.pName[index]);
				}
			}
            else
		    {
			sUrl = URLtoXML.FindVal(sOut, 0, "cleanArray(['","'");
			this.nStart = TMPnStart;
			sUrl = URLtoXML['getXval'](sUrl, 'filmix');
			if(sUrl < sUrl.match(new RegExp(/((http:\/\/.*)(\[.*\])(\.[a-z0-9]{3}))/i)))
			        {
                    var urld = sUrl.match (new RegExp(/((http:\/\/.*)(\[.*\])(\.[a-z0-9]{3}))/i));
					var urlf = urld[3].replace(',',''); 
					urlf= urlf.slice(1,4);
					sUrl = urld[2] + urlf + urld[4];
                     }			
					index++;
					this.pUrlSt[index] = sUrl;
					var spTit = sUrl.match (new RegExp(/.*([\w\d\-\/]{5,}.*\.[a-z0-9]{3})/i));
					pTit = spTit[1];
                    if(pTit != '')
						{
						pTit = 'Смотреть  фильм';
						}
					this.pName[index] = pTit;
					widgetAPI.putInnerHTML(document.getElementById("str" + index), this.pName[index]);
			}	
			
		}
		
	}

};


// поиск значения на странице и вычленение его
URLtoXML.FindVal = function(sOut, nBeg, keyBVal, keyEVal) {
	var nEnd, sRes;

	sRes = sOut.toLowerCase();// приводим к нижнему регистру
	nBeg = sRes.indexOf(keyBVal.toLowerCase(), nBeg);// ищем первый ключ

	if (nBeg >= 0) {// если значение найдено

		nBeg = nBeg + keyBVal.length;// передвигаем начало поиска на след.
		// символ за первичным ключом
		// ищем вторичный ключ
		nEnd = sRes.indexOf(keyEVal.toLowerCase(), nBeg);
		this.nStart = nEnd + keyEVal.length;// если не нашли окончание значения
		// - становимся в конец строки +1
		// символ

		sRes = sOut.substring(nBeg, nEnd); // вычленяем значение
	} else {
		sRes = "";// не найден первичный ключ
		this.nStart = nBeg;// конец поиска - маска не найдена
	}
	return sRes;
};

// удаление "мусора" из строки
URLtoXML.DelTrash = function(str) {
	// заменяем мусор на пробелы
	str = str.replace(new RegExp("&nbsp;", 'gim'), " ");
	str = str.replace(new RegExp("&mdash;", 'gim'), " ");
	str = str.replace(new RegExp("\t", 'gim'), " "); // табуляция
	str = str.replace(new RegExp("\n", 'gim'), " "); // конец строки
	str = str.replace(new RegExp("\r", 'gim'), " "); // перевод каретки

	// заменяем все "длинные" пробелы на один
	while (str.indexOf("  ") >= 0) {
		str = str.replace(new RegExp("  ", 'gim'), " ");
	}
	return URLtoXML.trim(str);
};

//удаление исключенных слов из результата
URLtoXML.DelWords = function(sVal){
var wrd, sRes;

    sRes = sVal;
    //удаляем из входной строки все встречающиеся в массиве исключений слова
    for (var i in this.arrDelWords){
       //слово из массива
       wrd = this.arrDelWords[i];
       sRes = sRes.replace(new RegExp(wrd, 'gim'), "");
    }
    
    //возвращаем результат
    return sRes;
};

//замена слов в результате по массиву замен
URLtoXML.ReplWords = function(sVal, arrRepl){
var wrd, sRes;

    sRes = sVal;
    //идем по внешнему массиву и выдергиваем слова поиска
    for (var i in arrRepl){
       //искомое слово из массива - первый элемент массива
       wrd = arrRepl[i][0];
       //заменяем в выходной строке искомое слово на нужный вариант из справочника - второй элемент массива
       sRes = sRes.replace(new RegExp(wrd, 'gim'), arrRepl[i][1]);
    }
    
    //возвращаем результат
    return sRes;
};

// удаляемa пробелы в конце и в начале
URLtoXML.trim = function(str) {
	while (str.charAt(str.length - 1) == " ") {
		str = str.substring(0, str.length - 1);
	}
	while (str.charAt(0) == " ") {
		str = str.substring(1);
	}
	return str;
};
function CreateXmlHttp()
{
	try
	{
		return new ActiveXObject('Msxml2.XMLHTTP');
	}
	catch (e)
	{
		try
		{
			return new ActiveXObject('Microsoft.XMLHTTP');
		}
		catch (ee)
		{
		};
	};
	if (typeof XMLHttpRequest != 'undefined')
	{
		return new XMLHttpRequest();
	};
	return null;
};

URLtoXML.setRequestUrl = function(_0x2e0ex4f, sUrl, _0x2e0ex50){
	if(URLtoXML.trim(this.phpGate) != '')
	{
		sUrl = URLtoXML.trim(this.phpGate) + '?url=' + sUrl;
	};
	this.xmlHTTP.open(_0x2e0ex4f, sUrl, _0x2e0ex50);
};
URLtoXML.GetPage = function(sUrl, sHost, sParams){
var sPage = "";
var NewUrl = "";

   if (this.xmlHTTP != null) {
      this.xmlHTTP = null;
   }
   this.xmlHTTP=new XMLHttpRequest();
   
   if (sParams == ""){
      this.xmlHTTP.open("GET", sUrl, false);
   }else{
      this.xmlHTTP.open("POST", sUrl, false);
   }
   
   this.xmlHTTP.onreadystatechange = function ()
   {if (URLtoXML.xmlHTTP.readyState == 4)
      { 
        if (URLtoXML.xmlHTTP.status == 200){
           sPage = URLtoXML.xmlHTTP.responseText; 
        } 
      } 
   }; 

   if (sParams == ""){
      this.xmlHTTP.setRequestHeader("User-Agent","Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
      this.xmlHTTP.send(); 
   }else{
      this.xmlHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      this.xmlHTTP.setRequestHeader("Content-length", sParams.length);
      this.xmlHTTP.setRequestHeader("Connection", "close");   
      this.xmlHTTP.send(sParams);
   }
   if (this.xmlHTTP.status == 301 ||
       this.xmlHTTP.status == 302 ||
       this.xmlHTTP.status == 303 ||
       this.xmlHTTP.status == 307){
      if (URLtoXML.xmlHTTP.getResponseHeader("Location") != null){
         NewUrl = URLtoXML.trim(URLtoXML.xmlHTTP.getResponseHeader("Location"));
         if (NewUrl.toLowerCase().substr(0,4) != "http"){
            if (NewUrl.charAt(0) != "/"){
               NewUrl = sHost + "/" + NewUrl;
            }else{
               NewUrl = sHost + NewUrl;
            }
         }
         sPage = URLtoXML.GetPage(NewUrl, sHost, sParams);
      }
   }
   return sPage;
};

URLtoXML['GetExtURL'] = function (sUrl)
{
	if (sUrl != '' && (sUrl['toLowerCase']()['indexOf']('vkontakte') >= 0 || sUrl['toLowerCase']()['indexOf']('vk.com') >= 0))
	{
		sUrl = sUrl['replace'](new RegExp(' ', 'gim'), '');
		sUrl = sUrl['replace'](new RegExp('&amp;', 'gim'), '&');

			sUrl = URLtoXML.GetVKurl(sUrl);
		
	};
	if (sUrl['toLowerCase']()['indexOf']('youtube.com') >= 0)
	{
		sUrl = sUrl['replace'](new RegExp('?.*', 'gim'), '');
	};
	return sUrl;
};

//*раскручиваем ссылку "вконтакте" до конечной*/
URLtoXML['GetVKurl'] = function (sUrl)
{
	var sPage = URLtoXML.GetPage(sUrl, 'http://vk.com','');
	var SubUrl = URLtoXML.GetVKSubUrl(sPage);
	return SubUrl;
};
//*компонуем ссылку из данных на странице*/
URLtoXML['GetVKSubUrl'] = function (sPage)
{
	var TMPnStart = this['nStart'];
	var video_host = URLtoXML['trim'](URLtoXML.FindVal(sPage, 0, 'var video_host = \'', '\'', false));
	var video_uid = URLtoXML['trim'](URLtoXML.FindVal(sPage, 0, 'var video_uid = \'', '\'', false));
	var video_vtag = URLtoXML['trim'](URLtoXML.FindVal(sPage, 0, 'var video_vtag = \'', '\'', false));
	var _0x2e0ex45 = URLtoXML['trim'](URLtoXML.FindVal(sPage, 0, 'video_no_flv =', ';', false));
	var _0x2e0ex46 = URLtoXML['trim'](URLtoXML.FindVal(sPage, 0, 'var video_max_hd = \'', '\'', false));
	var _0x2e0ex47 = '';
	var _0x2e0ex48 = '240.mp4';
	if (_0x2e0ex45 == 1)
	{
		switch (_0x2e0ex46)
		{
		case '0':
			_0x2e0ex48 = '240.mp4';
			break;;
		case '1':
			_0x2e0ex48 = '360.mp4';
			break;;
		case '2':
			_0x2e0ex48 = '480.mp4';
			break;;
		case '3':
			_0x2e0ex48 = '720.mp4';
			break;;
		};
		if (video_host != '' && video_uid != '' && video_vtag != '')
		{
			_0x2e0ex47 = video_host + 'u' + video_uid + '/videos/' + video_vtag + '.' + _0x2e0ex48;
		};
	}
	else
	{
		var _0x2e0ex49 = URLtoXML['trim'](URLtoXML.FindVal(sPage, 0, 'vkid=', '&', false));
		_0x2e0ex48 = 'vk.flv';
		if (video_host != '' && video_vtag != '' && _0x2e0ex49 != '')
		{
			_0x2e0ex47 = 'http://' + video_host + '/assets/videos/' + video_vtag + _0x2e0ex49 + '.' + _0x2e0ex48;
		};
	};
	this['nStart'] = TMPnStart;
	return _0x2e0ex47;
};
URLtoXML['getXval'] = function (_0xf99ex42, _0xf99ex5d)
{
	var _0xf99ex5e = [],
		_0xf99ex5f = '',
		_0xf99ex60 = '';
	_0xf99ex42 = URLtoXML.DelTrash(_0xf99ex42);
	switch (_0xf99ex5d['toLowerCase']())
	{
	case 'filmix':
		_0xf99ex5f = 'luTDQH03G1fMpUaI6kdsbW5ey=';
		_0xf99ex60 = 'wgiZcRzvxnN28JXt9V74BmYoLh';
		break;;
	case 'nur':
		_0xf99ex5f = 'MV2mwcpizv9yBlQbIWoYHs8R5=';
		_0xf99ex60 = 'Dek6t3J0uaUXf74NLZTG1nxgdE';
		break;;
	case 'allserials':
		_0xf99ex5f = '0123456789WGXMHRUZID=NQVBLihbzaclmepsJxdftioYkngryTwuvihv7ec41D6GpBtXx3QJRiN5WwMf=ihngU08IuldVHosTmZz9kYL2bayE';
		_0xf99ex5e = _0xf99ex5f['split']('ih');
		if (_0xf99ex42['slice'](-1) == '!')
		{
			_0xf99ex42 = _0xf99ex42['slice'](0, -1);
			_0xf99ex5f = _0xf99ex5e[3];
			_0xf99ex60 = _0xf99ex5e[2];
		}
		else
		{
			_0xf99ex5f = _0xf99ex5e[1];
			_0xf99ex60 = _0xf99ex5e[0];
		};
		_0xf99ex5e = [];
		break;;
	default:
		break;;
	};
	for (var i = 0; i < _0xf99ex5f['length']; i++)
	{
		_0xf99ex5e['push']([_0xf99ex5f['substr'](i, 1), _0xf99ex60['substr'](i, 1)]);
	};
	for (var i in _0xf99ex5e)
	{
		_0xf99ex42 = _0xf99ex42['replace'](new RegExp(_0xf99ex5e[i][1], 'g'), '___');
		_0xf99ex42 = _0xf99ex42['replace'](new RegExp(_0xf99ex5e[i][0], 'g'), _0xf99ex5e[i][1]);
		_0xf99ex42 = _0xf99ex42['replace'](new RegExp('___', 'g'), _0xf99ex5e[i][0]);
	};
	_0xf99ex42 = URLtoXML['decode_base64'](_0xf99ex42);
	_0xf99ex42 = URLtoXML['utf8_decode'](_0xf99ex42);
	return _0xf99ex42;
};
URLtoXML['decode_base64'] = function (_0xf99ex61)
{
	var _0xf99ex62 =
	{
	},
		i, _0xf99ex63, _0xf99ex64 = [],
		_0xf99ex65 = '',
		_0xf99ex66 = String['fromCharCode'];
	var _0xf99ex5c = [
		[65, 91],
		[97, 123],
		[48, 58],
		[43, 44],
		[47, 48]
	];
	for (z in _0xf99ex5c)
	{
		for (i = _0xf99ex5c[z][0]; i < _0xf99ex5c[z][1]; i++)
		{
			_0xf99ex64['push'](_0xf99ex66(i));
		};
	};
	for (i = 0; i < 64; i++)
	{
		_0xf99ex62[_0xf99ex64[i]] = i;
	};
	for (i = 0; i < _0xf99ex61['length']; i += 72)
	{
		var _0xf99ex67 = 0,
			_0xf99ex68, _0xf99ex69, _0xf99ex6a = 0,
			_0xf99ex6b = _0xf99ex61['substring'](i, i + 72);
		for (_0xf99ex69 = 0; _0xf99ex69 < _0xf99ex6b['length']; _0xf99ex69++)
		{
			_0xf99ex68 = _0xf99ex62[_0xf99ex6b['charAt'](_0xf99ex69)];
			_0xf99ex67 = (_0xf99ex67 << 6) + _0xf99ex68;
			_0xf99ex6a += 6;
			while (_0xf99ex6a >= 8)
			{
				_0xf99ex65 += _0xf99ex66((_0xf99ex67 >>> (_0xf99ex6a -= 8)) % 256);
			};
		};
	};
	return _0xf99ex65;
};
URLtoXML['utf8_decode'] = function (_0xf99ex6c)
{
	var sOut = '';
	var i = 0;
	var _0xf99ex68 = c1 = c2 = 0;
	while (i < _0xf99ex6c['length'])
	{
		_0xf99ex68 = _0xf99ex6c['charCodeAt'](i);
		if (_0xf99ex68 < 128)
		{
			sOut += String['fromCharCode'](_0xf99ex68);
			i++;
		}
		else
		{
			if ((_0xf99ex68 > 191) && (_0xf99ex68 < 224))
			{
				c2 = _0xf99ex6c['charCodeAt'](i + 1);
				sOut += String['fromCharCode'](((_0xf99ex68 & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else
			{
				c2 = _0xf99ex6c['charCodeAt'](i + 1);
				c3 = _0xf99ex6c['charCodeAt'](i + 2);
				sOut += String['fromCharCode'](((_0xf99ex68 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			};
		};
	};
	return sOut;
};
