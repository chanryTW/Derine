// Settings, available positions
var points = $("li").toArray();
var thisisit;

// unwrapp a jquery element into a html element
var myElement = $("button.fab").get(0);
// create a new Hammer element
var hammertime = new Hammer(myElement);

// 依照視窗寬高計算比例
var getheight = $(window).height();
var getwidth = $(window).width();
var newpositionleft;
var newpositiontop;

document.ontouchmove = function(event){
    event.preventDefault();
}

// FAB 的初始位置 (中間50,50;右下角90,85)
//  var btnSendWidth =  423*(getheight/667);
 var btnSendWidth =  375*(getheight/667);
 

$('.wrapp').css({
    "width": btnSendWidth+"px"
});

// 設定Hammer的手勢
hammertime.get('press').set({ time: 500,threshold: 50, enable: true});
hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL ,threshold: 0, velocity: 0 ,enable: false})
//hammertime.get('tap').set({})

hammertime.on('tap', function() {
    $('button.fab').animate({
        background: "rgb(255,255,255)"
    }, 500 );
    //點擊後動作在此
	switchRecognition()
});

// 按鈕定位
function where(pointerleft,pointertop) {
    for(i = points.length - 1; i >= 1; i--){

			var topposition = points[i].offset.top;
            var leftposition = points[i].offset.left;

            // 檢查上和左位置
            if (    topposition <= pointertop && 
                    leftposition <= pointerleft)
            {
            
            // 用寬度和高度來計算區塊
              if (    pointerleft < leftposition + points[i].width && 
                      pointertop < topposition + points[i].height)
                            {
                            
                            // 檢查是否活動點
                            activestatus = $(`li#${points[i].id}`).hasClass('point-active');
                            if (activestatus === true){

                                // 浮動效果
                                $(`li#${points[i].id}`).addClass('point-hover');
                                // 設定用於定位按鈕的變數
                                thisisit = points[i].id;
                            }
                    else { $(`li#${points[i].id}`).removeClass('point-hover'); }       
            }
            else { $(`li#${points[i].id}`).removeClass('point-hover');}
        }
        else { $(`li#${points[i].id}`).removeClass('point-hover');}
        }
    }

// 建立矩陣 正確數據
    function generate() {
        for (i = 0; i < points.length; i++ ){ 
            points[i].offset = $(`ul.layer li#${[i]}`).offset();
            points[i].width = $(`ul.layer li#${[i]}`).width();
            points[i].height = $(`ul.layer li#${[i]}`).height();
        };
    }

// 當按鈕長按時
hammertime.on('press', function(event) {

    // 淡入圖層
    $('div.raster').removeClass('hide');
    $('div.raster').fadeIn();                
    $('button.fab').addClass('elevated');

    // 呼叫函數填入數值
    generate();

    //position the pointer and FAB, call the posioning function
    pointerleft = event.pointers[0].pageX;
    pointertop = event.pointers[0].pageY;
    where(pointerleft,pointertop);
    
    hammertime.get('pan').set({enable: true})
    //開啟Hammer拖曳
    hammertime.on('panmove', function(event) {
        
        //position the pointer and FAB, call the posioning function
        pointertop = event.pointers[0].pageY;
        pointerleft = event.pointers[0].pageX;

        $('button.fab').css( "top", event.pointers[0].pageY -30 );
        $('button.fab').css( "left", event.pointers[0].pageX -30 );

        //呼叫定位函數，新位置
        where(pointerleft,pointertop);
    
    }); 

 });

// FAB發布
hammertime.on('panend pressup', function() {

    var elementsizew = points[thisisit].width;
    var elementsizeh = points[thisisit].height;
    var elementpositiontop = points[thisisit].offset.top;
    var elementpositiontleft = points[thisisit].offset.left;
    
    newpositiontop = (elementsizeh / 2 + Math.round(elementpositiontop)) / (getheight / 100) - (30 / (getheight / 100));
    newpositionleft = (elementsizew / 2 + Math.round(elementpositiontleft)) / (getwidth / 100) - (30 / (getwidth / 100));
    // removing classes in jQuery
    $('button.fab').removeClass('highlight');
    $('button.fab').removeClass('elevated');    
    $('div.raster').fadeOut();  

    $('button.fab').css( "top", (newpositiontop + "%") );
    $('button.fab').css( "left", (newpositionleft + "%") );
    $('button.fab').css( "transition", "top 100ms ease-in 0" );

    hammertime.get('pan').set({enable: false})
});


