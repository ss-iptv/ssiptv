/*------------------------------以下是全局变量-----------------------------*/
var _this,textTimer,temp_this,scrollWaitTime=0;
var isNetflix = false;
var line, appIndex, tempThis, listName,hasLoadReady = true;
var changeMore = true;//判断导航条数据是否多于4条
var inputBack = 1;//模糊搜索input空时返回聚焦第一个应用
var pinCodeBefore;//记录pincode的入口
var tempHtml; //存储溢出导航的innerHtml
var currentIcon;
var converImg = false;
var isInstallNav = 1;
var isLockApp;
var currentCategory = "All";
var wholeData;
var navData;
var json = {};
var countryListLength;
/*-----------------------------获取本地存储的数据----------------------------*/
var lang = window.location.href.split("=")[1].split("&")[1];
var areaCode;
var pincodeKey;
var pinOption;
var productId = $.trim(window.location.href.split("=")[1].split("&")[0]);
var deviceid;
var manufacturerid;
var categoryid;
var testArray = {
    "localfunction:gotoopeninternet": "GotoOpenInternet"
};
/*-----------------------------初始化本地参数----------------------------*/
if(!(lang)){
    lang = "en";
}
if(localStorage.getItem("pincodeKey")){
    pincodeKey = localStorage.getItem("pincodeKey");
}else{
    pincodeKey = "1234"
}
if(localStorage.getItem("pinOption")){
    pinOption = localStorage.getItem("pinOption");
}else{
    pinOption = "1"
}

if(!(productId)){
    productId = "8"
}

if(getCookie("deviceid")){
    deviceid = getCookie("deviceid");
}else{
    deviceid = "54549037"
}
if(getCookie("manufacturerid")){
    manufacturerid = getCookie("manufacturerid");
}else{
    manufacturerid = "0008c6"
}

