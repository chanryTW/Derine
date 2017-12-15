angular.module('app.controllers', [])

// ----------------------------------------主頁面----------------------------------------
.controller('derineCtrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {
    // 驗證登入
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) { //登入成功，取得使用者
            console.log("已登入狀態");
            // 記錄登入
            var db = firebase.database();
            var Today=new Date(); 
            // 取得 UTC time
            utc = Today.getTime() + (Today.getTimezoneOffset() * 60000);
            db.ref("/登入記錄/").push({記錄: "用戶 "+user.uid+" 登入於 "+Date(utc + (3600000*8))},
            function(error) {
                if (error){
                    console.log("記錄登入記錄失敗");
                    console.log(error);
                }
                else{
                    console.log("記錄登入記錄成功");
                }
            });
            // 儲存uid，之後讀取與寫入資料用
            localStorage.setItem("uid", user.uid);
            // 更新使用者資料
            if (localStorage.getItem("LoginWay")=="registered") {
                // 上傳大頭照功能
                if(document.getElementById("page6-uploadFileInput").files[0]){
                    var page6uploadFileInput = document.getElementById("page6-uploadFileInput");
                    var file = page6uploadFileInput.files[0];
                    var storage = firebase.storage();
                    var storageRef = storage.ref();
                    var uploadTask = storageRef.child('images/'+user.uid).put(file);
                    uploadTask.on('state_changed', function(snapshot){
                        // 取得檔案上傳狀態，並用數字顯示
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('已上傳 ' + progress + '%');
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: 
                            console.log('上傳暫停');
                            break;
                            case firebase.storage.TaskState.RUNNING: 
                            console.log('上傳中');
                            break;
                        }
                    }, function(error) {
                        console.log("上傳失敗");
                        console.log(error);
                    }, function() {
                        console.log("上傳成功");
                        // 更新menu的大頭照
                        var storage = firebase.storage();
                        var storageRef = storage.ref();
                        storageRef.child('images/'+localStorage.getItem("uid")).getDownloadURL().then(function(url) {
                            document.getElementById("menu-img").src=url;
                        })
                    });
                }
                // 新用戶，存入DB資料
                var UserName = document.getElementById("page6-input1"); //暱稱
                var account = document.getElementById("page6-input2"); //電子信箱
                var db = firebase.database();
                db.ref("/使用者/" + user.uid).update({暱稱: UserName.value,帳號: account.value},
                function(error) {
                    if (error){
                        console.log("新用戶，建立DB失敗");
                        console.log(error);
                    }
                    else{
                        console.log("新用戶，建立DB成功");
                    }
                });
                // 清空註冊頁面的資料
                UserName.value = "";
                account.value = "";
            } else {
                console.log('非新用戶');
            }
            // 更新menu的大頭照
            var storage = firebase.storage();
            var storageRef = storage.ref();
            storageRef.child('images/'+localStorage.getItem("uid")).getDownloadURL().then(function(url) {
                document.getElementById("menu-img").src=url;
            })
            // 更新選單的暱稱
            var userId = localStorage.getItem("uid");
            return firebase.database().ref('/使用者/' + userId).once('value').then(function(snapshot) {
                var username = (snapshot.val() && snapshot.val().暱稱) || 'Anonymous';
                // 儲存uid，之後讀取與寫入資料用
                localStorage.setItem("username", username);
                document.getElementById("menu-heading1").innerText = username; 
                document.getElementById("spoken-response__text").innerText = "哈囉 "+username+"，我是Derine~"; 
            });
        }else{
            console.log("尚未登入");
            // open("/#/login",'_self');
        }
    });
    

    // 存入使用者暱稱供存取
    var username = localStorage.getItem("username");
    // 設定文字輸入框位置
    $('#derine_text').css('top', window.innerHeight-116+'px');
    // --------------------------------------------------------------------------------------------------------------    

    var count = 0;
    // 臨時
    // var accessToken = "ad8d1f715e7c410e86e644e953239b2e",
    // 原版
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
    //   Start00001();
      document.getElementById("mymap").style.display="inline-block";

    });

    //手動Enter方式 !!!!!!!!!!!!!!!!!!!!!!!!!
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
      // 隱藏辨識動畫  
      $(".loaderBox").hide();
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
				val = "這是"+username+"目前的位置";
				msg.text = val;
				window.speechSynthesis.speak(msg);
				Start00001();
				break;
 			case "00002": //問地點
				var SearchKey = val.substr(5)
				Start00002(SearchKey);
				// 尚未完成 (無資料時的判定)
				val = "這些是"+username+"附近的" + SearchKey;
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
                val = "幫"+username+"篩選出您可能有興趣的地點";
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
                    val = "推薦"+username+"以下景點，一 福記古宅、距離550公尺，二 慈濟宮、距離290公尺，三 東隆宮、距離10公里";
                    msg.text = val;
                    window.speechSynthesis.speak(msg);
                    Start00002("廟宇");
                    count = count +1;
                }else{
                    val = "推薦"+username+"以下景點，一 林邊光采濕地、距離43公里，二 海神宮風景區、距離59公里，三 大鵬灣國家風景區、距離45公里";
                    msg.text = val;
                    window.speechSynthesis.speak(msg);
                    Start00002("公園");
                    count = count +1; 
                }
                break;
            case "00013": //評分系統
                var SearchKey = val.substr(5);
                val = "評分系統測試中"+SearchKey;
                msg.text = val;
                window.speechSynthesis.speak(msg);
                Start00013(SearchKey);
                break;
            case "00014": //放音樂
                var SearchKey = val.substr(5);
                val = "好的，幫您播放"+SearchKey;
                msg.text = val;
                window.speechSynthesis.speak(msg);
                Start00014(SearchKey);
                break;
            case "00015": //推薦系統
                var SearchKey = val.substr(5);
                val = Start00015(SearchKey);
                msg.text = val;
                window.speechSynthesis.speak(msg);
                break;
            case "00016": //問自己是誰
                val = "當然"+username+"，我可是你的貼身助理呢";
                msg.text = val;
                window.speechSynthesis.speak(msg);
                Start00016(SearchKey);
                break;
            case "00017": //放專題影片
                val = "呵呵沒問題，下面這個就是以我為主角的影片";
                msg.text = val;
                window.speechSynthesis.speak(msg);
                Start00017();
                break;
            default:
                msg.text = val;
                window.speechSynthesis.speak(msg);
		}
      }
      
      $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);//放入回應
    }
  
    // 語音按鈕事件 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    $('#fab').click(function(e){
        // 開啟辨識
        switchRecognition();
        // 隱藏影片
        $("#muteYouTubeVideoPlayer").hide();
        // 隱藏地圖
        $("#mymap").hide();
        // 辨識動畫
        FabAnimated();
        $(".loaderBox").show();
    });

    // 辨識動畫
    var loaderCount=0;
    function FabAnimated() {
        $.fn.loader = function (options) {
            // default options
            var opts = $.extend({
                color: '#ffffff',
                shadowColor: '#ffffff',
                pieceCount: 27,
                syncPiecesAndIterations: true
              }, options);
            
            return this.filter('div.loader').each(function () {
              var $el = $(this);
              for (var x = 0; x < opts.pieceCount; x++) {
                (function (iteration) {
                  // calculate the animation delay
                  var delay = (iteration * 0.86);
                  delay = opts.syncPiecesAndIterations ? delay / opts.pieceCount : -delay;
                  delay += 's';
                  
                  var color = opts.color;
                  var shadowColor = opts.shadowColor;
                  
                  // build and append a piece of the loading indicator
                  $el.append(
                    $('<i>')
                      .text(' ')
                      .css('background-color', color)
                      .css('animation-delay', delay)
                      .css('box-shadow', '0 0 10px ' + shadowColor)
                  );
                })(x);
              }
            });
        }
        if (loaderCount==0){
            $('.loader').loader();
            loaderCount=loaderCount+1;
        }
    }
        
    // --------------------------------------------------------------------------------------------------------------
    // ***************** Start00001 定位 *****************
    function Start00001() { 
        $("#mymap").show();
        getGeolocation(); //取得使用者目前位罝
        function getGeolocation() {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(parsePosition);
            }
        }
        function parsePosition(pos) {
            //由pos.coords取出latitude及longitude
            var curLatLng = new google.maps.LatLng(
                // 22.431242, 120.515368);
                // 22.725829, 120.313716);
                pos.coords.latitude, pos.coords.longitude);
            
            //創建新地圖
            var gc = new google.maps.Geocoder();
            var mymap = new google.maps.Map($('#mymap').get(0), {
                zoom: 14,
                center: curLatLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: true,
                mapTypeControl: false
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
        $("#mymap").show();        
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
            // var currentLocation = {lat: 22.725829, lng: 120.313716};
            
            var map = new google.maps.Map(document.getElementById('mymap'), {
            center: currentLocation,
            zoom: 14,
            mapTypeControl: false
            // ,disableDefaultUI:"disabled"
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
            icon: icon1,
            });

            function searchResults(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var aims = results.slice(0, 5);
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
                icon: icon2,
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
                    '<div class="place-info">評價：' + details.rating + '</div><button class="btn01 button button-block button-energized">點我評分</button><br><img src="' + details.photos[0].getUrl({'maxWidth': 200}) +'"><br>');
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
                // 由pos.coords取出latitude及longitude
                var curLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                // var curLatLng = new google.maps.LatLng(22.725829, 120.313716);
            open("https://www.google.com.tw/maps/dir/"+curLatLng+"/林邊"+SearchKey,'_self');
            }
    }

    // ***************** Start00012 翻譯 *****************
    
    // ***************** Start00013 評分系統 *****************
    function Start00013(SearchKey) {
        
    }

    // ***************** Start00014 放音樂/影片 *****************
    function Start00014(SearchKey) {
        $("#muteYouTubeVideoPlayer").show();

        loadYoutubeService(SearchKey);
        //向google 使用youtube服務
        function loadYoutubeService(SearchKey) {
            gapi.client.load('youtube', 'v3', function() {
                gapi.client.setApiKey('AIzaSyAEI2ThqWR-jOzB5lLoVD0WwXku8HS4fCA');
                search(SearchKey);
            });
        }
        //搜尋影片
        function search(SearchKey) {
            //https://developers.google.com/youtube/v3/docs/search/list#maxResults
            var request = gapi.client.youtube.search.list({
                part: 'snippet',
                q: SearchKey,
                maxResults: 1
            });

            request.execute(function(response) {
                //將結果把所需部分進行擷取
                $.each(response.items, function(i, item) {
                    if (!item['id']['playlistId']) {
                        var musicCard = {};
                        musicCard._id = item['id']['videoId'];
                        //自動播放影片    
                        var player = new YT.Player('muteYouTubeVideoPlayer', {
                            videoId: musicCard._id, // YouTube 影片ID
                                playerVars: {
                                autoplay: 1,        // 在讀取時自動播放影片
                                controls: 1,        // 在播放器顯示暫停／播放按鈕
                                showinfo: 1,        // 影片標題
                                modestbranding: 1,  // 隱藏YouTube Logo
                                loop: 1,            // 讓影片循環播放
                                fs: 0,              // 隱藏全螢幕按鈕
                                cc_load_policty: 0, // 隱藏字幕
                                iv_load_policy: 3,  // 隱藏影片註解
                                autohide: 0         // 當播放影片時隱藏影片控制列
                            },
                            events: {
                                onReady: function(e) {
                                    e.target.mute();
                                }
                            }
                        });             
                    }
                });
            });
        }        
    }

    // ***************** Start00015 推薦系統 *****************
    function Start00015(SearchKey) {
        var resp1="";
        $.ajax({
            // url: "http://192.168.43.170:5000/data/",
            url: "http://120.119.164.95:7516/data/",
            async: false,
            type: "POST",
            data: {
                "userid": localStorage.getItem("uid"),
                "category": SearchKey
            },
            success: function(resp){
                resp1 = resp.category+"，一，"+resp.Attraction1+"，二，"+resp.Attraction2+"，三，"+resp.Attraction3+"，四，"+resp.Attraction4+"，五，"+resp.Attraction5;
                // 秀地圖
                $("#mymap").show();        
                // navigator.geolocation.getCurrentPosition(function(position) {
                //     var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
                    
                //     var map = new google.maps.Map(document.getElementById('mymap'), {
                //     center: currentLocation,
                //     zoom: 13,
                //     mapTypeControl: false
                //     // ,disableDefaultUI:"disabled"
                //     });

                //     var service = new google.maps.places.PlacesService(map);
                //     var query = {
                //     location: currentLocation,
                //     radius: '2000',
                //     keyword: resp.category
                //     }; 
                    
                //     service.radarSearch(query, searchResults); 
                //     var currentPosition = new google.maps.Marker({
                //     position: currentLocation,
                //     map: map,
                //     icon: icon1,
                //     });

                //     function searchResults(results, status) {
                //     if (status === google.maps.places.PlacesServiceStatus.OK) {
                //         var aims = results.slice(0, 5);
                //         for (var i = 0; i < results.length; i++) {
                //         aims.forEach(createMarker);
                //         } 
                //     } 
                //     else if (status === "ZERO_RESULTS") {
                //         alert('沒有');
                //     } 
                //     else {
                //         alert('系統錯誤，請重新再試');
                //     } 
                //     }

                //     var infoWINDOW;
                    
                //     function createMarker(place) {
                //     var marker = new google.maps.Marker({
                //         map: map,
                //         icon: icon2,
                //         position: place.geometry.location,
                //     }); 

                //     google.maps.event.addListener(marker, 'click', function() {
                //         if (infoWINDOW) { infoWINDOW.close(); }
                //         var infowindow = new google.maps.InfoWindow();
                        
                //         infoWINDOW = infowindow;
                //         infowindow.open(map, this);

                //         service.getDetails(place, function(details, status){
                //         if (status === google.maps.places.PlacesServiceStatus.OK) {
                //             infowindow.setContent('<div class="place-name"><font size="4">' + details.name + '</font></div>' + 
                //             '<div class="place-info">地址：' + details.vicinity + '</div>' +
                //             '<div class="place-info">電話：' + details.formatted_phone_number + '</div>' + 
                //             '<div class="place-info">評價：' + details.rating + '</div><button class="btn01 button button-block button-energized">點我評分</button><br><img src="' + details.photos[0].getUrl({'maxWidth': 200}) +'"><br>');
                //         } 
                //         console.log(details.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150}));
                //         }); 
                        
                        
                //     }); 
                //     } 
                // }); 
                navigator.geolocation.getCurrentPosition(function(position) {
                    var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
                    var map = new google.maps.Map(document.getElementById('mymap'), {
                    zoom: 13,
                    center:  currentLocation
                    });
                
                    var labels = '123456789';
                
                    
                    
                    var markers = locations.map(function(location, i) {
                    return new google.maps.Marker({
                        position: location,
                        label: labels[i % labels.length]
                    });
                    });
                
                    var markerCluster = new MarkerClusterer(map, markers,
                        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
                
                }); 
                console.log(resp);
                var locations = [
                    {lat: Number(resp.longitude1), lng: Number(resp.latitude1)},
                    {lat: Number(resp.longitude2), lng: Number(resp.latitude2)},
                    {lat: Number(resp.longitude3), lng: Number(resp.latitude3)},
                    {lat: Number(resp.longitude4), lng: Number(resp.latitude4)},
                    {lat: Number(resp.longitude5), lng: Number(resp.latitude5)}
                    ]
            }
        });

        

        // 回傳語句
        return "依照"+localStorage.getItem("username")+"的偏好，推薦您以下"+resp1;
        

        // ---這段是從FB去撈經緯度資料---
        // 從Firebase擷取資料
        // var db = firebase.database();
        // db.ref("景點資料/").on("value", function(snap) {
        //     var data = snap.val();
        //     console.log(data);
        //     $("#mymap").show(); 
        //     navigator.geolocation.getCurrentPosition(function(position) {
        //         var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
        //         var map = new google.maps.Map(document.getElementById('mymap'), {
        //         zoom: 8,
        //         center: currentLocation
        //         });
            
        //         var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
        //         var locations = [
        //         {lat: data.經度, lng: data.緯度},
        //         {lat: -33.718234, lng: 150.363181},
        //         {lat: -33.727111, lng: 150.371124},
        //         {lat: -33.848588, lng: 151.209834},
        //         {lat: -33.851702, lng: 151.216968}
        //         ]
                
        //         var markers = locations.map(function(location, i) {
        //         return new google.maps.Marker({
        //             position: location,
        //             label: labels[i % labels.length]
        //         });
        //         });
            
        //         var markerCluster = new MarkerClusterer(map, markers,
        //             {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            
        //     }); 
        // }, function(err) {
        //     alert('取得資料失敗！');
        // }); 

        // ---這段是假資料---
        // $("#mymap").show(); 
        // navigator.geolocation.getCurrentPosition(function(position) {
        //     var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
        //     var map = new google.maps.Map(document.getElementById('mymap'), {
        //     zoom: 13,
        //     center:  {lat: -33.718234, lng: 150.363181}
        //     });
        
        //     var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
            
            
        //     var markers = locations.map(function(location, i) {
        //     return new google.maps.Marker({
        //         position: location,
        //         label: labels[i % labels.length]
        //     });
        //     });
        
        //     var markerCluster = new MarkerClusterer(map, markers,
        //         {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        
        // }); 
        // var locations = [
        //     {lat: -33.718234, lng: 150.363181},
        //     {lat: -33.727111, lng: 150.371124},
        //     {lat: -33.848588, lng: 151.209834},
        //     {lat: -33.851702, lng: 151.216968}
        //     ]
        // 回傳語句
        // return "依照"+localStorage.getItem("username")+"的偏好，推薦您以下景點";
        
    }

    // ***************** Start00016 問自己是誰 *****************
    function Start00016(SearchKey) {
        // 免寫程式
    }

    // ***************** Start00017 跳專題影片 *****************
    function Start00017() {
        $("#muteYouTubeVideoPlayer").show();
        //自動播放影片    
        var player = new YT.Player('muteYouTubeVideoPlayer', {
            videoId: "Fb9P_GkVZrA", // YouTube 影片ID
                playerVars: {
                autoplay: 1,        // 在讀取時自動播放影片
                controls: 1,        // 在播放器顯示暫停／播放按鈕
                showinfo: 1,        // 影片標題
                modestbranding: 1,  // 隱藏YouTube Logo
                loop: 1,            // 讓影片循環播放
                fs: 0,              // 隱藏全螢幕按鈕
                cc_load_policty: 0, // 隱藏字幕
                iv_load_policy: 3,  // 隱藏影片註解
                autohide: 0         // 當播放影片時隱藏影片控制列
            },
            events: {
                onReady: function(e) {
                    e.target.mute();
                }
            }
        });                   
    }        
    

    // Map icon

    var icon1 = {
                url: "img/MarkerPictures/icon01.png",
                scaledSize: new google.maps.Size(70, 70),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(40, 67)
    };

    var icon2 = {
                url: "img/MarkerPictures/icon02.png",
                scaledSize: new google.maps.Size(60, 60),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(32, 60)
    };





}])

