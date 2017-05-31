    var accessToken = "8f330cbcfadd4ebbbcff549d6ebb7fe9",
      baseUrl = "https://api.api.ai/v1/",
      $speechInput,
      recognition,
      messageRecording = "辨識中...",
      messageCouldntHear = "請再說一次",
      messageInternalError = "發生伺服器錯誤惹",
      messageSorry = "說說別的";

	//自動執行，全部DOM元素下載完就會觸發
    $(document).ready(function() {
      $speechInput = $("#speech");
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
		msg.rate = "0.9";
		msg.pitch = "0.8";//音調0-2
		msg.volume = 1;//音量

		TestVal = val.substr(0,5);
		switch (TestVal) {
			case "00001": //定位
				val = "這是您目前的位置";
				msg.text = val;
				window.speechSynthesis.speak(msg);
				Start00001();
				document.getElementById("mymap").style.display="inline-block";
				break;
 			case "00002": //問地點
				var SearchKey = val.substr(5)
				Start00002(SearchKey);
				// 尚未完成 (無資料時的判定)
				val = "這些是您附近的" + SearchKey;
				msg.text = val;
				window.speechSynthesis.speak(msg);
				document.getElementById("mymap").style.display="inline-block";
				break;
			case "00003": //問天氣
				var SearchKey = val.substr(6)
 			 	Start00003();
				val = "的天氣";
				msg.text = val;
				window.speechSynthesis.speak(msg);
				break;
			default:
			  msg.text = val;
			  window.speechSynthesis.speak(msg);
			  document.getElementById("mymap").style.display="none";
		}

      }

      $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);//放入回應
    }