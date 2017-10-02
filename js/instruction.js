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
			// pos.coords.latitude, pos.coords.longitude);
			22.431820, 120.516062);
		
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
    var currentLocation = {lat: 22.431820, lng: 120.516062};
    // var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    
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
		var curLatLng = new google.maps.LatLng(22.431820, 120.516062);
		// var curLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    open("https://www.google.com.tw/maps/dir/"+curLatLng+"/林邊 加油站",'_self');
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



