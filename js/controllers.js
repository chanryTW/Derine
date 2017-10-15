angular.module('app.controllers', [])

// 主頁面
.controller('derineCtrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {
    //查看目前登入狀況
    var user = firebase.auth().currentUser;
    if (user) {
      console.log("使用者已登入");
    } else {
      console.log("使用者未登入");
      open("/#/login",'_self');
    }

    var count = 0;
    
    var accessToken = "8f330cbcfadd4ebbbcff549d6ebb7fe9",
      baseUrl = "https://api.api.ai/v1/",
      $speechInput,
      recognition,
      messageRecording = "辨識中...",
      messageCouldntHear = "請再說一次",
      messageInternalError = "請輸入文字。",
      messageSorry = "說說別的";

	  //自動執行，全部DOM元素下載完就會觸發
    $(document).ready(function() {
      $speechInput = $("#speech");

      Start00001();
      document.getElementById("mymap").style.display="inline-block";

    });

    //手動Enter方式
    $("#speech").keypress(function(e){
      code = (e.keyCode ? e.keyCode : e.which);
      if (code == 13)
      {
        var text = document.getElementById("speech").value;   
        setInput(text);
      }
    });
    $("#btnSend").click(function(){
      var text = document.getElementById("speech").value;   
      setInput(text);
    });

    function startRecognition() { //開啟語音辨識
      recognition = new webkitSpeechRecognition(); //這裡採用HTML5語音辨識
      recognition.continuous = false;
          recognition.interimResults = false;

      recognition.onstart = function(event) { //開始辨識時會自動呼叫這個函數
        respond(messageRecording);
      };
      recognition.onresult = function(event) {//辨識到結果會呼叫這個函數
        recognition.onend = null;
        
        var text = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) { // 對於每一個辨識結果
            text += event.results[i][0].transcript;// 將其加入結果中
          }
          setInput(text);//呼叫setInput函數 設定文字方塊的文字 然後直接傳送給AI
        stopRecognition();//呼叫stopRecognition函數 關閉辨識
      };
      recognition.onend = function() {// 辨識完成時會自動呼叫這個函數
        respond(messageCouldntHear);
        stopRecognition();
      };
      recognition.lang = "cmn-Hant-TW";//語音語言 台灣cmn-Hant-TW
      recognition.start();//開始辨識
    }
  
    function stopRecognition() { //關閉辨識然後清空recognition
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
    }

    function switchRecognition() { //判斷開關語音辨識
      if (recognition) { //如果有辨識到東西 停止辨識，沒有則反之
        stopRecognition();
      } else {
        startRecognition();
      }
    }

    function setInput(text) {
      $speechInput.val(text);
      send();
    }

    function send() { //發送問題
      var text = $speechInput.val();
      $.ajax({
        type: "POST",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: text, lang: "zh-TW", sessionId: "21351"}),

        success: function(data) {
          prepareResponse(data);//傳到->prepareResponse函數
        },
        error: function() {
          respond(messageInternalError);
        }
      });
    }

    function prepareResponse(val) {
      var debugJSON = JSON.stringify(val, undefined, 2),//JSON.stringify 將JS值轉換成JSON字串 縮排2
        spokenResponse = val.result.speech;//截取出回答文字

      respond(spokenResponse);//傳到->respond函數 
      debugRespond(debugJSON);//傳到->debugRespond函數 把完整data放到右下角視窗內
    }

    function debugRespond(val) {//把完整data放到右下角視窗內
      $("#response").text(val);
    }

    function respond(val) {
      if (val == "") {
        val = messageSorry;
      }

      if (val !== messageRecording) { //不是"讀取中"那段文字的化
		var msg = new SpeechSynthesisUtterance();//語音念出文字
		msg.voiceURI = "native";
		msg.lang = "zh-TW";//語音語言
		msg.rate = "1";
		msg.pitch = "0.5";//音調0-2
		msg.volume = 1;//音量

		TestVal = val.substr(0,5);
		switch (TestVal) {
			case "00001": //定位
				val = "這是您目前的位置";
				msg.text = val;
				window.speechSynthesis.speak(msg);
				Start00001();
				break;
 			case "00002": //問地點
				var SearchKey = val.substr(5)
				Start00002(SearchKey);
				// 尚未完成 (無資料時的判定)
				val = "這些是您附近的" + SearchKey;
				msg.text = val;
				window.speechSynthesis.speak(msg);
				break;
      case "00003": //問天氣
        var SearchKey1 = val.substr(5,10);
      	var SearchKey2 = val.substr(16);
 			 	val = Start00003_7(SearchKey1,SearchKey2,3);
				msg.text = val;
				window.speechSynthesis.speak(msg);
				break;
      case "00004": //問天氣-有沒有下雨 要不要帶雨具
        var SearchKey1 = val.substr(5,10);
        var SearchKey2 = val.substr(16);
        val = Start00003_7(SearchKey1,SearchKey2,4);
        msg.text = val;
        window.speechSynthesis.speak(msg);
        break;
      case "00005": //問天氣-太陽大不大
        var SearchKey1 = val.substr(5,10);
        var SearchKey2 = val.substr(16);
        val = Start00003_7(SearchKey1,SearchKey2,5);
        msg.text = val;
        window.speechSynthesis.speak(msg);
        break;
      case "00006": //問天氣-冷熱
        var SearchKey1 = val.substr(5,10);
        var SearchKey2 = val.substr(16);
        val = Start00003_7(SearchKey1,SearchKey2,6);
        msg.text = val;
        window.speechSynthesis.speak(msg);
        break;
      case "00007": //問天氣-溫度
        var SearchKey1 = val.substr(5,10);
        var SearchKey2 = val.substr(16);
        val = Start00003_7(SearchKey1,SearchKey2,7);
        msg.text = val;
        window.speechSynthesis.speak(msg);
        break;
      case "00008": //問標籤 要進行標籤篩選
        var SearchKey = val.substr(5)
        Start00008(SearchKey);
        val = "幫您篩選出您可能有興趣的地點";
        msg.text = val;
        window.speechSynthesis.speak(msg);
        break;
      case "00009": //問日期
        var SearchKey = val.substr(5);
        val = Start00009(SearchKey);
        msg.text = val;
        window.speechSynthesis.speak(msg);
        break;
      case "00010"://搜尋功能 
        var SearchKey = val.substr(5);
        val = "好的，幫您搜尋"+SearchKey;
        msg.text = val;
        window.speechSynthesis.speak(msg);
        Start00010(SearchKey);
        break;
      case "00011": //導航功能
        var SearchKey = val.substr(5);
        val = "好的，幫您導航到"+SearchKey;
        msg.text = val;
        window.speechSynthesis.speak(msg);
        Start00011(SearchKey);
        break;

      case "99901": //模擬 林邊有什麼景點 假設人在林邊車站
        if (count % 2 == 0){
          val = "推薦您以下景點，一 福記古宅、距離550公尺，二 慈濟宮、距離290公尺，三 東隆宮、距離10公里";
          msg.text = val;
          window.speechSynthesis.speak(msg);
          Start00002("廟宇");
          count = count +1;
        }else{
          val = "推薦您以下景點，一 林邊光采濕地、距離43公里，二 海神宮風景區、距離59公里，三 大鵬灣國家風景區、距離45公里";
          msg.text = val;
          window.speechSynthesis.speak(msg);
          Start00002("公園");
          count = count +1; 
        }
        break;
			default:
			  msg.text = val;
			  window.speechSynthesis.speak(msg);
		}

      }

      if (val.length <= 3){
        $('.mwt_border').css({
          "width": "13%",          
          "height": "3%"
        });
      }else if (val.length <= 6){
        $('.mwt_border').css({
          "width": "25%",          
          "height": "3%"
        });
      }else if (val.length < 10){
        $('.mwt_border').css({
          "width": "40%",          
          "height": "3%"
        });
      }else if (val.length < 14){
        $('.mwt_border').css({
          "width": "56%",          
          "height": "3%"
        });
      }else if (val.length < 28){
        $('.mwt_border').css({
          "width": "56%",          
          "height": "6%"
        });
      }else if (val.length < 42) {
        $('.mwt_border').css({
          "width": "56%",  
          "height": "9%"
        });
      }else{
        $('.mwt_border').css({
          "width": "56%",          
          "height": "11.5%"
        });
      }
      $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);//放入回應
    }
  

    // --------------------------------------------------------------------------------------------------------------------------------------
    // Settings, available positions
    var points = $("li").toArray();
    var thisisit;

    // unwrapp a jquery element into a html element
    var myElement = $("button.fab").get(0);
    // create a new Hammer element
    var hammertime = new Hammer(myElement);

    // 依照視窗寬高計算比例
    var getheight = $(window).height();
    var getwidth = $(window).width();
    var newpositionleft;
    var newpositiontop;

    document.ontouchmove = function(event){
        event.preventDefault();
    }

    // FAB 的初始位置 (中間50,50;右下角90,85)
    //  var btnSendWidth =  423*(getheight/667);
    var btnSendWidth =  375*(getheight/667);
    

    $('.wrapp').css({
        "width": btnSendWidth+"px"
    });

    // 設定Hammer的手勢
    hammertime.get('press').set({ time: 500,threshold: 50, enable: true});
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL ,threshold: 0, velocity: 0 ,enable: false})
    //hammertime.get('tap').set({})

    hammertime.on('tap', function() {
        $('button.fab').animate({
            background: "rgb(255,255,255)"
        }, 500 );
        //點擊後動作在此
        switchRecognition()
    });

    // 按鈕定位
    function where(pointerleft,pointertop) {
        for(i = points.length - 1; i >= 1; i--){

                var topposition = points[i].offset.top;
                var leftposition = points[i].offset.left;

                // 檢查上和左位置
                if (    topposition <= pointertop && 
                        leftposition <= pointerleft)
                {
                
                // 用寬度和高度來計算區塊
                if (    pointerleft < leftposition + points[i].width && 
                        pointertop < topposition + points[i].height)
                                {
                                
                                // 檢查是否活動點
                                activestatus = $(`li#${points[i].id}`).hasClass('point-active');
                                if (activestatus === true){

                                    // 浮動效果
                                    $(`li#${points[i].id}`).addClass('point-hover');
                                    // 設定用於定位按鈕的變數
                                    thisisit = points[i].id;
                                }
                        else { $(`li#${points[i].id}`).removeClass('point-hover'); }       
                }
                else { $(`li#${points[i].id}`).removeClass('point-hover');}
            }
            else { $(`li#${points[i].id}`).removeClass('point-hover');}
            }
        }

    // 建立矩陣 正確數據
        function generate() {
            for (i = 0; i < points.length; i++ ){ 
                points[i].offset = $(`ul.layer li#${[i]}`).offset();
                points[i].width = $(`ul.layer li#${[i]}`).width();
                points[i].height = $(`ul.layer li#${[i]}`).height();
            };
        }

    // 當按鈕長按時
    hammertime.on('press', function(event) {

        // 淡入圖層
        $('div.raster').removeClass('hide');
        $('div.raster').fadeIn();                
        $('button.fab').addClass('elevated');

        // 呼叫函數填入數值
        generate();

        //position the pointer and FAB, call the posioning function
        pointerleft = event.pointers[0].pageX;
        pointertop = event.pointers[0].pageY;
        where(pointerleft,pointertop);
        
        hammertime.get('pan').set({enable: true})
        //開啟Hammer拖曳
        hammertime.on('panmove', function(event) {
            
            //position the pointer and FAB, call the posioning function
            pointertop = event.pointers[0].pageY;
            pointerleft = event.pointers[0].pageX;

            $('button.fab').css( "top", event.pointers[0].pageY -30 );
            $('button.fab').css( "left", event.pointers[0].pageX -30 );

            //呼叫定位函數，新位置
            where(pointerleft,pointertop);
        
        }); 

    });

    // FAB發布
    hammertime.on('panend pressup', function() {

        var elementsizew = points[thisisit].width;
        var elementsizeh = points[thisisit].height;
        var elementpositiontop = points[thisisit].offset.top;
        var elementpositiontleft = points[thisisit].offset.left;
        
        newpositiontop = (elementsizeh / 2 + Math.round(elementpositiontop)) / (getheight / 100) - (30 / (getheight / 100));
        newpositionleft = (elementsizew / 2 + Math.round(elementpositiontleft)) / (getwidth / 100) - (30 / (getwidth / 100));
        // removing classes in jQuery
        $('button.fab').removeClass('highlight');
        $('button.fab').removeClass('elevated');    
        $('div.raster').fadeOut();  

        $('button.fab').css( "top", (newpositiontop + "%") );
        $('button.fab').css( "left", (newpositionleft + "%") );
        $('button.fab').css( "transition", "top 100ms ease-in 0" );

        hammertime.get('pan').set({enable: false})
    });

    // --------------------------------------------------------------------------------------------------------------
    // ***************** Start00001 定位 *****************
    function Start00001() { 
        getGeolocation(); //取得使用者目前位罝
        function getGeolocation() {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(parsePosition);
            }
        }
        function parsePosition(pos) {
            //由pos.coords取出latitude及longitude
            var curLatLng = new google.maps.LatLng(
                pos.coords.latitude, pos.coords.longitude);
            
            //創建新地圖
            var gc = new google.maps.Geocoder();
            var mymap = new google.maps.Map($('#mymap').get(0), {
                zoom: 15,
                center: curLatLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: true
            });
            
            //加入使用者所在位置
            var marker = new google.maps.Marker({
                position: curLatLng,
                title: "現在位置",
                icon: icon1,
                map: mymap
            });
        }
    }

    // ***************** Start00002 問地點 *****************
    function Start00002(SearchKey) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
            
            var map = new google.maps.Map(document.getElementById('mymap'), {
            center: currentLocation,
            zoom: 14
            });

            var service = new google.maps.places.PlacesService(map);
            var query = {
            location: currentLocation,
            radius: '1500',
            keyword: SearchKey
            }; 
            
            service.radarSearch(query, searchResults); 
            var currentPosition = new google.maps.Marker({
            position: currentLocation,
            map: map,
            label: '現在位置',
            });

            function searchResults(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var aims = results.slice(0, 4);
                for (var i = 0; i < results.length; i++) {
                aims.forEach(createMarker);
                } 
            } 
            else if (status === "ZERO_RESULTS") {
                alert('沒有');
            } 
            else {
                alert('系統錯誤，請重新再試');
            } 
            }

            var infoWINDOW;
            
            function createMarker(place) {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
            }); 

            google.maps.event.addListener(marker, 'click', function() {
                if (infoWINDOW) { infoWINDOW.close(); }
                var infowindow = new google.maps.InfoWindow();
                
                infoWINDOW = infowindow;
                infowindow.open(map, this);

                service.getDetails(place, function(details, status){
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    infowindow.setContent('<div class="place-name"><font size="4">' + details.name + '</font></div>' + 
                    '<div class="place-info">地址：' + details.vicinity + '</div>' +
                    '<div class="place-info">電話：' + details.formatted_phone_number + '</div>' + 
                    '<div class="place-info">評價：' + details.rating + '</div><button class="btn01">點我評分</button><br><img src="' + details.photos[0].getUrl({'maxWidth': 110, 'maxHeight': 110}) +'"><br>');
                } 
                console.log(details.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150}));
                }); 
                
                
            }); 
            } 
        }); 
    } 

    // ***************** Start00003~7 天氣事件 *****************
    function Start00003_7(SearchKey1,SearchKey2,TestVal) {  
        var Today=new Date();    

        if (SearchKey1.substr(0,2) == "今天") {
            SearchKey2 = SearchKey1.substr(3);
            SearchKey1 = Number(Today.getDate()); 
        }else{
            SearchKey1 = Number(SearchKey1.substr(8));     
        }

        // 設定一周內的日期，使用日期加法 解決超過月底會繼續加數字問題。
        var dd = Number(Today.getDate());   
        Today.setDate(Today.getDate() + 1);
        var dd1  = Today.getDate();
        Today.setDate(Today.getDate() + 1);
        var dd2  = Today.getDate();
        Today.setDate(Today.getDate() + 1);
        var dd3  = Today.getDate();
        Today.setDate(Today.getDate() + 1);
        var dd4  = Today.getDate();
        Today.setDate(Today.getDate() + 1);
        var dd5  = Today.getDate();
        Today.setDate(Today.getDate() + 1);
        var dd6  = Today.getDate();

        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+SearchKey2+"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        var msg = "";
        var rain = "";
        var sun = "";
        var hotcold = "";
        $.ajax({
            url:url,
            async: false,
            dataType: 'json',
            success: function(data) {
            var weather = function(w) {
                console.log(w);        
                var weatherText = "";
                switch (w) {
                case 'Thunderstorms':
                    weatherText = '可能有雷雨';
                    rain = '請記得攜帶雨具';
                    sun = '不會出太陽，請記得攜帶雨具';
                    break;
                case 'Scattered Thunderstorms':
                    weatherText = '有局部雷雨';
                    rain = '請記得攜帶雨具';
                    sun = '不會出太陽，請記得攜帶雨具';
                    break;
                case 'Showers':
                    weatherText = '請注意陣雨';
                    rain = '並記得攜帶雨具';
                    sun = '不會出太陽，請記得攜帶雨具';
                    break;
                case 'Mostly Cloudy':
                    weatherText = '晴時多雲';
                    rain = '不會下雨';
                    sun = '太陽不大，出遊好天氣';
                    break;
                case 'Scattered Showers':
                    weatherText = '會有局部陣雨';
                    rain = '請記得攜帶雨具';
                    sun = '太陽不大，請記得攜帶雨具';
                    break;
                case 'Partly Cloudy':
                    weatherText = '局部有雲';
                    rain = '可能會下雨';
                    sun = '太陽不大';
                    break;
                case 'Rain':
                    weatherText = '會下雨';
                    rain = '請記得攜帶雨具';
                    sun = '不會出太陽，請記得攜帶雨具';
                    break;
                case 'Cloudy':
                    weatherText = '多雲';
                    rain = '但不會下雨';
                    sun = '太陽不大';
                    break;
                case 'Mostly Sunny':
                    weatherText = '是晴天';
                    rain = '不會下雨';
                    sun = '太陽露臉，注意防曬';
                    break;
                case "Sunny":
                    weatherText = "晴空萬里";
                    rain = '不會下雨';
                    sun = '太陽較大，注意防曬';
                    break;
                case 'Mostly Clear':
                    weatherText = '是晴天';
                    rain = '不會下雨';
                    sun = '太陽露臉，注意防曬';
                    break;
                }
                return weatherText;
            };

            var week = function(w) {
                var weekText = "";
                switch (w) {
                case 'Sun':
                    weekText = '星期日';
                    break;
                case 'Mon':
                    weekText = '星期一';
                    break;
                case 'Tue':
                    weekText = '星期二';
                    break;
                case 'Wed':
                    weekText = '星期三';
                    break;
                case 'Thu':
                    weekText = '星期四';
                    break;
                case 'Fri':
                    weekText = '星期五';
                    break;
                case 'Sat':
                    weekText = '星期六';
                    break;
                }
                return weekText;
            };

            switch (SearchKey1) {
                case dd:
                Today="今天";
                var temp = Math.floor((data.query.results.channel.item.condition.temp - 32) * 5 / 9)+"度";
                var WeatherStatus = weather(data.query.results.channel.item.condition.text);
                break;
                case dd1:
                Today="明天";
                var temp = Math.floor((data.query.results.channel.item.forecast[1].low - 32) * 5 / 9 + 5)+"到"+Math.floor((data.query.results.channel.item.forecast[1].high - 32) * 5 / 9)+"度之間";
                var WeatherStatus = weather(data.query.results.channel.item.forecast[1].text);
                break;
                case dd2:
                Today="後天";
                var temp = Math.floor((data.query.results.channel.item.forecast[2].low - 32) * 5 / 9 + 5)+"到"+Math.floor((data.query.results.channel.item.forecast[2].high - 32) * 5 / 9)+"度之間";
                var WeatherStatus = weather(data.query.results.channel.item.forecast[2].text);
                break;
                case dd3:
                Today= String(week(data.query.results.channel.item.forecast[3].day));
                var temp = Math.floor((data.query.results.channel.item.forecast[3].low - 32) * 5 / 9 + 5)+"到"+Math.floor((data.query.results.channel.item.forecast[3].high - 32) * 5 / 9)+"度之間";
                var WeatherStatus = weather(data.query.results.channel.item.forecast[3].text);
                break;
                case dd4:
                Today= String(week(data.query.results.channel.item.forecast[4].day));
                var temp = Math.floor((data.query.results.channel.item.forecast[4].low - 32) * 5 / 9 + 5)+"到"+Math.floor((data.query.results.channel.item.forecast[4].high - 32) * 5 / 9)+"度之間";
                var WeatherStatus = weather(data.query.results.channel.item.forecast[4].text);
                break;
                case dd5:
                Today= String(week(data.query.results.channel.item.forecast[5].day));
                var temp = Math.floor((data.query.results.channel.item.forecast[5].low - 32) * 5 / 9 + 5)+"到"+Math.floor((data.query.results.channel.item.forecast[5].high - 32) * 5 / 9)+"度之間";
                var WeatherStatus = weather(data.query.results.channel.item.forecast[5].text);
                break;
                case dd6:
                Today= String(week(data.query.results.channel.item.forecast[6].day));
                var temp = Math.floor((data.query.results.channel.item.forecast[6].low - 32) * 5 / 9 + 5)+"到"+Math.floor((data.query.results.channel.item.forecast[6].high - 32) * 5 / 9)+"度之間";
                var WeatherStatus = weather(data.query.results.channel.item.forecast[6].text);
                break;
            }
            
            if (temp.substr(0,2)>=26){
                hotcold = '比較炎熱';
            }else if (temp.substr(0,2)>=20) {
                hotcold = '溫度適中';
            }else if (temp.substr(0,2)>=12) {
                hotcold = '溫度涼爽';
            }else if (temp.substr(0,2)>=0) {
                hotcold = '有點冷，請注意保暖';
            }else {
                hotcold = '非常冷';
            }

            switch (TestVal){
                case 3:
                msg = Today + SearchKey2 + '的溫度是'+ temp +'，'+ WeatherStatus;
                break;
                case 4:
                msg = Today + SearchKey2 + '的溫度是'+ temp +'，'+ WeatherStatus + '，' + rain;
                break;
                case 5:
                msg = Today + SearchKey2 + '的溫度是'+ temp +'，'+ WeatherStatus + '，' + sun;
                break;
                case 6:
                msg = Today + SearchKey2 + '的溫度是'+ temp +'，'+ hotcold;
                break;
                case 7:
                msg = Today + SearchKey2 + '的溫度是'+ temp;
                break;
            }

            }
        });
        return msg;
    }

    // ***************** Start00008 標籤篩選 *****************
    function Start00008(SearchKey) {
        // 這裡用舊版寫法 練習
        var xmlhttp;

        function $_xmlHttpRequest(){   
            if(window.ActiveXObject){
                xmlHTTP=new ActiveXObject("Microsoft.XMLHTTP");
            }
            else if(window.XMLHttpRequest){
                xmlHTTP=new XMLHttpRequest();
            }
        }

        $_xmlHttpRequest();
        xmlHTTP.open("GET","/api8/js/a00008.php?SearchKey="+SearchKey,true);
        
        xmlHTTP.onreadystatechange=function check_user(){
            if(xmlHTTP.readyState == 4){
                if(xmlHTTP.status == 200){
                    document.getElementById("test001").innerHTML=xmlHTTP.responseText;
                }
            }
        }
        xmlHTTP.send(null);
    }

    // ***************** Start00009 問日期 *****************
    function Start00009(SearchKey) {
        // 年
        var yy = SearchKey.substr(0,4);
        // 月
        var mm = SearchKey.substr(5,2);
        if (mm.substr(0,1)==0){
            mm = mm.substr(1);
        }
        // 日
        var dd = SearchKey.substr(8);
        if (dd.substr(0,1)==0){
            dd = dd.substr(1);
        }
        // 星期
        var week = new Array("日","一","二","三","四","五","六");
        var SearchKeyDate  = new Date(SearchKey);

        // 判斷今明後天用
        var ddToday = Number(SearchKey.substr(8));

        // 設定今明後天的日期，使用日期加法 解決超過月底會繼續加數字問題。
        var Today=new Date();
        console.log(Today);
        var dd0 = Today.getDate();
        Today.setDate(Today.getDate() + 1);
        var dd1  = Today.getDate();
        Today.setDate(Today.getDate() + 1);
        var dd2  = Today.getDate();
        Today.setDate(Today.getDate() + 1);

        switch (ddToday) {
            case dd0:
            Today="今天是";
            
            break;
            case dd1:
            Today="明天是";
            
            break;
            case dd2:
            Today="後天是";
            
            break;
            default:
            Today="";
            
            break;
        }
        msg = Today + yy +'年'+ mm +'月'+ dd +'日 星期'+ week[SearchKeyDate.getDay()];
        return msg;
    }

    // ***************** Start00010 Google搜尋資料 *****************
    function Start00010(SearchKey) {
        // $.ajax({
        //   method : 'POST',
        //   url : 'test.js',
        //   data : {
        //     data1 : '1',
        //     data2 : '2'
        //   }
        // }).done(function(msg){
        //   console.log(msg);
        // });
        open('https://www.google.com.tw/search?q='+SearchKey,'_self');
    }

    // ***************** Start00011 導航 *****************
    function Start00011(SearchKey) {
        getGeolocation(); //取得使用者目前位罝
            function getGeolocation() {
                if (navigator && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(parsePosition);
                }
            }
            function parsePosition(pos) {
                //由pos.coords取出latitude及longitude
                var curLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            open("https://www.google.com.tw/maps/dir/"+curLatLng+"/"+SearchKey,'_self');
        }
    }

    // Map icon

    var icon1 = {
                url: "img/MarkerPictures/red-circle.png",
                scaledSize: new google.maps.Size(40, 40),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 0)
    };

    var icon2 = {
                url: "img/MarkerPictures/blu-circle.png",
                scaledSize: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 0)
    };





}])
   
