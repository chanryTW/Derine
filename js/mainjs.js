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