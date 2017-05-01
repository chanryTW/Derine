function startmap() { 

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



