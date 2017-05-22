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

function Start00003() {
/*   $.ajax({
    type: "GET",
    url: "http://opendata.cwb.gov.tw/opendataapi?dataid=F-D0047-091&authorizationkey=CWB-1C9712EC-C95E-4CDF-84DE-56C7971B4ADF",
    dataType: "xml",
    error: function (e) {
      console.log('載入XML錯誤');
    },
    success: function (e) {
		
		var ng_e = $.grep(e, function(element, index){
			return (element.dataset.location.locationName =="新北市");
		});	
		
		$.each(ng_e, function(index, element){
			console.log(element.dataset.location.geocode);
		});
      var locationName = $(e).find('高雄市').text();
      var weatherElement = $(e).find('weatherElement').text();
      console.log(locationName);
	  console.log(weatherElement);
    }
  }); */
}


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