if(getCookie("categoryid")){
    categoryid = getCookie("categoryid");
}else{
    categoryid = "5901a5b3f6b02be240190001";
}
/*----------------------------------RELOAD FUNCTION-----------------------------------*/
$(function () {
    /*-----------------AJAX---------------------*/
    //处理当前areaCode并且加载国家列表进入此页面只加载一次
    (function getAreaList(){
        var data = {};
        data.productId = productId;
        data.categoryid = categoryid;
        data.manufacturerid = manufacturerid;
        data.deviceid = deviceid;
        $.ajax({
            type:"POST",
            url:"/BluePortServlets/app/arealist?",//dev环境的接口
            //url:"/appgallery_api/app/arealist?",//216接口
            //error/save?deviceId=&info=&infoFrom=&params=
            //async:false,//同步获取数据
            data:data,
            dataType:"json",
            beforeSend:function(){
                startLoading();
            },
            success:function(data){
                var firmware = false;
                if(data.datas.curArea == null || data.datas.curArea == ""){
                    for(var i = 0; i < data.datas.datas.length; i++){
                        if(data.datas.datas[i] == getCookie("country")){
                            firmware = true;
                            break;
                        }
                    }
                    areaCode = firmware? getCookie("country") : "ZZ";
                }else{
                    areaCode = data.datas.curArea;
                }
                document.cookie="country="+areaCode;
                localStorage.country = areaCode;
                //var country = ["AU","AT","BE","BR","BG","CL","HR","CZ","DK","EE","FI","FR","DE","GR","HU","ZZ","IE","IT","KZ","LV","LT","LU","NL","NZ","NO","PE","PL","PT","RO","RU","RS","SK","SI","ES","SE","CH","TR","UA","GB","US","UY","AR","IL","MK","ME","BY","BA","GE","AL","AM","AZ"];
                countryListRendering(data.datas.datas);
                getAllAppData(function(){
                    appsRendering(json,"All");
                    initData();
                });
            }
        })
    })();
    /*-------------RESET CURRENT COUNTRY------------------*/
    function resetCountry(params){
        var data = {};
        data.areaCode = params;
        data.manufacturerid = manufacturerid;
        data.deviceid = deviceid;
        $.ajax({
            type:"POST",
            url:"/BluePortServlets/app/setarea?",//dev环境的接口
            //url:"/appgallery_api/app/setarea?",//216接口
            data:data,
            dataType:"json",
            beforeSend:function(){
                startLoading();
            },
            success:function(data){
            }
        })
    }
    /*-------------SEARCH ALL BASE DATA--------------------*/
    function getAllAppData(func)    {
        var data = {};
        data["productId"] = productId;
        data["areaCode"] = areaCode;
        data["lang"] = lang;
        data["deviceid"] = deviceid;
        data["manufacturerid"] = manufacturerid;
        data["categoryid"] = categoryid;

        $.ajax({
            type:"POST",
            //url:"../json/appgallery_api.json",//本地数据
            //url:"/appgallery_api/app/query?", //216数据
            url:"/BluePortServlets/app/query?", //DEV数据
            //url:"/appgallery_api/app/query?", //李园园
            data:data,
            dataType:"json",
            success:function(data){
                navData = data.datas.categorys;
                json["All"] = checkUndefined(data.datas.All);
                json["Installed"] = checkUndefined(data.datas.installed);
                json["NewApps"] = checkUndefined(data.datas.newApps);
                for(var i = 0; i < data.datas.apps.length; i++){
                    json[data.datas.apps[i].cname] = checkUndefined(data.datas.apps[i].data);
                }
                wholeData = json;
                appNavRender(navData);
                func();
            },
            error:function(a){
                $("#error").html(a.status);
            }
        });
    }
    /*---------------------检测过滤数据-----------------------*/

    function checkUndefined(data){
        var datas = [];
        var urls = Object.keys(testArray);
        for (var j = 0; j < data.length; j++) {
            if (!(urls.indexOf(data[j].filePath) > -1 && typeof window[testArray[data[j].filePath]] == "undefined")) {
                datas.push(data[j]);
            }

        }

        return datas;
    }
    /*-------------INSTALL APPS QUERY DATA AGAIN------------*/
    function addReladData(category){
        var data = {},searchVal = $("#tab1").val();
        data["productId"] = productId;
        data["areaCode"] = areaCode;
        data["lang"] = lang;
        data["deviceid"] = deviceid;
        data["manufacturerid"] = manufacturerid;
        data["categoryid"] = categoryid;
        $.ajax({
            type:"POST",
            //url:"../json/appgallery_api.json",//本地数据
            //url:"/appgallery_api/app/query?", //216数据
            url:"/BluePortServlets/app/query?", //DEV数据
            //url:"/appgallery_api/app/query?", //李园园
            data:data,
            dataType:"json",
            success:function(data){
                navData = data.datas.categorys;
                json["All"] = checkUndefined(data.datas.All);
                json["Installed"] = checkUndefined(data.datas.installed);
                json["NewApps"] = checkUndefined(data.datas.newApps);
                for(var i = 0; i < data.datas.apps.length; i++){
                    json[data.datas.apps[i].cname] = checkUndefined(data.datas.apps[i].data);
                }
                wholeData = json;
                if(searchVal == ""){
                    appsRendering(json,category);
                }else{
                    searchAPPs(searchVal,category);
                }
                findFocus();
            },
            error:function(a){
                $("#error").html(a.status);
            },
            complete:function(){
                clearLoading();
            }
        });
    }
    /*---------------SEARCH APP DETAILS----------------*/
    function getAppDetailsData(appId,menuId){
        var data = {};
        data.appId = appId;
        data.menuId = menuId;
        data.areaCode = areaCode;
        data.lang = lang;
        $.ajax({
            type:"GET",
            //url:"../json/installed.json",//本地数据
            url:"/BluePortServlets/app/detail?",//dev环境的接口
            //url:"/appgallery_api/app/detail?",
            data:data,
            dataType:"json",
            beforeSend:function(){
                startLoading();
            },
            success:function(data){
                if(data.datas.appDetail == null){
                    _this = $(".btnAddOpen").focus().html("没数据");
                    return false;
                }else{
                    $(".btnAddOpen").html("");
                }
                if(data.datas.appDetail.categoryId == 0){
                    $("#detail_tag").css("display","none");
                }else{
                    $("#detail_tag").css("display","inline-block");
                }
                isNetflix = data.datas.appDetail.title == "Netflix"? true : false;

                $(".btnAddOpen").attr("appId",_this.attr("fid"));
                _this = $(".btnAddOpen").focus().attr("isadult",data.datas.appDetail.isAdult);
                //设置btn的innerHTML
                if(isInstallNav == 2){ //已安装应用
                    _this.attr("name","detailsOpenBtn")
                        .attr("filePath",data.datas.appDetail.filePath)
                        .attr("fid",data.datas.appDetail.id)
                        .attr("hasKey",data.datas.appDetail.hasKey);

                }else{
                    _this.attr("name","detailsAddBtn");           //未安装应用
                }
                $(".detail-img").attr("src",currentIcon);        //设置icon
                $(".detail-title").html(data.datas.appDetail.title); //设置title
                $(".categoryName").html(data.datas.appDetail.categoryName); // 设置 categoryName
                $(".detailsDescribe").html(data.datas.appDetail.describe); //设置应用详情描述
                //设置右侧大图片
                if(data.datas.appDetail.screen == null){
                    return false
                }
                var arr = data.datas.appDetail.screen.split(",");
                $(".detailImgBox").html("");
                var imgStr = "";
                if(arr.length == 1){
                    imgStr = "<div class = \"detailsBigBox detailArea detailsImg1 mouseSelected\" tabindex=\"12\">" +
                    "<img  alt=\"\" class = \"detailsImgBig\" src = \""+arr[0]+"\"/>" +
                    "</div>";
                }else{
                    imgStr = "<div class = \"detailsBigBox detailArea detailsImg1 mouseSelected\" tabindex=\"12\">" +
                                "<img  alt=\"\" class = \"detailsImgBig\" src = \""+arr[0]+"\"/>" +
                            "</div>"+
                            "<div class = \"detailsBigBox detailArea mouseSelected detailsImg2\" tabindex=\"12\">" +
                                 "<img  alt=\"\" class = \"detailsImgBig\" src = \""+arr[1]+"\"/>" +
                            "</div>";
                }
                $(".detailImgBox").html(imgStr);
            },
            complete:function(){
                clearLoading();
            }
        });
    }
    /*---------------INSTALL APP----------------*/
    function addAppGallery(appId,isadult){
        var data = {};
        data["appid"] = appId;
        data["deviceid"] = deviceid;
        data["manufacturerid"] = manufacturerid;
        data["country"] = areaCode;
        data["isadult"] = isadult;
        //findFocus();
        $.ajax({
            type:"POST",
            //url:"/appgallery_api/app/install?", //216环境
            url:"/BluePortServlets/app/install?",//dev环境的
            data:data,
            dataType:"json",
            beforeSend:function(){
                startLoading();
            },
            success:function(a){
                window.localStorage.add_flag = "true";
                addReladData(currentCategory);

            }
        });
    }
    /*---------------CONFIRM PIN_CODE SI TRUE?----------------*/
    function isTruePincode(pincode){
        var data = {},isOpen;
        data["pincode"] = pincode;
        data["deviceid"] = deviceid;
        data["manufacturerid"] = manufacturerid;
        $.ajax({
            type:"GET",
            //url:"/appgallery_api/app/checkpincode?", //216环境上
            url:"/BluePortServlets/app/checkpincode?",//dev环境的
            data:data,
            async:false,//同步获取数据
            dataType:"json",
            success:function(a){
                isOpen = a.error == 0 ? true : false
            }
        });
        return isOpen;
    }
    function findFocus(){
        $("#detailsBox").css("display","none");
        $(".detailImgBox").html("");
        temp_this.find(".cover").css("display","none");
        var  screenNum = parseInt((line-0.5)/4) + 1;  //当前行属于第几页
        var  firstApplineNum = screenNum * 4 -3;      //当前页第一行属于全体第几行
        var  firsAppLength = $(".search-App").eq(firstApplineNum-1).children("li").length; //当前页第一行的长度


        if($(".pages").children("li").length != 0){
            $(".pages").children("li").eq(screenNum -1).addClass("li-active").siblings().removeClass("li-active");
        }
        if($(".search-app").children("ul").length > screenNum * 4){
            downShow();
        }else{
            downHidden();
        }
         if(firsAppLength == 0) { //翻页的情况
             if(firstApplineNum == 1){// 翻到导航项
                 var cgId = $(".active_navbg").attr("id");
                 appIndex = parseInt(cgId.split("t")[1]);
                 _this = $("#"+cgId+"").focus();
             }else{
                  if(firstApplineNum == 5){ //从第二页最后一个应用翻到第一页
                      line = 1;
                      appIndex = 1;
                      _this = $("#app" + line + "-" + appIndex).focus();
                      _this.children().css("display", "block");
                      $(".search-app ul").css({"top":0});
                      pageChangeUp();
                      $(".search-list").css("display","block");
                      $("#only_nav").css("display","none");
                      upHidden();
                  }else{
                      line = firstApplineNum - 4;
                      appIndex = 1;
                      _this = $("#app" + line + "-" + appIndex).focus();
                      _this.children().css("display", "block");
                      $(".search-app ul").css({"top": -(screenNum-2)*472});
                      pageChangeUp();
                  }
             }
             downHidden();
         }else{     //不翻页的情况
             $(".search-app ul").css({"top": -(screenNum-1)*472});
             line = firstApplineNum;
             appIndex = 1;
             _this = $("#app" + line + "-" + appIndex).focus();
             _this.children().css("display", "block");
         }
    }
    /*-----------------加载语言-------------------*/
    addCssByLink(" http://cache.zeasn.tv/webstatic/app_gallery_web/css/appGallery/appgallery_"+lang+".css");
    function addCssByLink(url){
        var doc=document;
        var link=doc.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);

        var heads = doc.getElementsByTagName("head");
        if(heads.length)
            heads[0].appendChild(link);
        else
            doc.documentElement.appendChild(link);
    }
    // 默认焦点初始化页面
    function initData(){
        _this = $("#list2").focus();
        $("#list2").addClass("active_navbg");
        $("#only_nav").attr("name","All");
        $(".bottom .greenSpan").attr("name",areaCode);
        listName = "apps";
        line = 1;
        appIndex = 2;
        if (listName == "apps") {
            $(".search-app").css("display", "block");
        }
        clearLoading();
        hasLoadReady = false;
        if(lang == "ar"){
            $(".inputSesrch").css("left",241);
        }else{
            $(".inputSesrch").css("left",15);
        }
    }


    //search function
    $(document).keyup(function(event){
        //input中X按钮的显示或隐藏
        if(_this.attr("id") == "tab1" || _this.attr("id") == "tab2" || !($("#tab1").val() == "")){
            $(".inputSesrch").css("display","none");
        }else{
        }
        if(!($("#tab1").val() == "")){  //input框不为空的时候显示
            $("#tab2").css("display","block");
            $("#iconSearch").css("display","none")
        }else{                          //input框为空的时候隐藏
            $("#tab2").css("display","none");
            $("#iconSearch").css("display","block");
        }
        //输入字母自动搜索
        if(_this.attr("id") == "tab1" && _this.val().length == 1 && event.keyCode != 8 && event.keyCode != 38 && event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 40){
            $("#list2").addClass("active_navbg").siblings().removeClass("active_navbg");
            isInstallNav = 1;
            currentCategory = "All";
            searchAPPs(_this.val(),"All");
        }
        if(_this.attr("id") == "tab1" && _this.val().length > 1 && event.keyCode != 8 && event.keyCode != 38&& event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 40){
            searchAPPs(_this.val(),currentCategory);
        }
        //点BACK键搜索
        switch (event.keyCode){
            case 8:// back
            if(_this.attr("id") == "tab1"){
                if(_this.val() != ""){
                    searchAPPs(_this.val(),currentCategory);
                }else{
                        searchAPPs(_this.val(),currentCategory);
                        event.preventDefault();
                        inputBack++;
                        if(inputBack == 3){
                            if($(".search-app li").length == 0){
                                var cgId,active_navbg = $(".active_navbg");
                                cgId = active_navbg.attr("id");
                                _this = active_navbg.focus();
                                appIndex = parseInt(cgId.split("t")[1]);
                            }else{
                                _this = $("#app1-1").focus();
                                appIndex = 1;
                            }
                            inputBack = 1;
                            $(".inputSesrch").css("display","block");
                        }
                }
            }
                break;
        }
    });
    function searchAPPs(str,category){
        if(str != ""){
            var re =new RegExp(""+str+"", 'i');//匹配规则
            var categoryArr = ["All","Installed","NewApps"];
            json = {};
            for(var j = 0; j < navData.length ; j++){
                categoryArr.push(navData[j].name);
            }
            for(var i = 0; i < categoryArr.length; i++) {
                var index = categoryArr[i];
                json[index] = [];
                for(var k = 0; k < wholeData[index].length; k++){
                    if (re.test(wholeData[index][k].title) || re.test(wholeData[index][k].describe)) {
                        json[index].push(wholeData[index][k]);
                    }
                }
            }
        }else{
            json = wholeData;
        }
        appsRendering(json,category);
    }
    /*$("#tab1").on("focus",function(){
        console.log($(this).val() == "");
        //tabIsJumpNav
    });*/
    $("#input-pincode").on("focus",function(){
        var left = 9+parseInt($(this).val().length)*10;
        $("#cursorFlash").css({
            "display":"block",
            "left":left
        });
    });

   $("#input-pincode").on("blur",function(){
        $("#cursorFlash").css("display","none");
   });


    //键盘事件
    videoKey();
    function videoKey() {
        var lastClick;
        function lockClick(){
            var nowClick = new Date();
            if (lastClick == null) {
                lastClick = nowClick;
                return true;
            } else {
                if (Math.round((nowClick.getTime() - lastClick.getTime())) > 200) {
                    lastClick = nowClick;
                    return true;
                }
                else {
                    lastClick = nowClick;
                    return false
                }
            }
        }
        $(document).keydown(function (event) {
            if(! lockClick()) return false;
            $("#tab1").on("focus",function(){
                $(".bottom .greenSpan").attr("name","");
            });

            $("#tab1").on("blur",function(){
                $(".bottom .greenSpan").attr("name",areaCode);
            });
            var appUlLength = $(".search-app ul").length,
                appLiLength = $(".search-app li").length,
                $appUl = $(".search-app ul"),
                $listLength = $(".search-list .list").length;
            switch (event.keyCode) {
                case 404:   //模拟绿键打开选择语言界面（404数字区减号109）
                    event.preventDefault();
                    if($("#app_MoreNavBox").css("display") == "block" || $("#detailsBox").css("display") == "block" || $("#adult_alertBox").css("display") == "block" || hasLoadReady){
                            return;
                    }else{
                        $("#app_CategoryBox").css("display","block");
                        temp_this = _this;
                        var curCountryIndex = parseInt($(".selected-list[name = "+areaCode+"]").attr("tabindex"));
                        var middleCountry = countryListLength-6;
                        if(curCountryIndex<3){
                            $("#countryScroll").css("top",0);
                        }else if(middleCountry >= curCountryIndex && curCountryIndex > 2){
                            $("#countryScroll").css("top",-((curCountryIndex-2)*55));
                        }else{
                            $("#countryScroll").css("top",-((countryListLength-7)*55));
                        }
                        _this = $(".selected-category .selected-list[name = "+areaCode+"]")
                            .addClass("active_selectCountry")
                            .attr("selectA","hasOKSelectCountry")
                            .focus();
                    }
                    break;
                case 8:     //BACK返回键
                    if(converImg){
                           event.preventDefault();
                           $(".coverImgScreen").css("display","none");
                           converImg = false;
                           _this = tempThis.focus();
                           return false;
                    }
                    if (_this.hasClass("pinCodeArea")) {      //处于pinCode输入密码界面

                        if(_this.attr("id") == "input-pincode" && _this.val() == ""){
                            _this.val("");
                        }else{
                            var passStr = _this.val().toString();
                            var newStr = passStr.substr(0,passStr.length-1);
                            _this.val(newStr);
                            var leftF = 9+parseInt(_this.val().length)*10;
                            $("#cursorFlash").css({
                                "left":leftF
                            });
                            return false;
                        }
                    }

                    if(_this.hasClass("selected-list")){      //选择语言界面
                        event.preventDefault();
                        $(".black_gb").css("display","none");
                        _this = $("#list1").focus();
                    }else if(_this.hasClass("selected-Nav")){  //选择导航界面
                        event.preventDefault();
                        $(".black_gb").css("display","none");
                        _this = $("#list7").focus();
                    }else if(_this.hasClass("pinCodeArea")){ //pinCodeArea返回时谁聚焦的问题
                        if(pinCodeBefore == "nav"){
                            event.preventDefault();
                            $("#adult_alertBox").css("display","none");
                            _this = temp_this.focus();
                        }else if(pinCodeBefore == "detail"){
                            event.preventDefault();
                            $("#adult_alertBox").css("display","none");
                            _this = $(".btnAddOpen").focus();
                        }else if(pinCodeBefore == "navList"){
                            event.preventDefault();
                            $("#adult_alertBox").css("display","none");
                            _this = temp_this.focus();
                        }
                    }else if(_this.hasClass("detailArea")){  //跳出详情页
                        event.preventDefault();
                        $("#detailsBox").css("display","none");
                        $(".detail-img").attr("src","");
                        $(".detailImgBox").html("");
                        _this = temp_this.focus();
                    }else if(_this.hasClass("appsTitle")){
                        event.preventDefault();
                        $("#detailsBox").css("display","none");
                        $(".detail-img").attr("src","");
                        $(".detailImgBox").html("");
                        $("#detailsBackBlue").css("display","none");
                        $("#detailsBack").css("display","inline");
                        _this = temp_this.focus();
                    }
                    break;

                case 13:     // enter
                    event.preventDefault();
                    enterKeyDown();
                    break;

                case 37://←
                    /*tab区域*/
                    if (_this.hasClass('selected-list') || _this.hasClass('selected-Nav') || _this.attr("id") == "input-pincode" || _this.hasClass("pCodeBtn1")) {
                        event.preventDefault();
                        return;
                    }else if (_this.hasClass("right")) {
                        event.preventDefault();
                        _this = _this.prev().focus();
                    }else if (_this.hasClass('tab')) {// tab区域
                        if (_this.attr("id") == "tab2") {
                            event.preventDefault();
                            _this = $("#tab1").focus();
                        } else if (_this.attr("id") == "youTube"){
                            event.preventDefault();
                            _this = $("#tab1").focus();
                        } else if(_this.attr("id") == "tab1"){

                        }

                    } else if (_this.hasClass("list")) {
                        event.preventDefault();
                        if (appIndex > 1) {
                            appIndex--;
                            _this = $("#list" + appIndex).focus();
                        }
                    } else if (_this.hasClass('app')) {
                        event.preventDefault();
                        if (appIndex > 1) {
                            appIndex--;
                            _this.find(".cover").css("display", "none");
                            _this = $("#app" + line + "-" + appIndex).focus();
                            _this.children().css("display", "block");
                        }else{
                            if(line == appUlLength){

                                appIndex = appLiLength - (line - 1 ) * 9;
                            }else{
                                appIndex = 9;
                            }
                            _this.find(".cover").css("display", "none");
                            _this = $("#app" + line + "-" + appIndex).focus();
                            _this.children().css("display", "block");
                        }
                    } else if(_this.hasClass('pCodeBtn2')){
                        event.preventDefault();
                         _this = $('.pCodeBtn1').focus();
                    }
                    /*详情页*/
                    if(_this.hasClass("detailArea")){
                        event.preventDefault();
                        if (_this.hasClass("detailsImg1")) {
                            _this = $(".btnAddOpen").focus();
                        }else if(_this.hasClass("detailsImg2")){
                            _this = $(".detailsImg1").focus();
                        }
                    }

                    break;

                case 39:// →
                    /*box区域*/
                    if (_this.hasClass('selected-list') || _this.hasClass('selected-Nav') || _this.attr("id") == "input-pincode" || _this.hasClass("pCodeBtn2")){
                        event.preventDefault();
                        return;
                    }else if (_this.hasClass("left")) {
                        event.preventDefault();
                        _this = _this.next().focus();
                    } else if (_this.hasClass('list')) {
                        event.preventDefault();
                        if (appIndex < $listLength) {
                            appIndex++;
                            _this = $("#list" + appIndex).focus();
                        }
                    } else if (_this.hasClass('tab')) {// tab区域
                        if($("#tab1").val() != "" && _this.attr("id") == "tab1"){
                            if($("#tab1")[0].selectionEnd == $("#tab1").val().length){
                                event.preventDefault();
                                _this = $("#tab2").focus();
                                $("#xDefault").css("display","none");
                                $("#xActive").css("display","block");
                            }
                        }else{
                             _this = $("#youTube").focus();
                        }
                    } else if (_this.hasClass('app')) {
                        event.preventDefault();
                        if (line !== appUlLength) {
                            appIndex++;
                            appIndex = appIndex > 9 ? 1 : appIndex;
                            _this.find(".cover").css("display", "none");
                            _this = $("#app" + line + "-" + appIndex).focus();
                            _this.children().css("display", "block");
                        } else if (line == appUlLength) {
                            if (appIndex < appLiLength - (line - 1 ) * 9) {
                                appIndex++;
                                appIndex = appIndex > 9 ? 1 : appIndex;
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                            }else{
                                appIndex = 1;
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                            }
                        }
                    }else if(_this.hasClass('pCodeBtn1')){
                        event.preventDefault();
                        _this = $('.pCodeBtn2').focus();
                    }
                    /*详情页*/
                    if(_this.hasClass("detailArea")){
                        event.preventDefault();
                        if (_this.hasClass("btnAddOpen")  && $(".detailImgBox").children().length != 0) {
                            _this = $(".detailsImg1").focus();
                        }else if(_this.hasClass("detailsImg1") && $(".detailImgBox").children().length == 2){
                            _this = $(".detailsImg2").focus();
                        }
                    }
                    break;

                case 40:// ↓
                    event.preventDefault();

                    if (_this.hasClass('tab')) {//头部Input区
                        if (_this.attr("id") == "tab1" && $("#tab1").val() != "" && $(".search-box").children().hasClass("search-selected")) {
                            _this = $(".search-selected:first-child").focus();
                        } else if (_this.hasClass("search-selected") && _this.next().hasClass("search-selected")) {
                            _this = _this.next().focus();
                        } else if (_this.hasClass("search-selected")) {

                        } else if ($("#tab1").val() == "" && $(".search-list").children().hasClass("list")) {
                            appIndex = 1;
                            $(".search-box").css("display", "none");
                            _this = $("#list" + appIndex).focus();
                            _this.attr("data-list", "1");
                        } else if ($("#tab1").val() != "" && $(".search-list").children().hasClass("list")) {
                            appIndex = 1;
                            $(".search-box").css("display", "none");
                            _this = $("#list" + appIndex).focus();
                            _this.attr("data-list", "1");
                        }

                    } else if (_this.hasClass("list")) {     //导航区
                            if($(".search-app").children().length == 0) return false;
                            if(_this.attr("id") == "list1"){
                                line = 1;
                                appIndex = 1;
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                            }else{
                                var navLength = $(".search-list").children().length;
                                var lineOneLength = $(".search-app").children().eq(0).children().length;
                                var belowFocusPosition = 9 - navLength + parseInt(_this.attr("id").substring(4));
                                if(lineOneLength >= belowFocusPosition){
                                    line = 1;
                                    appIndex = belowFocusPosition;
                                    _this = $("#app" + line + "-" + appIndex).focus();
                                    _this.children().css("display", "block");
                                }else{
                                    line = 1;
                                    appIndex = lineOneLength;
                                    _this = $("#app" + line + "-" + appIndex).focus();
                                    _this.children().css("display", "block");
                                }

                             }

                    } else if (_this.hasClass("app")) {      //内容区
                        if(line == 4 && $appUl.length >4){
                            $(".search-list").css("display","none");
                            $("#only_nav").css("display","block");
                        }
                        if (line >= (Math.floor(($appUl.length - 0.5) / 4)) * 4) {
                            downHidden();//最后一行下翻标消失
                        }
                        if (line == appUlLength - 1) {
                            if (appIndex <= appLiLength - line * 9 && line % 4 == 0) {
                                line++;
                                $appUl.css({"top": -Math.floor((line - 1) / 4) * 472});
                                pageChangeDown();
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                                upShow();
                            } else if (appIndex <= appLiLength - line * 9 && line % 4 !== 0) {
                                line++;
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                            } else if (appIndex > appLiLength - line * 9 && line % 4 == 0) {
                                appIndex = appLiLength - line * 9;
                                line++;
                                $appUl.css({"top": -Math.floor((line - 1) / 4) * 472});
                                pageChangeDown();
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                                upShow();
                            } else if (appIndex > appLiLength - line * 9 && line % 4 !== 0) {
                                appIndex = appLiLength - line * 9;
                                line++;
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                            }
                        } else if (line < appUlLength - 1) {
                            if (line % 4 == 0 && line != 0) {
                                line++;
                                $appUl.css({"top": -Math.floor((line - 1) / 4) * 472});
                                pageChangeDown();
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                                upShow();
                            } else if (appIndex <= appLiLength - line * 9) {
                                line++;
                                _this.find(".cover").css("display", "none");
                                _this = $("#app" + line + "-" + appIndex).focus();
                                _this.children().css("display", "block");
                            }
                        }
                    } else if (_this.hasClass('selected-list')) {//多语言选择
                        var curP = Math.abs(_this.position().top) - Math.abs($("#countryScroll").position().top);
                        if(curP == 275 &&  _this.attr("tabindex") <= (countryListLength-2)){
                            var downCountryList = true;
                            if(downCountryList) {
                                downCountryList = false;
                                $(".selected-list").attr("selectA", "");
                                if (_this.next().length != 0) {
                                    _this = _this.next().focus()
                                }
                                if (_this.hasClass("active_selectCountry")) {
                                    _this.attr("selectA", "hasOKSelectCountry")
                                }
                                $("#countryScroll").stop().animate({
                                    top: $("#countryScroll").position().top - 55
                                }, 50, function () {
                                    downCountryList = true;
                                });
                            }else{
                                return false;
                            }
                        }else{
                            $(".selected-list").attr("selectA","");
                            if (_this.next().length != 0) {
                                _this = _this.next().focus()
                            }
                            if(_this.hasClass("active_selectCountry")){
                                _this.attr("selectA","hasOKSelectCountry")
                            }
                        }
                    }else if (_this.hasClass('selected-Nav')) {//多导航项选择
                        $(".selected-Nav").attr("selectA","");
                        if (_this.next().length != 0) {
                            _this = _this.next().focus()
                        }
                        if(_this.hasClass("active_selectCountry")){
                            _this.attr("selectA","hasOKSelectCountry")
                        }
                    } else if (_this.attr("id") == "input-pincode") { //pinCode
                        _this = $(".pCodeBtn1").focus();
                    }else if(_this.hasClass("appsTitle")){
                        _this = $(".btnAddOpen ").focus();
                        $("#detailsBackBlue").css("display","none");
                        $("#detailsBack").css("display","inline");
                    }
                    break;

                case 38:// ↑
                    event.preventDefault();
                    if (_this.hasClass('tab')) {// tab区域
                        if (_this.hasClass("search-selected") && _this.prev().hasClass("search-selected")) {
                            _this = _this.prev().focus();
                        } else if (_this.hasClass("search-selected")) {
                            _this = $("#tab1").focus();
                        }
                    } else if (_this.hasClass('list')) {
                        appIndex = 1;
                        _this.next().css("visibility", "visible");
                        _this = $("#tab1").focus();
                    } else if (_this.hasClass("app")) {
                        if(line == 5){

                            $(".search-list").css("display","block");
                            $("#only_nav").css("display","none");
                        }
                        if ($appUl.length > 4 && ($appUl.length-$appUl.length%4 +1) >= line) {
                            downShow();
                        }
                        if (line == 1) {         //从内容区跳入导航区
                            var navLengthUp = $(".search-list").children().length;
                            var navSortId = appIndex + navLengthUp -9;
                            if(navSortId <= 0){
                                appIndex = 1;
                            }else if(navSortId >= 3){
                                appIndex = navSortId;
                            }else{
                                appIndex = 2;
                            }
                            _this.find(".cover").css("display", "none");
                            _this = $("#list" + appIndex).focus();
                        } else if (line % 4 == 1 && line > 2) {
                            line--;
                            $appUl.css({"top": -Math.floor((line - 1) / 4) * 472 });
                            pageChangeUp();
                            _this.find(".cover").css("display", "none");
                            _this = $("#app" + line + "-" + appIndex).focus();
                            _this.children().css("display", "block");
                            upShow();

                        } else {
                            line--;
                            _this.find(".cover").css("display", "none");
                            _this = $("#app" + line + "-" + appIndex).focus();
                            _this.children().css("display", "block");
                        }
                        if (line < 5) {
                            upHidden();
                        }
                    } else if (_this.hasClass('selected-list')) {//多语言选择
                        var curPd = Math.abs(_this.position().top) - Math.abs($("#countryScroll").position().top);
                        if(curPd == 55 && _this.attr("tabindex") >=3){
                            var upCountryList = true;
                            if(upCountryList){
                                upCountryList = false;
                                $(".selected-list").attr("selectA","");
                                if (_this.prev().length != 0) {
                                    _this = _this.prev().focus()
                                }
                                if(_this.hasClass("active_selectCountry")){
                                    _this.attr("selectA","hasOKSelectCountry")
                                }
                                $("#countryScroll").stop().animate({
                                    top:$("#countryScroll").position().top + 55
                                },50,function(){
                                    upCountryList = true;
                                });
                            }else{
                                return false;
                            }
                        }else{
                            $(".selected-list").attr("selectA","");
                            if (_this.prev().length != 0) {
                                _this = _this.prev().focus()
                            }
                            if(_this.hasClass("active_selectCountry")){
                                _this.attr("selectA","hasOKSelectCountry")
                            }
                        }
                    }else if (_this.hasClass('selected-Nav')) {//多导航项选择
                        $(".selected-Nav").attr("selectA","");
                        if (_this.prev().length != 0) {
                            _this = _this.prev().focus()
                        }
                        if(_this.hasClass("active_selectCountry")){
                         _this.attr("selectA","hasOKSelectCountry")
                         }
                    }else if(_this.hasClass("pCodeBtn")){
                        _this = $("#input-pincode").focus();
                    }else if(_this.hasClass("detailArea")){
                        _this = $(".appsTitle").focus();
                        $("#detailsBackBlue").css("display","inline");
                        $("#detailsBack").css("display","none");
                    }
                    break;
                /*输密码的键码*/
                case 48:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "0");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 49:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "1");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 50:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "2");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 51:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "3");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 52:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "4");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 53:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "5");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 54:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "6");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 55:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "7");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 56:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "8");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
                case 57:
                    if( event.target.id == "tab1") return;
                    if ( event.target.value && event.target.value.length >= 4 && event.target.id == "input-pincode") {
                        return false;
                    }
                    _this.val(_this.val() + "9");
                    if(event.target.value.length == 4){
                        _this = $(".pCodeBtn2").focus();
                    }
                    break;
            }
            if(_this.attr("id") != "tab2"){
                $("#xActive").css("display","none");
                $("#xDefault").css("display","block");

            }
            //pincode光标的位置
            if(_this.attr("id") == "input-pincode"){
                var left = 9+parseInt(_this.val().length)*10;
                $("#cursorFlash").css({
                    "left":left
                });
            }
            if(_this.attr("id") == "tab1" || _this.attr("id") == "tab2" || !($("#tab1").val() == "")){
                $(".inputSesrch").css("display","none");
            }else{
                $(".inputSesrch").css("display","block");
            }

        });
    }



    //鼠标事件
    /*----------------------------向下翻页----------------------------*/
    $("#down").on("mouseover",function(){
        $("#downCover").css("display","block");
    });
    $("#downCover").on("mouseleave",function(){
        $("#downCover").css("display","none");
    })
        .on("click",function(){
            var  totalPage = $(".pages li").length,currentPage;
            var  screenNum = parseInt((line-0.5)/4) + 1;  //当前行属于第几页
            currentPage = screenNum;
            currentPage++;
            upShow();
            pageChangeDown();
            $(".search-list").css("display","none");
            $("#only_nav").css("display","block");
            if(currentPage == totalPage){
                downHidden();
                $("#downCover").css("display","none");
            }
            $(".search-app ul").css({"top": -(currentPage-1)*472});
            line = screenNum*4 + 1;
            appIndex = 1;
            _this = $("#app" + line + "-" + appIndex).focus();
            _this.children().css("display", "block");
        });
    /*----------------------------向上翻页----------------------------*/
    $("#up").on("mouseover",function(){
        $("#upCover").css("display","block");
    });
    $("#upCover").on("mouseleave",function(){
        $("#upCover").css("display","none");
    })
        .on("click",function(){
            var  totalPage = $(".pages li").length,currentPage;
            var  screenNum = parseInt((line-0.5)/4) + 1;  //当前行属于第几页
            currentPage = screenNum;
            currentPage--;
            downShow();
            pageChangeUp();
            $(".search-list").css("display","block");
            $("#only_nav").css("display","none");
            if(currentPage == 1){
                upHidden();
                $("#upCover").css("display","none");
            }
            $(".search-app ul").css({"top": -(currentPage-1)*472});
            line = currentPage*4 - 3;
            appIndex = 1;
            _this = $("#app" + line + "-" + appIndex).focus();
            _this.children().css("display", "block");
        });
    //鼠标滑过确定聚焦
    $(document).on("mouseover",".mouseSelected",mouseOver);
    //点击触发事件
    $(document).on("click", ".mouseSelected",enterKeyDown);
    // app页面数量
    function pages(box, lines, number) {
        if (box.find("ul").length <= number) {
            downHidden();
            return false;
        } else {
            $(".pages").html("");
            $(".pages").append("<li class='li-active'></li>");
            var $page = Math.ceil((box.find("ul").length) / lines) - 1;
            for (var pageI = 0; pageI < $page; pageI++) {
                $(".pages .li-active").after("<li></li>");
            }
        }
    }

    //清空app页面数量
    function clearPages() {
        $(".pages").html("");
    }

    // 页面变换↑
    function pageChangeDown() {
        var _tempThis = $(".pages .li-active");
        _tempThis.removeClass("li-active");
        _tempThis.next().addClass("li-active");
    }

    // 页面变换↓
    function pageChangeUp() {
        var _tempThis = $(".pages .li-active");
        _tempThis.removeClass("li-active");
        _tempThis.prev().addClass("li-active");
    }

    // 上下屏箭头的提示
    function downHidden() {
        $("#down").css('display', "none");
    }

    function upHidden() {
        $("#up").css('display', "none");
    }

    function downShow() {
        $("#down").css('display', "block");
    }

    function upShow() {
        $("#up").css('display', "block");
    }

    //滚动字幕的俩个事件
    var _num = 0;
    $(".search-app").on("focus", ".app", function () {
        var self = $(this);
        if (textTimer) {
            clearInterval(textTimer);
        }
        textTimer = setInterval(function () {
            scrollWaitTime += 80;
            if (scrollWaitTime >= 1400) {
                var $textThis = $(document.activeElement);
                var cover = $textThis.find(".cover"),
                    $p = cover.find("p"),
                    $pWidth = $p.length > 0 && $p[0].offsetWidth,
                    $width = cover.width();
                if ($pWidth >= $width) {
                    $p.css({
                        position: "absolute",
                        left: _num + "px"
                    });

                    _num = _num - 2;
                    if (_num < -1 * ($pWidth + 20)) {
                        _num = $width;
                    }
                }
            }
        }, 50);
    });

    $(".search-app").on("blur", ".app", function () {
        var self = $(this);
        _num = 0;
        var p = self.find("p");
        p.removeAttr("style");
        scrollWaitTime = 0;
        clearInterval(textTimer);
    });

    /*渲染后台数据*/

    /*render_app_nav*/
    function appNavRender(json){
        var str = "<div tabindex=\"1\" data-list=\"1\" name=\"Installed\"  isLock = \"0\" list-name=\"apps\" class=\"list mouseSelected solidNav\" id=\"list1\"></div>" +
            "<div tabindex=\"1\" data-list=\"0\" name=\"All\"  isLock = \"0\" list-name=\"apps\" class=\"list mouseSelected solidNav\" id=\"list2\"></div>" +
            "<div tabindex=\"1\" data-list=\"0\" name=\"NewApps\"  isLock = \"0\" list-name=\"apps\" class=\"list mouseSelected solidNav\" id=\"list3\"></div>";
        var str1 = "";
        if(json.length <= 4){  //分类返回少于5条
            changeMore = false;
            for(var i = 0; i < json.length; i++){
                var j = i+4;
                str += "<div tabindex='1' data-list='0' name='" + json[i].name + "' isLock = '" + json[i].isLock + "' list-name='apps' class='list mouseSelected' id='list" + j + "'>" + json[i].name + " </div>";
            }
            $(".search-list").html("").append(str);
        }else{  //分类返回大于4条
            for(var i = 0; i < json.length; i++){
                if(i <= 2){
                    var k = i+4;
                    str += "<div tabindex='1' data-list='0' name='" + json[i].name + "' isLock = '" + json[i].isLock + "' list-name='apps' class='list mouseSelected' id='list" + k + "'>" + json[i].name + " </div>";
                }else{
                    var r = i - 2;
                    str1 += "<div class=\"selected-Nav mouseSelected\" tabindex=\"1\" name=\"list"+r+"\" data_id = \""+json[i].name+"\" isLock = '" + json[i].isLock + "'>"+json[i].name+"</div>"
                }

            }
            $(".search-list").html("").append(str);//前三条装载到导航条中
            $(".search-list").append("<div tabindex='1' class='list mouseSelected' name='more' id='list7' hasMore = \"hasMore\">...</div>");
            $("#app_MoreNavBox .right").html("").append(str1);//剩下的装载到列表中
        }
    }

    //render_app_function
    function appsRendering(json,jsonName) {
            if(!json[jsonName] || json[jsonName].length == 0){
                $(".search-app").html("");
                $(".pages").html("");
                downHidden();
                upHidden();
                return;
            }
            if (json[jsonName].length > 36) {
                downShow();
            }
            $(".search-app").html("");
            var i = 0, line, top = 0, appStr;
            for (line = 1; line <= Math.ceil((json[jsonName].length) / 9); line++) {
                appStr = "";
                if (i >= json[jsonName].length) {
                    break
                } else {
                    for (var topI = 0; topI <= 8; topI++) {
                        var ID = topI + 1;
                        if (ID > 9) {
                            ID = ID % 9;
                        } else if (ID == 0) {
                            ID = 9;
                        }
                        if (i >= json[jsonName].length) {
                            break
                        } else {
                            appStr += "<li><div class='app mouseSelected' id='app" + line + "-" + ID + "' tabindex='1' fId='" + json[jsonName][i].id + "' categoryId='" + json[jsonName][i].categoryId + "' isLock='" + json[jsonName][i].isLock + "'  hasKey='" + json[jsonName][i].hasKey + "' ifPreInstall='" + json[jsonName][i].ifPreInstall + "'>"
                            + "<img src='" + json[jsonName][i].icon + "' onerror=\"SomeJavaScriptCode(this)\" />"
                            + "<div class='cover'><p class='animate'>" + json[jsonName][i].title
                            + "</p></div></li>";
                            i++;
                        }
                    }
                }
                var ul = "<ul class='search-App clearfix'>" + appStr + "</ul>";
                $(".search-app").append(ul);
            }
            listName = "apps";
            clearPages();
            pages($(".search-app"), 4, 4);
            if ($(".search-app ul").length > 4) {
                downShow();
            }

    }
    //render_country
    function countryListRendering(params){
        var str = "",code;
        countryListLength = params.length;
        for(var i=0; i < params.length; i++){
            if(params[i] == "Global" || params[i] == "global"){
                code = "ZZ";
            }else{
                code = params[i];
            }
            str += "<div class=\"selected-list "+code+" mouseSelected\" tabindex=\""+(i+1)+"\" name=\""+code+"\"></div>";
        }
        $("#countryScroll").html(str);
    }

    /*-----------------------------右下角显示的当前时间-----------------------*/
    var _language;
    time();
    function time() {
       _language = lang;
        var mydate = new Date();

        var MonthEnglish = _time[_language].month;
        var Month = MonthEnglish[mydate.getMonth()];
        var Day = mydate.getDate();
        var weekDay = _time[_language].week;
        var Week = weekDay[mydate.getDay()];
        var Hours = mydate.getHours();
        var Minutes = mydate.getMinutes();
        if (Hours < 10) {
            Hours = "0" + Hours;
        }
        if (Minutes < 10) {
            Minutes = "0" + Minutes;
        }
        var timeStr;
        if (_language == "zh") {
            timeStr = Hours + ":" + Minutes + "  " + Week + "  " + Month + Day + "日"  ;
        } else {
            timeStr = Hours + ":" + Minutes + " " + Week + "," + Day + " " + Month;
        }

        $(".bottomRight").html(timeStr);
    }
    var timeTimer = setInterval(function () {
        time();
    }, 60000);

    /*--------------------------enter事件--------------------------*/
    function enterKeyDown(){

        if (_this.hasClass("tab")) {          //头部input区域
            if(_this.attr("id") == "tab2"){   //清空input
                $("#tab1").val("");
                $("#tab2").css("display","none");
                $("#iconSearch").css("display","block");
                searchAPPs("","All");
                $("#list2").addClass("active_navbg").siblings().removeClass("active_navbg");
                isInstallNav = 1;
                _this = $("#app1-1").focus();
                inputBack = 1;
                appIndex = 2;
            }else if(_this.attr("id") === "youTube"){
                window.close();
            }
        }else if (_this.hasClass("list")){    //导航区域 （三种情况）
            if(_this.attr("id")== "list1"){
                isInstallNav = 2;
            }else{
                isInstallNav = 1;
            }
            //第一 非加锁分类直接进入加载应用`
            if((_this.attr("isLock") != 1 || pinOption != "1") && _this.attr("name") != "more"){
                currentCategory = _this.attr("name");
                appsRendering(json,_this.attr("name"));
                _this.addClass("active_navbg").siblings().removeClass("active_navbg");
                if(_this.hasClass("solidNav")){
                    $("#only_nav").html("").attr("name",_this.attr("name"));
                }else{
                    $("#only_nav").html("").attr("name","").html(_this.attr("name"));
                }
            }
            //第二 如果是加锁分类
            if (_this.attr("isLock") == 1 && pinOption == "1") {
                currentCategory = _this.attr("name");
                tempHtml = _this.attr("name");
                temp_this = _this;//记录聚焦前的this
                pinCodeBefore = "nav";//pinCode的第一种入口
                $("#pinCodeHead").html("").html(currentCategory+" - ");
                $("#adult_alertBox").css("display","block");
                _this = $("#input-pincode").focus();
                _this.val("");
            }
            //第三 进入more菜单
            if (_this.attr("name") == "more") {
                //打开多导航列表
                $("#app_MoreNavBox").css("display","block");
                var data_id = localStorage.getItem("selectCategory");
                if(data_id == null){
                    _this = $("#app_MoreNavBox .selected-Nav:first-child").focus();
                } else{
                    _this = $("#app_MoreNavBox .selected-Nav[data_id = '"+data_id+"']").focus();
                    _this.attr("selectA","hasOKSelectCountry");
                }
            }else{  //点击其他导航按钮初始化more
                /*init_Nav_More*/
                if(changeMore){ //如果分类数据少于5条不渲染more
                    $("#list7").html("...").attr("hasMore","hasMore");
                    localStorage.removeItem("selectCategory");
                    $(".selected-Nav").removeClass("active_selectCountry").attr("selectA","");
                }

            }
        }else if(_this.hasClass("selected-list")) {   //选择国家加载对应的分类
            _this.addClass("active_selectCountry").siblings().removeClass("active_selectCountry");
            _this.attr("selectA","hasOKSelectCountry");

            areaCode = _this.attr("name");
            document.cookie="country="+areaCode;
            localStorage.country = areaCode;
            resetCountry(_this.attr("name"));
            $(".bottom .greenSpan").attr("name",_this.attr("name"));
            $(".search-list").css("display","block");
            $("#only_nav").css("display","none");
            upHidden();
            downHidden();
            $(".pages").html("");
            $(".search-app").html("");
            getAllAppData(function(){
                searchAPPs($("#tab1").val(),"All");
                _this = $("#list2").focus()
                    .addClass("active_navbg")
                    .siblings()
                    .removeClass("active_navbg");
                isInstallNav = 1;
                currentCategory = "All";
                line = 1;
                appIndex = 2;
                clearLoading();
            });
            $(".black_gb").css("display","none");

        }else if(_this.hasClass("selected-Nav")) {    //选择导航项
            if(_this.attr("isLock") == 1 && pinOption == "1"){  //第三种情况进入pinCode界面
                tempHtml = _this.html();
                temp_this = _this;//记录聚焦前的this
                pinCodeBefore = "navList";//pinCode的第三种入口
                $("#pinCodeHead").html("").html(tempHtml+" - ");
                $("#adult_alertBox").css("display","block");
                _this = $("#input-pincode").focus();
                _this.val("");
            }else{
                localStorage.setItem("selectCategory",_this.html());
                _this.addClass("active_selectCountry").siblings().removeClass("active_selectCountry");
                _this.attr("selectA","hasOKSelectCountry");
                $("#list7").addClass("active_navbg").siblings().removeClass("active_navbg");
                tempHtml = _this.html();
                appsRendering(json,tempHtml);
                _this = $("#list7").attr("hasMore","").html(tempHtml+"...").focus();
                currentCategory = tempHtml;
                $("#only_nav").attr("name","").html(tempHtml);
                $("#app_MoreNavBox").css("display","none");
            }
        }else if(_this.hasClass("pinCodeArea")){       // pinCode区域
            if(_this.hasClass("pCodeBtn1")){
                if(pinCodeBefore == "nav"){
                    $("#adult_alertBox").css("display","none");
                    _this = temp_this.focus();
                }else if(pinCodeBefore == "detail"){
                    $("#adult_alertBox").css("display","none");
                    _this = $(".btnAddOpen").focus();
                }else if(pinCodeBefore == "navList"){
                    $("#adult_alertBox").css("display","none");
                    _this = temp_this.focus();
                }
            }else if(_this.hasClass("pCodeBtn2")){
                var password = $("#input-pincode").val();
                if(isTruePincode(password)){
                    if(pinCodeBefore == "nav"){
                        $("#adult_alertBox").css("display","none");
                        _this = temp_this.focus();
                        _this.addClass("active_navbg").siblings().removeClass("active_navbg");
                        $("#input-pincode").val("");
                        $("#only_nav").html("").html(tempHtml);
                        appsRendering(json,tempHtml);
                    }else if(pinCodeBefore == "detail"){
                        $("#adult_alertBox").css("display","none");
                        _this = $(".btnAddOpen").focus();
                        if($(".btnAddOpen").attr("name") == "detailsOpenBtn"){//打开应用
                                openApps();
                        }else if($(".btnAddOpen").attr("name") == "detailsAddBtn"){
                            addAppGallery(_this.attr("appId"),$(".btnAddOpen").attr("isadult"));
                        }

                    }else if(pinCodeBefore == "navList"){
                        localStorage.setItem("selectCategory",temp_this.html());
                        temp_this.addClass("active_selectCountry").siblings().removeClass("active_selectCountry");
                        temp_this.attr("selectA","hasOKSelectCountry");
                        appsRendering(json,tempHtml);
                        $("#list7").addClass("active_navbg").siblings().removeClass("active_navbg");
                        _this = $("#list7").attr("hasMore","").html(tempHtml+"...").focus();
                        currentCategory = tempHtml;
                        $("#only_nav").html(tempHtml);
                        $("#adult_alertBox").css("display","none");
                        $("#app_MoreNavBox").css("display","none");
                    }
                }else{
                    _this = $("#input-pincode").val("").focus();
                }
            }
        }else if(_this.hasClass("app")){            //  进入详情页调一个details接口
            isLockApp = _this.attr("isLock");
            currentIcon = _this.children("img").attr("src");
            temp_this = _this;
            $(".detail-img").attr("src","");
            $(".btnAddOpen").attr("name","");
            $(".detail-title").html(""); //设置title
            $(".categoryName").html(""); // 设置 categoryName
            $(".detailsDescribe").html(""); //设置应用详情描述
            $(".detailImgBox").html("");//清空右侧截图内容
            $("#detailsBox").css("display","block");
            getAppDetailsData(_this.attr("fid"),_this.attr("categoryid"));

        }else if(_this.hasClass("btnAddOpen")){   //点击详情页的按钮
            if(isLockApp == 1 && pinOption == "1"){ //pinCode的第二种入口打开成人应用
                pinCodeBefore = "detail";
                $("#pinCodeHead").html("").html($(".detail-title").html()+" - ");
                $("#adult_alertBox").css("display","block");
                _this = $("#input-pincode").focus();
                _this.val("");
            }else{
                if(_this.attr("name") == "detailsOpenBtn"){   //直接跳转到某一个应用
                    openApps();
                }else if(_this.attr("name") == "detailsAddBtn"){    //添加应用
                    addAppGallery(_this.attr("appId"),_this.attr("isadult"));
                }
            }
        }else if(_this.hasClass("detailsBigBox")){       //放大详情页图片
            converImg = true;
            $(".coverImgScreen").css("display","block")
                .children("img")
                .attr("src",_this.children().attr("src"));
            tempThis = _this;
            _this = $(".coverImgScreen").focus();
        }else if(_this.hasClass("appsTitle")){
            event.preventDefault();
            $("#detailsBox").css("display","none");
            $(".detail-img").attr("src","");
            $(".detailImgBox").html("");
            $("#detailsBackBlue").css("display","none");
            $("#detailsBack").css("display","inline");
            _this = temp_this.focus();
        }else if(_this.hasClass("coverImgScreen")){
            $(".coverImgScreen").css("display","none")
                .children("img")
                .attr("src","");
            _this = tempThis.focus();
            converImg = false;
        }
    }
    /*-------------------------mouseOvaer事件----------------------*/
     function mouseOver(){
        _this = $(this).focus();
        if(_this.attr("id") == "tab1" || _this.attr("id") == "tab2" || !($("#tab1").val() == "")){
            $(".inputSesrch").css("display","none");
        }else{
            $(".inputSesrch").css("display","block");
        }
        if(_this.hasClass("app")){
            $(".app").find(".cover").css("display", "none");
            _this.find(".cover").css("display", "block");
            var str = _this.attr("id");
            var newstr = str.split("-");
            var num1 = newstr[0].substring(3);
            var num2 = newstr[1];
            line = num1;
            appIndex = num2;
        }
        if(_this.hasClass("appsTitle")){
            $("#detailsBackBlue").css("display","inline");
            $("#detailsBack").css("display","none");
        }else{
            $("#detailsBackBlue").css("display","none");
            $("#detailsBack").css("display","inline");
        }
        if (_this.hasClass('selected-list')) {//多语言选择
            $(".selected-list").attr("selectA","");
            if(_this.hasClass("active_selectCountry")){
                _this.attr("selectA","hasOKSelectCountry")
            }
        }else if(_this.hasClass('selected-Nav')){
            $(".selected-Nav").attr("selectA","");
            if(_this.hasClass("active_selectCountry")){
                _this.attr("selectA","hasOKSelectCountry")
            }
        }
    }
    /*-------------------------打开应用事件----------------------*/
     function  appCount(id){
         $.ajax({
             url:"/BluePortServlets/app/count?",
             data:{"appid":""+id+""},
             type:"post",
             dataType:"json",
             success:function(data){

             }
         });
     }
    /*-------------------------打开应用事件----------------------*/
     function openApps(){
         try{
             var videoNode = document.getElementById("pipVideoObject");
             videoNode.stop();
             removePicture();
         }catch (e){}
         appCount(_this.attr("fid"));
         if (_this.attr("filepath").indexOf("nternet") > -1) {
             try{
                 GotoOpenInternet();
             }catch(e){
                 jumpToIndex();
             }

         } else if (isNetflix) {
             try{
                 GotoNetflix();
             }catch (e){
                 jumpToIndex();
             }
         }else if(_this.attr("filepath").indexOf("GotoFVPApp") > -1){
             var temp = _this.attr("filepath").split(":");
             try{
                 GotoFVPApp(temp[2], temp[3] + ":" + temp[4]);
             }catch (e){
                 jumpToIndex();
             }
         }else if(_this.attr("filepath").indexOf("gotoaiv") > -1){
                try{
                    GotoAIV();
                }catch (e){
                    jumpToIndex();
                }
         }else if(_this.attr("filepath").indexOf("gotobbc") > -1){
             var _url = _this.attr("filepath");
             try{
                 GotoBBC(_url.split(":")[2] + ":" + _url.split(":")[3]);
             }catch (e){
                 window.location.href = _this.attr("filepath")
             }
         }else if(_this.attr("filepath").indexOf("miniportal") > -1){

              $("#deviceid").val(deviceid);
              $("#areaCode").val(areaCode);
              $("#manufacturerid").val(manufacturerid);
              $("#jumpmini").attr("action",_this.attr("filepath")).submit();
         } else {

             if (_this.attr("hasKey") == "0") {
                 //window.open(_this.attr("filepath"),"_blank");
                 window.location.href = _this.attr("filepath")
             } else {
                 //window.open("http://sp_dev.zeasn.tv/app_gallery/app/applaunch?appid=" + _this.attr("appid") + "&url=" + encodeURIComponent(_this.attr("filepath")), "_blank");
                 //window.location.href = "http://sp_dev.zeasn.tv/app/applaunch?appid=" + _this.attr("appid") + "&url=" + encodeURIComponent(_this.attr("filepath"))
                 $.ajax({
                     url:"/BluePortServlets/app/open?",
                     //url:"/appgallery_api/app/open?",
                     data:{"appid":""+_this.attr("fid")+"","url":""+_this.attr("filepath")+"","lang":""+lang+""},
                     type:"post",
                     dataType:"json",
                     success:function(data){
                         $("#token").val(data.data.token);
                         $("#jumpApp").attr("action",data.data.url).submit();
                     }
                 });
             }

         }
     }
     function jumpToIndex(){
         event.preventDefault();
         $("#detailsBox").css("display","none");
         $(".detail-img").attr("src","");
         $(".detailImgBox").html("");
         $("#detailsBackBlue").css("display","none");
         $("#detailsBack").css("display","inline");
         _this = temp_this.focus();
     }
});


