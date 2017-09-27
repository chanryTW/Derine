var accessToken="8f330cbcfadd4ebbbcff549d6ebb7fe9",baseUrl="https://api.api.ai/v1/",$speechInput,recognition,messageRecording="\u8fa8\u8b58\u4e2d...",messageCouldntHear="\u8acb\u518d\u8aaa\u4e00\u6b21",messageInternalError="\u767c\u751f\u4f3a\u670d\u5668\u932f\u8aa4",messageSorry="\u8aaa\u8aaa\u5225\u7684";$(document).ready(function(){$speechInput=$("#speech")});$("#speech").keypress(function(a){code=a.keyCode?a.keyCode:a.which;13==code&&(a=document.getElementById("speech").value,setInput(a))});
function startRecognition(){recognition=new webkitSpeechRecognition;recognition.continuous=!1;recognition.interimResults=!1;recognition.onstart=function(a){respond(messageRecording)};recognition.onresult=function(a){recognition.onend=null;for(var b="",c=a.resultIndex;c<a.results.length;++c)b+=a.results[c][0].transcript;setInput(b);stopRecognition()};recognition.onend=function(){respond(messageCouldntHear);stopRecognition()};recognition.lang="cmn-Hant-TW";recognition.start()}
function stopRecognition(){recognition&&(recognition.stop(),recognition=null)}function switchRecognition(){recognition?stopRecognition():startRecognition()}function setInput(a){$speechInput.val(a);send()}
function send(){var a=$speechInput.val();$.ajax({type:"POST",url:baseUrl+"query",contentType:"application/json; charset=utf-8",dataType:"json",headers:{Authorization:"Bearer "+accessToken},data:JSON.stringify({query:a,lang:"zh-TW",sessionId:"21351"}),success:function(a){prepareResponse(a)},error:function(){respond(messageInternalError)}})}function prepareResponse(a){var b=JSON.stringify(a,void 0,2);respond(a.result.speech);debugRespond(b)}function debugRespond(a){$("#response").text(a)}
function respond(a){""==a&&(a=messageSorry);if(a!==messageRecording){var b=new SpeechSynthesisUtterance;b.voiceURI="native";b.lang="zh-TW";b.rate="1";b.pitch="0.5";b.volume=1;TestVal=a.substr(0,5);switch(TestVal){case "00001":a="\u9019\u662f\u60a8\u76ee\u524d\u7684\u4f4d\u7f6e";b.text=a;window.speechSynthesis.speak(b);Start00001();document.getElementById("mymap").style.display="inline-block";break;case "00002":var c=a.substr(5);Start00002(c);a="\u9019\u4e9b\u662f\u60a8\u9644\u8fd1\u7684"+c;b.text=
a;window.speechSynthesis.speak(b);document.getElementById("mymap").style.display="inline-block";break;case "00003":c=a.substr(5,10);a=a.substr(16);a=Start00003_7(c,a,3);b.text=a;window.speechSynthesis.speak(b);break;case "00004":c=a.substr(5,10);a=a.substr(16);a=Start00003_7(c,a,4);b.text=a;window.speechSynthesis.speak(b);break;case "00005":c=a.substr(5,10);a=a.substr(16);a=Start00003_7(c,a,5);b.text=a;window.speechSynthesis.speak(b);break;case "00006":c=a.substr(5,10);a=a.substr(16);a=Start00003_7(c,
a,6);b.text=a;window.speechSynthesis.speak(b);break;case "00007":c=a.substr(5,10);a=a.substr(16);a=Start00003_7(c,a,7);b.text=a;window.speechSynthesis.speak(b);break;case "00008":c=a.substr(5);Start00008(c);a="\u5e6b\u60a8\u7be9\u9078\u51fa\u60a8\u53ef\u80fd\u6709\u8208\u8da3\u7684\u5730\u9ede";b.text=a;window.speechSynthesis.speak(b);break;case "00009":c=a.substr(5);a=Start00009(c);b.text=a;window.speechSynthesis.speak(b);break;default:b.text=a,window.speechSynthesis.speak(b),document.getElementById("mymap").style.display=
"none"}}$("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(a)};