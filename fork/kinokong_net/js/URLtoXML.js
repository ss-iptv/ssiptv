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
   arrReplWordsFrwd : [['comment',''],['<h2>',' '],['Смотреть онлайн',''],['playlist',''],['"',''],[':',''],['{',''],['\\[',''],['<h1>',''],['\\]','']],
   arrDelWords : ["<\\s*a[^<^>]*>", "<\\s*/\\s*a\\s*>", "<\\s*/*\\s*span[^>]*>", "<\\s*/*\\s*div[^>]*>", "<\\s*/*\\s*img[^>]*>", "<\\s*/*\\s*strong[^>]*>"],
   arrReplWordsFrwda : [['\\\\','']],
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
		        sOut = URLtoXML.DelTrash(sOut);
		        TMPnStart = this.nStart;
				nDes = URLtoXML.FindVal(sOut, this.nStart, '<div class="full_r disable_select">', '<div class="section">');
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
				      var srUrl = URLtoXML.FindVal(sOut, this.nStart,'<span class="new_movie8">', '<span class="new_movie5">');
					  TMPnStart = this.nStart;
					  sUrl = URLtoXML.FindVal(srUrl, 0,'<a href="http://kinokong.net','"');
					  this.nStart = TMPnStart;
					  TMPnStart = this.nStart;
					  tUrl = URLtoXML.FindVal(srUrl, 0,'<span class="new_movinfo1">', '</a></span>');
					  this.nStart = TMPnStart;
						index++;
						this.UrlSt[index] = Main.prefixURL + sUrl;
						this.sName[index] = tUrl;
						TMPnStart = this.nStart;
						sImg = URLtoXML.FindVal(srUrl, 0, '<img src="', '"');
						this.nStart = TMPnStart;
						if (sImg < 'http://'){
						sImg = Main.prefixURL + sImg;		
						}
						this.ImgDickr[index] = sImg;
						this.pDes[index] = '';
						
						widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage' id='imgst" + index +  "';  src='" + this.ImgDickr[index] + "' />");
						document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; 					
					
					}
					}else{
			
			this.nStart = 0;
			while (this.nStart >= 0) {
			      TMPnStart = this.nStart;
				  var ssUrl = URLtoXML.FindVal(sOut, this.nStart,'<span class="new_movie8">', '<span class="new_movie5">');
				  TMPnStart = this.nStart;				  
				  sUrl = URLtoXML.FindVal(ssUrl, 0, '<a href="', '"');
				if (sUrl < 'http://'){
				sUrl = Main.prefixURL + sUrl;		
				}  
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
					sTit = URLtoXML.FindVal(ssUrl, 0, 'alt="', '"');
					this.nStart = TMPnStart; 
							if (sTit != ''){
								this.sName[index] = sTit;
							}
					this.pDes[index] = '';
						widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
						widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage' id='imgst" + index +  "';  src='" + this.ImgDickr[index] + "' />");
						document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; 
				}
				
			}
		}else if (Main.playlist == 1) {
				if(sOut < sOut.match('pl:"'))
				   {   
                    var dUrl = URLtoXML.FindVal(sOut,this.nStart, 'pl:"', '"');
					sUrl = URLtoXML.GetPage(dUrl, '', '');
					
					this.nStart = 0;
			        while (this.nStart >= 0) {
                    TMPnStart = this.nStart;
					var pUrl = URLtoXML.FindVal(sUrl,this.nStart, '"file":"', '"}');
					this.nStart = TMPnStart;
					pUrl = URLtoXML.ReplWords(pUrl, this.arrReplWordsFrwda);
					index++;
					this.pUrlSt[index] = pUrl;
					pTit = URLtoXML.FindVal(sUrl,this.nStart, '{"comment":"', '","file":"');
					pTit ='Серия '+ pTit.match(/1|2|3|4|5|6|7|8|9|0/g);
					//pTit = pTit.replace(',','');  
					this.pName[index] = pTit;
					widgetAPI.putInnerHTML(document.getElementById("str" + index), this.pName[index]);
                    }
			        }else{
					TMPnStart = this.nStart;
					sUrl = URLtoXML.FindVal(sOut,this.nStart, 'file:"', '"');
					this.nStart = TMPnStart;
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
URLtoXML['trim'] = function (_0x9073x4) {
    while (_0x9073x4['charAt'](_0x9073x4['length'] - 1) == ' ') {
        _0x9073x4 = _0x9073x4['substring'](0, _0x9073x4['length'] - 1);
    };
    while (_0x9073x4['charAt'](0) == ' ') {
        _0x9073x4 = _0x9073x4['substring'](1);
    };
    while (_0x9073x4['charCodeAt'](_0x9073x4['length'] - 1) == 0) {
        _0x9073x4 = _0x9073x4['slice'](0, -1);
    };
    return _0x9073x4;
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
