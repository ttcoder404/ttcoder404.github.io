// Window Scroll
var windowScroll = function () {
    $(window).scroll(function () {

        var scrollPos = $(this).scrollTop();
        
        var system ={win : false,mac : false,xll : false};
        
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        
        if(system.win||system.mac||system.xll){
            if ($(window).scrollTop() > 70)
            {
                $('.site-header').addClass('site-header-nav-scrolled');
            } else {
                $('.site-header').removeClass('site-header-nav-scrolled');
            }
        }else{
            
            if ($(window).scrollTop() > 40) 
            {
                $('.site-header').addClass('site-header-nav-scrolled-ph');
            } else {
                $('.site-header').removeClass('site-header-nav-scrolled-ph');
            }
        }
 });
};

var getHiddenProp = function () {
    var t = ["webkit", "moz", "ms", "o"];
    if ("hidden"in document)
        return "hidden";
    for (var e = 0; e < t.length; e++)
        if (t[e] + "Hidden"in document)
            return t[e] + "Hidden";
    return null
}

$( document ).ready(function() {
    windowScroll();

    // var t = this.getHiddenProp();
    // this.evtname = t.replace(/[H|h]idden/, "") ,
    document.addEventListener(getHiddenProp())

    switch (document[this.getHiddenProp()]) {
        case "visible":
            document.title = "被发现啦(*´∇｀*)---" 
            break;
        case "hidden":
        default:
            document.title = "藏好啦(つд⊂)---"
        }
    
    var menuwidth  = 140; // 边栏宽度
    var menuspeed  = 400; // 边栏滑出耗费时间
    
    var $bdy       = $('body');
    var $burger    = $('#nav');
    var $snav      = $('.site-header');
    var negwidth   = "-"+menuwidth+"px";
    var poswidth   = menuwidth+"px";
    
    $('.nav_menu').on('click',function(e){
        if($bdy.hasClass('openmenu')) {
        jsAnimateMenu('close');
        } else {
        jsAnimateMenu('open');
        }
    });
    
    $('.overlay').on('click', function(e){
        if($bdy.hasClass('openmenu')) {
        jsAnimateMenu('close');
        }
    });

    $('.overlay').bind("touchmove", function (e) {
        e.preventDefault();
    });

    function jsAnimateMenu(tog) {
        if(tog == 'open') {
          $bdy.addClass('openmenu');
          
          $bdy.animate({marginLeft: negwidth, marginRight: poswidth}, menuspeed);
          $burger.animate({width: poswidth}, menuspeed);
          $snav.animate({left: '-140px'}, menuspeed);
          $('.overlay').animate({right: poswidth}, menuspeed);
        }
        
        if(tog == 'close') {
          $bdy.removeClass('openmenu');
          
          $bdy.animate({marginLeft: "0", marginRight: "0"}, menuspeed);
          $burger.animate({width: "0"}, menuspeed);
          $snav.animate({left: '0px'}, menuspeed);
          $('.overlay').animate({right: "0"}, menuspeed);
        }
    }
    
});