// ----------------------------------------個人資料頁面----------------------------------------
.controller('page7Ctrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup',
function ($scope, $stateParams, $ionicLoading, $ionicPopup) {
    // 修改暱稱功能
    var SaveBtn1 = document.getElementById("page7_savebtn1");
    var uploadFileInput1 = document.getElementById("uploadFileInput1");    
    SaveBtn1.addEventListener("click",function(){
        $ionicLoading.show({ // 開始跑圈圈
            template: '更新暱稱中...'
        });
        var uid = localStorage.getItem("uid"); // 取回uid
        var db = firebase.database();
        db.ref("使用者/" + uid).update({暱稱: uploadFileInput1.value},
        function (error) {
            if (error) {
                console.log("修改失敗");
                $ionicLoading.hide();
                console.log(error);
                var alertPopup = $ionicPopup.alert({
                    title: '修改暱稱失敗',
                    template: error
                });
            }
            else {
                console.log("修改成功");
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: '成功',
                    template: '暱稱修改完成。'
                });
                // 更新選單的暱稱
                var userId = localStorage.getItem("uid");
                return firebase.database().ref('/使用者/' + userId).once('value').then(function(snapshot) {
                    var username = (snapshot.val() && snapshot.val().暱稱) || 'Anonymous';
                    document.getElementById("menu-heading1").innerText = username; 
                });
            }
        });
    });
    // 上傳大頭照功能
    var SaveBtn2 = document.getElementById("page7_savebtn2");    
    var uploadFileInput2 = document.getElementById("uploadFileInput2");
    SaveBtn2.addEventListener("click",function(){
        $ionicLoading.show({ // 開始跑圈圈
            template: '上傳圖片中...'
        });
        var file = uploadFileInput2.files[0];
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var uploadTask = storageRef.child('images/'+localStorage.getItem("uid")).put(file);
        uploadTask.on('state_changed', function(snapshot){
            // 取得檔案上傳狀態，並用數字顯示
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('已上傳 ' + progress + '%');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: 
                console.log('上傳暫停');
                break;
                case firebase.storage.TaskState.RUNNING: 
                console.log('上傳中');
                break;
            }
        }, function(error) {
            console.log("上傳失敗");
            $ionicLoading.hide();
            console.log(error);
            var alertPopup = $ionicPopup.alert({
                title: '上傳圖片失敗',
                template: error
            });
        }, function() {
            console.log("上傳成功");
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: '成功',
                template: '更換照片完成。'
            });
            // 更新menu的大頭照
            var storage = firebase.storage();
            var storageRef = storage.ref();
            storageRef.child('images/'+localStorage.getItem("uid")).getDownloadURL().then(function(url) {
                document.getElementById("menu-img").src=url;
            })
        });
    },false);
   
}])

// ----------------------------------------功能說明頁面----------------------------------------
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
            localStorage.clear();
        }).catch(function(error) {
            console.log("登出發生錯誤!");
        });
    },false);
    
    // 設定授權文字位置
    $('#menu-heading2').css('top', window.innerHeight-560+'px');
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
            localStorage.setItem("LoginWay", "Signin"); // 登入方式標記為 首頁登入
            accountL.value="";
            pwdL.value="";
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
    var UserName = document.getElementById("page6-input1"); //暱稱
    var account = document.getElementById("page6-input2"); //電子信箱
    var pwd = document.getElementById("page6-input3"); //密碼
    var pwd2 = document.getElementById("page6-input4"); //確認密碼
    var registerSmtBtn = document.getElementById("page6-button1");
    registerSmtBtn.addEventListener("click",function(){
        if (pwd.value == pwd2.value) {
            firebase.auth().createUserWithEmailAndPassword(account.value, pwd.value).then(function(){
                console.log("成功註冊");      
                localStorage.setItem("LoginWay", "registered"); // 登入方式標記為註冊登入
                
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
 