.controller('page7Ctrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {


}])
   
.controller('page8Ctrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {


}])
   
.controller('page9Ctrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {


}])

// ----------------------------------------選單頁面----------------------------------------
.controller('menuCtrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {
    // 登出
    var signOutSmtBtn = document.getElementById("menu-list-item5");
    signOutSmtBtn.addEventListener("click",function(){
        firebase.auth().signOut().then(function() {
            console.log("登出成功");
        }).catch(function(error) {
            console.log("登出發生錯誤!");
        });
    },false);
        
}])

// ----------------------------------------登入頁面----------------------------------------
.controller('page4Ctrl', ['$scope', '$stateParams', '$ionicPopup',
function ($scope, $stateParams, $ionicPopup) {
    
    // 登入
    var accountL = document.getElementById("page4-input1");
    var pwdL = document.getElementById("page4-input2");
    var loginSmtBtn = document.getElementById("page4-button1");
    loginSmtBtn.addEventListener("click",function(){
        console.log(accountL.value);
        firebase.auth().signInWithEmailAndPassword(accountL.value, pwdL.value).then(function(){
            console.log("登入成功");
            open("/#/menu/Derine",'_self');
            // window.location.reload();
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            switch(errorCode){
                case 'auth/user-not-found':
                    var alertPopup = $ionicPopup.alert({
                        title: '發生錯誤',
                        template: '查無此帳號。'
                    });
                        alertPopup.then(function(res) {
                        accountL.value="";
                        pwdL.value="";
                    });
                    break;
                case 'auth/invalid-email':
                    var alertPopup = $ionicPopup.alert({
                        title: '發生錯誤',
                        template: '電子信箱的格式有誤。'
                    });
                        alertPopup.then(function(res) {
                        accountL.value="";
                    });
                    break;
                case 'auth/wrong-password':
                    var alertPopup = $ionicPopup.alert({
                        title: '發生錯誤',
                        template: '密碼錯誤，如忘記密碼請點選下方忘記密碼。'
                    });
                        alertPopup.then(function(res) {
                        pwdL.value="";
                    });
                    break;
            }
        })
    },false);

}])
   

