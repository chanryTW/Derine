angular.module("app.controllers",[]).controller("derineCtrl",["$scope","$stateParams",function(t,u){function k(){f=new webkitSpeechRecognition;f.continuous=!1;f.interimResults=!1;f.onstart=function(a){m("\u8fa8\u8b58\u4e2d...")};f.onresult=function(a){f.onend=null;for(var c="",b=a.resultIndex;b<a.results.length;++b)c+=a.results[b][0].transcript;z.val(c);g();l()};f.onend=function(){m("\u8acb\u518d\u8aaa\u4e00\u6b21");l()};f.lang="cmn-Hant-TW";f.start()}function l(){f&&(f.stop(),f=null);$(".loaderBox").hide()}
function g(){var a=z.val();$.ajax({type:"POST",url:"https://api.api.ai/v1/query",contentType:"application/json; charset=utf-8",dataType:"json",headers:{Authorization:"Bearer 8f330cbcfadd4ebbbcff549d6ebb7fe9"},data:JSON.stringify({query:a,lang:"zh-TW",sessionId:"21351"}),success:function(a){var b=JSON.stringify(a,void 0,2);m(a.result.speech);$("#response").text(b)},error:function(){m("\u8acb\u8f38\u5165\u6587\u5b57\u3002")}})}function m(a){""==a&&(a="\u8aaa\u8aaa\u5225\u7684");if("\u8fa8\u8b58\u4e2d..."!==
a){var c=new SpeechSynthesisUtterance;c.voiceURI="native";c.lang="zh-TW";c.rate="1";c.pitch="0.5";c.volume=1;TestVal=a.substr(0,5);switch(TestVal){case "00001":a="\u9019\u662f"+y+"\u76ee\u524d\u7684\u4f4d\u7f6e";c.text=a;window.speechSynthesis.speak(c);e();break;case "00002":var b=a.substr(5);w(b);a="\u9019\u4e9b\u662f"+y+"\u9644\u8fd1\u7684"+b;c.text=a;window.speechSynthesis.speak(c);break;case "00003":b=a.substr(5,10);a=a.substr(16);a=A(b,a,3);c.text=a;window.speechSynthesis.speak(c);break;case "00004":b=
a.substr(5,10);a=a.substr(16);a=A(b,a,4);c.text=a;window.speechSynthesis.speak(c);break;case "00005":b=a.substr(5,10);a=a.substr(16);a=A(b,a,5);c.text=a;window.speechSynthesis.speak(c);break;case "00006":b=a.substr(5,10);a=a.substr(16);a=A(b,a,6);c.text=a;window.speechSynthesis.speak(c);break;case "00007":b=a.substr(5,10);a=a.substr(16);a=A(b,a,7);c.text=a;window.speechSynthesis.speak(c);break;case "00008":b=a.substr(5);E(b);a="\u5e6b"+y+"\u7be9\u9078\u51fa\u60a8\u53ef\u80fd\u6709\u8208\u8da3\u7684\u5730\u9ede";
c.text=a;window.speechSynthesis.speak(c);break;case "00009":var d=b=a.substr(5);a=d.substr(0,4);b=d.substr(5,2);0==b.substr(0,1)&&(b=b.substr(1));var q=d.substr(8);0==q.substr(0,1)&&(q=q.substr(1));var n=new Date(d);d=Number(d.substr(8));var p=new Date;console.log(p);var k=p.getDate();p.setDate(p.getDate()+1);var l=p.getDate();p.setDate(p.getDate()+1);var m=p.getDate();p.setDate(p.getDate()+1);switch(d){case k:p="\u4eca\u5929\u662f";break;case l:p="\u660e\u5929\u662f";break;case m:p="\u5f8c\u5929\u662f";
break;default:p=""}a=msg=p+a+"\u5e74"+b+"\u6708"+q+"\u65e5 \u661f\u671f"+"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split("")[n.getDay()];c.text=a;window.speechSynthesis.speak(c);break;case "00010":b=a.substr(5);a="\u597d\u7684\uff0c\u5e6b\u60a8\u641c\u5c0b"+b;c.text=a;window.speechSynthesis.speak(c);open("https://www.google.com.tw/search?q="+b,"_self");break;case "00011":b=a.substr(5);a="\u597d\u7684\uff0c\u5e6b\u60a8\u5c0e\u822a\u5230"+b;c.text=a;window.speechSynthesis.speak(c);F(b);break;case "99901":0==
B%2?(a="\u63a8\u85a6"+y+"\u4ee5\u4e0b\u666f\u9ede\uff0c\u4e00 \u798f\u8a18\u53e4\u5b85\u3001\u8ddd\u96e2550\u516c\u5c3a\uff0c\u4e8c \u6148\u6fdf\u5bae\u3001\u8ddd\u96e2290\u516c\u5c3a\uff0c\u4e09 \u6771\u9686\u5bae\u3001\u8ddd\u96e210\u516c\u91cc",c.text=a,window.speechSynthesis.speak(c),w("\u5edf\u5b87")):(a="\u63a8\u85a6"+y+"\u4ee5\u4e0b\u666f\u9ede\uff0c\u4e00 \u6797\u908a\u5149\u91c7\u6fd5\u5730\u3001\u8ddd\u96e243\u516c\u91cc\uff0c\u4e8c \u6d77\u795e\u5bae\u98a8\u666f\u5340\u3001\u8ddd\u96e259\u516c\u91cc\uff0c\u4e09 \u5927\u9d6c\u7063\u570b\u5bb6\u98a8\u666f\u5340\u3001\u8ddd\u96e245\u516c\u91cc",
c.text=a,window.speechSynthesis.speak(c),w("\u516c\u5712"));B+=1;break;case "00013":b=a.substr(5);a="\u8a55\u5206\u7cfb\u7d71\u6e2c\u8a66\u4e2d"+b;c.text=a;window.speechSynthesis.speak(c);break;case "00014":b=a.substr(5);a="\u597d\u7684\uff0c\u5e6b\u60a8\u64ad\u653e"+b;c.text=a;window.speechSynthesis.speak(c);G(b);break;case "00015":b=a.substr(5);a=H(b);c.text=a;window.speechSynthesis.speak(c);break;case "00016":a="\u7576\u7136"+y+"\uff0c\u6211\u53ef\u662f\u4f60\u7684\u8cbc\u8eab\u52a9\u7406\u5462";
c.text=a;window.speechSynthesis.speak(c);break;case "00017":a="\u5475\u5475\u6c92\u554f\u984c\uff0c\u4e0b\u9762\u9019\u500b\u5c31\u662f\u4ee5\u6211\u70ba\u4e3b\u89d2\u7684\u5f71\u7247";c.text=a;window.speechSynthesis.speak(c);I();break;default:c.text=a,window.speechSynthesis.speak(c)}}$("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(a)}function n(){$.fn.loader=function(a){var c=$.extend({color:"#ffffff",shadowColor:"#ffffff",pieceCount:27,syncPiecesAndIterations:!0},
a);return this.filter("div.loader").each(function(){for(var a=$(this),d=0;d<c.pieceCount;d++){var q=.86*d;q=c.syncPiecesAndIterations?q/c.pieceCount:-q;q+="s";var e=c.color,p=c.shadowColor;a.append($("<i>").text(" ").css("background-color",e).css("animation-delay",q).css("box-shadow","0 0 10px "+p))}})};0==C&&($(".loader").loader(),C+=1)}function e(){function a(a){a=new google.maps.LatLng(a.coords.latitude,a.coords.longitude);new google.maps.Geocoder;var b=new google.maps.Map($("#mymap").get(0),{zoom:14,
center:a,mapTypeId:google.maps.MapTypeId.ROADMAP,draggable:!0,mapTypeControl:!1});new google.maps.Marker({position:a,title:"\u73fe\u5728\u4f4d\u7f6e",icon:D,map:b})}$("#mymap").show();navigator&&navigator.geolocation&&navigator.geolocation.getCurrentPosition(a)}function w(a){$("#mymap").show();navigator.geolocation.getCurrentPosition(function(c){function b(a){var b=new google.maps.Marker({map:d,icon:J,position:a.geometry.location});google.maps.event.addListener(b,"click",function(){e&&e.close();var b=
new google.maps.InfoWindow;e=b;b.open(d,this);q.getDetails(a,function(a,c){c===google.maps.places.PlacesServiceStatus.OK&&b.setContent('<div class="place-name"><font size="4">'+a.name+'</font></div><div class="place-info">\u5730\u5740\uff1a'+a.vicinity+'</div><div class="place-info">\u96fb\u8a71\uff1a'+a.formatted_phone_number+'</div><div class="place-info">\u8a55\u50f9\uff1a'+a.rating+'</div><button class="btn01 button button-block button-energized">\u9ede\u6211\u8a55\u5206</button><br><img src="'+
a.photos[0].getUrl({maxWidth:200})+'"><br>');console.log(a.photos[0].getUrl({maxWidth:150,maxHeight:150}))})})}c={lat:c.coords.latitude,lng:c.coords.longitude};var d=new google.maps.Map(document.getElementById("mymap"),{center:c,zoom:14,mapTypeControl:!1}),q=new google.maps.places.PlacesService(d);q.radarSearch({location:c,radius:"1500",keyword:a},function(a,c){if(c===google.maps.places.PlacesServiceStatus.OK)for(var d=a.slice(0,5),q=0;q<a.length;q++)d.forEach(b);else"ZERO_RESULTS"===c?alert("\u6c92\u6709"):
alert("\u7cfb\u7d71\u932f\u8aa4\uff0c\u8acb\u91cd\u65b0\u518d\u8a66")});new google.maps.Marker({position:c,map:d,icon:D});var e})}function A(a,c,b){var d=new Date;"\u4eca\u5929"==a.substr(0,2)?(c=a.substr(3),a=Number(d.getDate())):a=Number(a.substr(8));var q=Number(d.getDate());d.setDate(d.getDate()+1);var e=d.getDate();d.setDate(d.getDate()+1);var p=d.getDate();d.setDate(d.getDate()+1);var n=d.getDate();d.setDate(d.getDate()+1);var k=d.getDate();d.setDate(d.getDate()+1);var l=d.getDate();d.setDate(d.getDate()+
1);var m=d.getDate(),g="",f="",v="",t="";$.ajax({url:"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+c+"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",async:!1,dataType:"json",success:function(h){var w=function(a){console.log(a);var b="";switch(a){case "Thunderstorms":b="\u53ef\u80fd\u6709\u96f7\u96e8";f="\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";v="\u4e0d\u6703\u51fa\u592a\u967d\uff0c\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";
break;case "Scattered Thunderstorms":b="\u6709\u5c40\u90e8\u96f7\u96e8";f="\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";v="\u4e0d\u6703\u51fa\u592a\u967d\uff0c\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";break;case "Showers":b="\u8acb\u6ce8\u610f\u9663\u96e8";f="\u4e26\u8a18\u5f97\u651c\u5e36\u96e8\u5177";v="\u4e0d\u6703\u51fa\u592a\u967d\uff0c\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";break;case "Mostly Cloudy":b="\u6674\u6642\u591a\u96f2";f="\u4e0d\u6703\u4e0b\u96e8";v="\u592a\u967d\u4e0d\u5927\uff0c\u51fa\u904a\u597d\u5929\u6c23";
break;case "Scattered Showers":b="\u6703\u6709\u5c40\u90e8\u9663\u96e8";f="\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";v="\u592a\u967d\u4e0d\u5927\uff0c\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";break;case "Partly Cloudy":b="\u5c40\u90e8\u6709\u96f2";f="\u53ef\u80fd\u6703\u4e0b\u96e8";v="\u592a\u967d\u4e0d\u5927";break;case "Rain":b="\u6703\u4e0b\u96e8";f="\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";v="\u4e0d\u6703\u51fa\u592a\u967d\uff0c\u8acb\u8a18\u5f97\u651c\u5e36\u96e8\u5177";break;case "Cloudy":b=
"\u591a\u96f2";f="\u4f46\u4e0d\u6703\u4e0b\u96e8";v="\u592a\u967d\u4e0d\u5927";break;case "Mostly Sunny":b="\u662f\u6674\u5929";f="\u4e0d\u6703\u4e0b\u96e8";v="\u592a\u967d\u9732\u81c9\uff0c\u6ce8\u610f\u9632\u66ec";break;case "Sunny":b="\u6674\u7a7a\u842c\u91cc";f="\u4e0d\u6703\u4e0b\u96e8";v="\u592a\u967d\u8f03\u5927\uff0c\u6ce8\u610f\u9632\u66ec";break;case "Mostly Clear":b="\u662f\u6674\u5929",f="\u4e0d\u6703\u4e0b\u96e8",v="\u592a\u967d\u9732\u81c9\uff0c\u6ce8\u610f\u9632\u66ec"}return b},u=
function(a){var b="";switch(a){case "Sun":b="\u661f\u671f\u65e5";break;case "Mon":b="\u661f\u671f\u4e00";break;case "Tue":b="\u661f\u671f\u4e8c";break;case "Wed":b="\u661f\u671f\u4e09";break;case "Thu":b="\u661f\u671f\u56db";break;case "Fri":b="\u661f\u671f\u4e94";break;case "Sat":b="\u661f\u671f\u516d"}return b};switch(a){case q:d="\u4eca\u5929";var r=Math.floor(5*(h.query.results.channel.item.condition.temp-32)/9)+"\u5ea6",x=w(h.query.results.channel.item.condition.text);break;case e:d="\u660e\u5929";
r=Math.floor(5*(h.query.results.channel.item.forecast[1].low-32)/9+5)+"\u5230"+Math.floor(5*(h.query.results.channel.item.forecast[1].high-32)/9)+"\u5ea6\u4e4b\u9593";x=w(h.query.results.channel.item.forecast[1].text);break;case p:d="\u5f8c\u5929";r=Math.floor(5*(h.query.results.channel.item.forecast[2].low-32)/9+5)+"\u5230"+Math.floor(5*(h.query.results.channel.item.forecast[2].high-32)/9)+"\u5ea6\u4e4b\u9593";x=w(h.query.results.channel.item.forecast[2].text);break;case n:d=String(u(h.query.results.channel.item.forecast[3].day));
r=Math.floor(5*(h.query.results.channel.item.forecast[3].low-32)/9+5)+"\u5230"+Math.floor(5*(h.query.results.channel.item.forecast[3].high-32)/9)+"\u5ea6\u4e4b\u9593";x=w(h.query.results.channel.item.forecast[3].text);break;case k:d=String(u(h.query.results.channel.item.forecast[4].day));r=Math.floor(5*(h.query.results.channel.item.forecast[4].low-32)/9+5)+"\u5230"+Math.floor(5*(h.query.results.channel.item.forecast[4].high-32)/9)+"\u5ea6\u4e4b\u9593";x=w(h.query.results.channel.item.forecast[4].text);
break;case l:d=String(u(h.query.results.channel.item.forecast[5].day));r=Math.floor(5*(h.query.results.channel.item.forecast[5].low-32)/9+5)+"\u5230"+Math.floor(5*(h.query.results.channel.item.forecast[5].high-32)/9)+"\u5ea6\u4e4b\u9593";x=w(h.query.results.channel.item.forecast[5].text);break;case m:d=String(u(h.query.results.channel.item.forecast[6].day)),r=Math.floor(5*(h.query.results.channel.item.forecast[6].low-32)/9+5)+"\u5230"+Math.floor(5*(h.query.results.channel.item.forecast[6].high-32)/
9)+"\u5ea6\u4e4b\u9593",x=w(h.query.results.channel.item.forecast[6].text)}t=26<=r.substr(0,2)?"\u6bd4\u8f03\u708e\u71b1":20<=r.substr(0,2)?"\u6eab\u5ea6\u9069\u4e2d":12<=r.substr(0,2)?"\u6eab\u5ea6\u6dbc\u723d":0<=r.substr(0,2)?"\u6709\u9ede\u51b7\uff0c\u8acb\u6ce8\u610f\u4fdd\u6696":"\u975e\u5e38\u51b7";switch(b){case 3:g=d+c+"\u7684\u6eab\u5ea6\u662f"+r+"\uff0c"+x;break;case 4:g=d+c+"\u7684\u6eab\u5ea6\u662f"+r+"\uff0c"+x+"\uff0c"+f;break;case 5:g=d+c+"\u7684\u6eab\u5ea6\u662f"+r+"\uff0c"+x+"\uff0c"+
v;break;case 6:g=d+c+"\u7684\u6eab\u5ea6\u662f"+r+"\uff0c"+t;break;case 7:g=d+c+"\u7684\u6eab\u5ea6\u662f"+r}}});return g}function E(a){window.ActiveXObject?xmlHTTP=new ActiveXObject("Microsoft.XMLHTTP"):window.XMLHttpRequest&&(xmlHTTP=new XMLHttpRequest);xmlHTTP.open("GET","/api8/js/a00008.php?SearchKey="+a,!0);xmlHTTP.onreadystatechange=function(){4==xmlHTTP.readyState&&200==xmlHTTP.status&&(document.getElementById("test001").innerHTML=xmlHTTP.responseText)};xmlHTTP.send(null)}function F(a){function c(b){b=
new google.maps.LatLng(b.coords.latitude,b.coords.longitude);open("https://www.google.com.tw/maps/dir/"+b+"/"+a,"_self")}navigator&&navigator.geolocation&&navigator.geolocation.getCurrentPosition(c)}function G(a){function c(a){gapi.client.youtube.search.list({part:"snippet",q:a,maxResults:1}).execute(function(a){$.each(a.items,function(a,b){b.id.playlistId||new YT.Player("muteYouTubeVideoPlayer",{videoId:b.id.videoId,playerVars:{autoplay:1,controls:1,showinfo:1,modestbranding:1,loop:1,fs:0,cc_load_policty:0,
iv_load_policy:3,autohide:0},events:{onReady:function(a){a.target.mute()}}})})})}$("#muteYouTubeVideoPlayer").show();(function(a){gapi.client.load("youtube","v3",function(){gapi.client.setApiKey("AIzaSyAEI2ThqWR-jOzB5lLoVD0WwXku8HS4fCA");c(a)})})(a)}function H(a){var c="";$.ajax({url:"http://120.119.164.95:7516/data/",async:!1,type:"POST",data:{userid:localStorage.getItem("uid"),category:a},success:function(a){c=a.category+"\uff0c\u4e00\uff0c"+a.Attraction1+"\uff0c\u4e8c\uff0c"+a.Attraction2+"\uff0c\u4e09\uff0c"+
a.Attraction3+"\uff0c\u56db\uff0c"+a.Attraction4+"\uff0c\u4e94\uff0c"+a.Attraction5;$("#mymap").show();navigator.geolocation.getCurrentPosition(function(a){a={lat:a.coords.latitude,lng:a.coords.longitude};a=new google.maps.Map(document.getElementById("mymap"),{zoom:13,center:a});var c=b.map(function(a,b){return new google.maps.Marker({position:a,label:"123456789"[b%9]})});new MarkerClusterer(a,c,{imagePath:"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"})});
console.log(a);var b=[{lat:Number(a.longitude1),lng:Number(a.latitude1)},{lat:Number(a.longitude2),lng:Number(a.latitude2)},{lat:Number(a.longitude3),lng:Number(a.latitude3)},{lat:Number(a.longitude4),lng:Number(a.latitude4)},{lat:Number(a.longitude5),lng:Number(a.latitude5)}]}});return"\u4f9d\u7167"+localStorage.getItem("username")+"\u7684\u504f\u597d\uff0c\u63a8\u85a6\u60a8\u4ee5\u4e0b"+c}function I(){$("#muteYouTubeVideoPlayer").show();new YT.Player("muteYouTubeVideoPlayer",{videoId:"Fb9P_GkVZrA",
playerVars:{autoplay:1,controls:1,showinfo:1,modestbranding:1,loop:1,fs:0,cc_load_policty:0,iv_load_policy:3,autohide:0},events:{onReady:function(a){a.target.mute()}}})}firebase.auth().onAuthStateChanged(function(a){if(a){console.log("\u5df2\u767b\u5165\u72c0\u614b");var c=firebase.database(),b=new Date;utc=b.getTime()+6E4*b.getTimezoneOffset();c.ref("/\u767b\u5165\u8a18\u9304/").push({"\u8a18\u9304":"\u7528\u6236 "+a.uid+" \u767b\u5165\u65bc "+Date(utc+288E5)},function(a){a?(console.log("\u8a18\u9304\u767b\u5165\u8a18\u9304\u5931\u6557"),
console.log(a)):console.log("\u8a18\u9304\u767b\u5165\u8a18\u9304\u6210\u529f")});localStorage.setItem("uid",a.uid);if("registered"==localStorage.getItem("LoginWay")){document.getElementById("page6-uploadFileInput").files[0]&&(c=document.getElementById("page6-uploadFileInput").files[0],b=firebase.storage(),b=b.ref(),b.child("images/"+a.uid).put(c).on("state_changed",function(a){console.log("\u5df2\u4e0a\u50b3 "+a.bytesTransferred/a.totalBytes*100+"%");switch(a.state){case firebase.storage.TaskState.PAUSED:console.log("\u4e0a\u50b3\u66ab\u505c");
break;case firebase.storage.TaskState.RUNNING:console.log("\u4e0a\u50b3\u4e2d")}},function(a){console.log("\u4e0a\u50b3\u5931\u6557");console.log(a)},function(){console.log("\u4e0a\u50b3\u6210\u529f");firebase.storage().ref().child("images/"+localStorage.getItem("uid")).getDownloadURL().then(function(a){document.getElementById("menu-img").src=a})}));b=document.getElementById("page6-input1");var d=document.getElementById("page6-input2");c=firebase.database();c.ref("/\u4f7f\u7528\u8005/"+a.uid).update({"\u66b1\u7a31":b.value,
"\u5e33\u865f":d.value},function(a){a?(console.log("\u65b0\u7528\u6236\uff0c\u5efa\u7acbDB\u5931\u6557"),console.log(a)):console.log("\u65b0\u7528\u6236\uff0c\u5efa\u7acbDB\u6210\u529f")});b.value="";d.value=""}else console.log("\u975e\u65b0\u7528\u6236");b=firebase.storage();b=b.ref();b.child("images/"+localStorage.getItem("uid")).getDownloadURL().then(function(a){document.getElementById("menu-img").src=a});a=localStorage.getItem("uid");return firebase.database().ref("/\u4f7f\u7528\u8005/"+a).once("value").then(function(a){a=
a.val()&&a.val().\u66b1\u7a31||"Anonymous";localStorage.setItem("username",a);document.getElementById("menu-heading1").innerText=a;document.getElementById("spoken-response__text").innerText="\u54c8\u56c9 "+a+"\uff0c\u6211\u662fDerine~"})}console.log("\u5c1a\u672a\u767b\u5165")});var y=localStorage.getItem("username");$("#derine_text").css("top",window.innerHeight-116+"px");var B=0,z,f;$(document).ready(function(){z=$("#speech");document.getElementById("mymap").style.display="inline-block"});$("#speech").keypress(function(a){code=
a.keyCode?a.keyCode:a.which;13==code&&(a=document.getElementById("speech").value,z.val(a),g())});$("#btnSend").click(function(){var a=document.getElementById("speech").value;z.val(a);g()});$("#fab").click(function(a){f?l():k();$("#muteYouTubeVideoPlayer").hide();$("#mymap").hide();n();$(".loaderBox").show()});var C=0,D={url:"img/MarkerPictures/icon01.png",scaledSize:new google.maps.Size(70,70),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(40,67)},J={url:"img/MarkerPictures/icon02.png",
scaledSize:new google.maps.Size(60,60),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(32,60)}}]).controller("page7Ctrl",["$scope","$stateParams","$ionicLoading","$ionicPopup",function(t,u,k,l){t=document.getElementById("page7_savebtn1");var g=document.getElementById("uploadFileInput1");t.addEventListener("click",function(){k.show({template:"\u66f4\u65b0\u66b1\u7a31\u4e2d..."});var n=localStorage.getItem("uid");firebase.database().ref("\u4f7f\u7528\u8005/"+n).update({"\u66b1\u7a31":g.value},
function(e){if(e)console.log("\u4fee\u6539\u5931\u6557"),k.hide(),console.log(e),l.alert({title:"\u4fee\u6539\u66b1\u7a31\u5931\u6557",template:e});else return console.log("\u4fee\u6539\u6210\u529f"),k.hide(),l.alert({title:"\u6210\u529f",template:"\u66b1\u7a31\u4fee\u6539\u5b8c\u6210\u3002"}),e=localStorage.getItem("uid"),firebase.database().ref("/\u4f7f\u7528\u8005/"+e).once("value").then(function(e){e=e.val()&&e.val().\u66b1\u7a31||"Anonymous";document.getElementById("menu-heading1").innerText=
e})})});t=document.getElementById("page7_savebtn2");var m=document.getElementById("uploadFileInput2");t.addEventListener("click",function(){k.show({template:"\u4e0a\u50b3\u5716\u7247\u4e2d..."});var g=m.files[0];firebase.storage().ref().child("images/"+localStorage.getItem("uid")).put(g).on("state_changed",function(e){console.log("\u5df2\u4e0a\u50b3 "+e.bytesTransferred/e.totalBytes*100+"%");switch(e.state){case firebase.storage.TaskState.PAUSED:console.log("\u4e0a\u50b3\u66ab\u505c");break;case firebase.storage.TaskState.RUNNING:console.log("\u4e0a\u50b3\u4e2d")}},
function(e){console.log("\u4e0a\u50b3\u5931\u6557");k.hide();console.log(e);l.alert({title:"\u4e0a\u50b3\u5716\u7247\u5931\u6557",template:e})},function(){console.log("\u4e0a\u50b3\u6210\u529f");k.hide();l.alert({title:"\u6210\u529f",template:"\u66f4\u63db\u7167\u7247\u5b8c\u6210\u3002"});firebase.storage().ref().child("images/"+localStorage.getItem("uid")).getDownloadURL().then(function(e){document.getElementById("menu-img").src=e})})},!1)}]).controller("page8Ctrl",["$scope","$stateParams",function(t,
u){}]).controller("page9Ctrl",["$scope","$stateParams",function(t,u){}]).controller("menuCtrl",["$scope","$stateParams",function(t,u){document.getElementById("menu-list-item5").addEventListener("click",function(){firebase.auth().signOut().then(function(){console.log("\u767b\u51fa\u6210\u529f");localStorage.clear()})["catch"](function(k){console.log("\u767b\u51fa\u767c\u751f\u932f\u8aa4!")})},!1);$("#menu-heading2").css("top",window.innerHeight-560+"px")}]).controller("page4Ctrl",["$scope","$stateParams",
"$ionicPopup",function(t,u,k){var l=document.getElementById("page4-input1"),g=document.getElementById("page4-input2");document.getElementById("page4-button1").addEventListener("click",function(){console.log(l.value);firebase.auth().signInWithEmailAndPassword(l.value,g.value).then(function(){console.log("\u767b\u5165\u6210\u529f");localStorage.setItem("LoginWay","Signin");l.value="";g.value="";open("/#/menu/Derine","_self")})["catch"](function(m){var n=m.code;m=m.message;console.log(n);console.log(m);
switch(n){case "auth/user-not-found":n=k.alert({title:"\u767c\u751f\u932f\u8aa4",template:"\u67e5\u7121\u6b64\u5e33\u865f\u3002"});n.then(function(e){l.value="";g.value=""});break;case "auth/invalid-email":n=k.alert({title:"\u767c\u751f\u932f\u8aa4",template:"\u96fb\u5b50\u4fe1\u7bb1\u7684\u683c\u5f0f\u6709\u8aa4\u3002"});n.then(function(e){l.value=""});break;case "auth/wrong-password":n=k.alert({title:"\u767c\u751f\u932f\u8aa4",template:"\u5bc6\u78bc\u932f\u8aa4\uff0c\u5982\u5fd8\u8a18\u5bc6\u78bc\u8acb\u9ede\u9078\u4e0b\u65b9\u5fd8\u8a18\u5bc6\u78bc\u3002"}),
n.then(function(e){g.value=""})}})},!1)}]).controller("page5Ctrl",["$scope","$stateParams",function(t,u){}]).controller("page6Ctrl",["$scope","$stateParams","$ionicPopup",function(t,u,k){document.getElementById("page6-input1");var l=document.getElementById("page6-input2"),g=document.getElementById("page6-input3"),m=document.getElementById("page6-input4");document.getElementById("page6-button1").addEventListener("click",function(){g.value==m.value?firebase.auth().createUserWithEmailAndPassword(l.value,
g.value).then(function(){console.log("\u6210\u529f\u8a3b\u518a");localStorage.setItem("LoginWay","registered");g.value="";m.value="";open("/#/menu/Derine","_self")})["catch"](function(n){var e=n.code;n=n.message;console.log(e);console.log(n);switch(e){case "auth/invalid-email":e=k.alert({title:"\u767c\u751f\u932f\u8aa4",template:"\u96fb\u5b50\u4fe1\u7bb1\u7684\u683c\u5f0f\u6709\u8aa4\u3002"});e.then(function(e){l.value=""});break;case "auth/weak-password":e=k.alert({title:"\u767c\u751f\u932f\u8aa4",
template:"\u70ba\u4e86\u60a8\u5e33\u6236\u5b89\u5168\uff0c\u5bc6\u78bc\u8acb\u8d85\u904e6\u78bc\u3002"});e.then(function(e){g.value="";m.value=""});break;case "auth/email-already-in-use":e=k.alert({title:"\u767c\u751f\u932f\u8aa4",template:"\u6b64\u96fb\u5b50\u4fe1\u7bb1\u5df2\u88ab\u8a3b\u518a\u904e\uff0c\u5982\u5fd8\u8a18\u5bc6\u78bc\u8acb\u9ede\u9078\u767b\u5165\u9801\u9762\u7684\u5fd8\u8a18\u5bc6\u78bc\u3002"}),e.then(function(e){l.value="";g.value="";m.value=""})}}):k.alert({title:"\u767c\u751f\u932f\u8aa4",
template:"\u5bc6\u78bc\u548c\u78ba\u8a8d\u5bc6\u78bc\u4e0d\u4e00\u81f4\uff0c\u8acb\u91cd\u65b0\u8f38\u5165\u3002"}).then(function(k){g.value="";m.value=""})},!1)}]);