/*----------------------------以上是预加载函数-----------------------------------*/

/*-----------------------------以下是全局函数--------------------------------*/
/*---------------------------------画中画-----------------------------------*/
setPicture();
function setPicture(){
    $("#youTube").html("<object id=\"pipVideoObject\" type=\"video/broadcast\" width=\"202\" height=\"121\" style = \"background:transparent\"> </object>");
    try {
        var videoNode = document.getElementById("pipVideoObject");
        videoNode.bindToCurrentChannel();
    } catch (e) {
        //$("#error").html(e.name + ": " + e.message);
    }
}
function removePicture(){
    $("youTube").html("");
}
/*---------------------------loading图的开启和关闭----------------------------*/
var loadingTag;
var $scrollLoading = $("#scrollLoading"),
    $leftScroll = $("#leftScroll"),
    $rightScroll = $("#rightScroll");
function startLoading(){
    $("#loadingImg").css("display","block");
    var isEnd = true;
    loadingTag = setInterval(function(){
        if(isEnd){
            isEnd = false;
            toRigthScroll();
            $scrollLoading.stop().animate({"left":104},2000,function(){
                toLeftScroll();
                $scrollLoading.stop().animate({"left":-104},2000,function(){
                    isEnd = true;
                });
            });
        }
    },500);
}
function clearLoading(){
    clearInterval(loadingTag);
    $scrollLoading.stop();
    $scrollLoading.css("left",-104);
    toRigthScroll();
    $("#loadingImg").css("display","none");
}
function toRigthScroll(){
    $leftScroll.css("visibility","visible");
    $rightScroll.css("visibility","hidden");
}
function toLeftScroll(){
    $leftScroll.css("visibility","hidden");
    $rightScroll.css("visibility","visible");
}
/*-------------------获取Cookie-----------------------*/
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    var source = document.cookie;

    if (source == "") {
        source = window.localStorage.cookie
    }
    if(source){
        if (arr = source.match(reg)) return unescape(arr[2]);
        else return null;
    }else{
        return false;
    }
}
/***--------------------图标默认加载试试-----------------*****/
function SomeJavaScriptCode(parm){
    var img = new Image();
    img.src = parm.src;
    img.onload = function(){
        img.onload = null;
        callbackOneImg.call(img);
    };
    img.onerror = function(){
        parm.src = " http://cache.zeasn.tv/webstatic/app_gallery_web/images/black.png";
    };
    function callbackOneImg(){
        parm.src =  this.src;
    }
}