.controller('page5Ctrl', ['$scope', '$stateParams',
function ($scope, $stateParams) {


}])

// ----------------------------------------註冊頁面----------------------------------------
.controller('page6Ctrl', ['$scope', '$stateParams', '$ionicPopup',
function ($scope, $stateParams, $ionicPopup) {  
    //Email/Pwd註冊
    var account = document.getElementById("page6-input2"); //電子信箱
    var pwd = document.getElementById("page6-input3"); //密碼
    var pwd2 = document.getElementById("page6-input4"); //確認密碼
    var registerSmtBtn = document.getElementById("page6-button1");
    registerSmtBtn.addEventListener("click",function(){
        if (pwd.value == pwd2.value) {
            firebase.auth().createUserWithEmailAndPassword(account.value, pwd.value).then(function(){
                console.log("成功註冊");
                account.value="";
                pwd.value="";
                pwd2.value="";
                open("/#/menu/Derine",'_self');
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMsg = error.message;
                console.log(errorCode);
                console.log(errorMsg);
                switch(errorCode){
                    case 'auth/invalid-email':
                        var alertPopup = $ionicPopup.alert({
                            title: '發生錯誤',
                            template: '電子信箱的格式有誤。'
                        });
                            alertPopup.then(function(res) {
                            account.value="";
                        });
                        break;
                    case 'auth/weak-password':
                        var alertPopup = $ionicPopup.alert({
                            title: '發生錯誤',
                            template: '為了您帳戶安全，密碼請超過6碼。'
                        });
                            alertPopup.then(function(res) {
                            pwd.value="";
                            pwd2.value="";
                        });
                        break;
                    case 'auth/email-already-in-use':
                        var alertPopup = $ionicPopup.alert({
                            title: '發生錯誤',
                            template: '此電子信箱已被註冊過，如忘記密碼請點選登入頁面的忘記密碼。'
                        });
                            alertPopup.then(function(res) {
                            account.value="";
                            pwd.value="";
                            pwd2.value="";
                        });
                        break;
                }
            })
        } else {
            var alertPopup = $ionicPopup.alert({
                title: '發生錯誤',
                template: '密碼和確認密碼不一致，請重新輸入。'
            });
                alertPopup.then(function(res) {
                pwd.value="";
                pwd2.value="";
            });
        }
    },false);


}])
 