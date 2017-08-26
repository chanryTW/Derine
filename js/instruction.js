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
              '<div class="place-info">評價：' + details.rating + '</div><img src="' + details.photos[0].getUrl({'maxWidth': 110, 'maxHeight': 110}) +'"><br>');
          } 
		  console.log(details.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150}));
        }); 
		
		
      }); 
    } 
  }); 
} 

function Start00003(SearchKey1,SearchKey2) {
  // var getWeather = $.getJSON(url, function(date) {
      
  //   var weather = function(w) {
  //     var weatherText = "";
  //     switch (w) {
  //       case 'Thunderstorms':
  //           weatherText = '雷雨';
  //           break;
  //       case 'Showers':
  //           weatherText = '陣雨';
  //           break;
  //       case 'Mostly Cloudy':
  //           weatherText = '晴時多雲';
  //           break;
  //       case 'Scattered Showers':
  //           weatherText = '局部陣雨';
  //           break;
  //       case 'Partly Cloudy':
  //           weatherText = '局部有雲';
  //           break;
  //       case 'Rain':
  //           weatherText = '雨天';
  //           break;
  //       case 'Cloudy':
  //           weatherText = '多雲';
  //           break;
  //       case 'Mostly Sunny':
  //           weatherText = '晴偶有雲';
  //           break;
  //       case "Sunny":
  //           weatherText = "晴天";
  //           break;
  //     }
  //     return weatherText;
  //   };

  //   var temp = Math.floor((date.query.results.channel.item.condition.temp - 32) * 5 / 9);
  //   var WeatherStatus = weather(date.query.results.channel.item.forecast[0].text);
  //   var test1='今天的溫度是'+ temp +'度'+ WeatherStatus;
  //   return test1;
  // });
  var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22taiwan%2C%20"+SearchKey2+"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var msg = "";
  $.ajax({
    url:url,
    async: false,
    dataType: 'json',
    success: function(data) {
      var weather = function(w) {
        var weatherText = "";
        switch (w) {
          case 'Thunderstorms':
              weatherText = '可能有雷雨';
              break;
          case 'Showers':
              weatherText = '請注意陣雨';
              break;
          case 'Mostly Cloudy':
              weatherText = '晴時多雲';
              break;
          case 'Scattered Showers':
              weatherText = '會有局部陣雨';
              break;
          case 'Partly Cloudy':
              weatherText = '局部有雲';
              break;
          case 'Rain':
              weatherText = '會下雨';
              break;
          case 'Cloudy':
              weatherText = '多雲';
              break;
          case 'Mostly Sunny':
              weatherText = '是晴天';
              break;
          case "Sunny":
              weatherText = "晴空萬里";
              break;
          case 'Mostly Clear':
              weatherText = '是晴天';
              break;
        }
        return weatherText;
      };

      var temp = Math.floor((data.query.results.channel.item.condition.temp - 32) * 5 / 9 + 3);
      var WeatherStatus = weather(data.query.results.channel.item.condition.text);
      msg = '今天的溫度是'+ temp +'度，'+ WeatherStatus;
    }
  });
  return msg;
}

// Start00008

function $_xmlHttpRequest()
{   
    if(window.ActiveXObject)
    {
        xmlHTTP=new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if(window.XMLHttpRequest)
    {
        xmlHTTP=new XMLHttpRequest();
    }
}

function Start00008(SearchKey) {
    var xmlhttp;

    $_xmlHttpRequest();
    xmlHTTP.open("GET","/api8/js/a00008.php?SearchKey="+SearchKey,true);
    
    xmlHTTP.onreadystatechange=function check_user()
    {
        if(xmlHTTP.readyState == 4)
        {
            if(xmlHTTP.status == 200)
            {
                document.getElementById("test001").innerHTML=xmlHTTP.responseText;
            }
        }
    }
    xmlHTTP.send(null);
}

// map icon

var icon1 = {
			url: "MarkerPictures/red-circle.png",
			scaledSize: new google.maps.Size(40, 40),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0, 0)
};

var icon2 = {
			url: "MarkerPictures/blu-circle.png",
			scaledSize: new google.maps.Size(50, 50),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0, 0)
};



