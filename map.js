$(function() {

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
	
	

//事件
    $('#query').click(function() {
    
        var addr = $('#addr').val();
        if (addr == '') {
            alert("請輸入地址!");
            return;
        }
        
        var type = $('#selection1 option:selected').val();
        if (type == '') {
            alert("請輸入類型!");
            return;
        }
        
        var range = $('#selection2 option:selected').val();
        if (range == '') {
            alert("請輸入範圍!");
            return;
        } 
/* 		var type = "restaurant";
		var range = "500"; */
     
        gc.geocode({'address': addr}, function(result, status) {
        
            if (status == google.maps.GeocoderStatus.OK) {
                var latlng = result[0].geometry.location;                        
            
            mymap.setCenter(result[0].geometry.location);             
            initMap(latlng.lat(), latlng.lng(), type, range);
            }
        });
    });

});

      // 顯示列表
      var map;
      var infowindow;
      var allMarkers = [];
      function initMap(lat, lng, type, range) {
        var pyrmont = {lat: lat, lng: lng};
        allMarkers = [];
        
        map = new google.maps.Map(document.getElementById('mymap'), {
          center: pyrmont,
          zoom: 16
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pyrmont,
          radius: range,
          type: [type]
        }, callback);
      }

      function callback(results, status) {
        $("#result1").empty();       
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i],i);
          }
        }
      }
      
      
        var icon1 = {
                    url: "MarkerPictures/red-circle.png", // url
                    scaledSize: new google.maps.Size(40, 40), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
        };
        
        var icon2 = {
                    url: "MarkerPictures/blu-circle.png", // url
                    scaledSize: new google.maps.Size(50, 50), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
        };

      function createMarker(place,id) {
        var placeLoc = place.geometry.location;                           
        
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            id: id,
            icon: icon1
            
        });
        allMarkers.push(marker);       
 
        google.maps.event.addListener(marker, 'mouseover', function() {
            marker.setIcon(icon2);         
          
          infowindow.setContent('<span id="marker">' + place.name + '</span>');
          infowindow.open(map, this);              
          
        });
        
        google.maps.event.addListener(marker, 'mouseout', function() {
            marker.setIcon(icon1);
            infowindow.close();
        });
        
        
            $("#result1").append('<div class="data" id='+id+' onmouseover="hover('+id+')" onmouseout="out('+id+')">'+place.name+'</div>');
               
        }



//當滑鼠在左側移到該地標時 該地標變圖
function hover(id) {
    for ( var i = 0; i< allMarkers.length; i++) {      
        if (id === allMarkers[i].id) {
           allMarkers[i].setIcon(icon2);
           break;
        }
   }
}

//當滑鼠在左側離開該地標時 該地標變回
function out(id) {  
    for ( var i = 0; i< allMarkers.length; i++) {
        if (id === allMarkers[i].id) {
           allMarkers[i].setIcon(icon1);
           break;
        }
   }
}

