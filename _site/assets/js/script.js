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
function getHiddenProp() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++) {
    if ((prefixes[i] + 'Hidden') in document)
    return prefixes[i] + 'Hidden';
    }
    
    // otherwise it's not supported
    return null;
}

function getVisibilityState() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];
    if ('visibilityState' in document) return 'visibilityState';
    for (var i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'VisibilityState') in document)
        return prefixes[i] + 'VisibilityState';
    }
    // otherwise it's not supported
    return null;
}
    
function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;
    
    return document[prop];
}

$( document ).ready(function() {
    windowScroll();

    var d = document.title;
    var t = getHiddenProp();
    console.log(t)
    var evtname = t.replace(/[H|h]idden/, "") + "visibilitychange"
    document.addEventListener(evtname, function () {        
        switch (document[getVisibilityState()]) {
            case "visible":
                document.title = d
                break;
            case "hidden":
                document.title = "(つд⊂)藏好啦快回来";
                break;
            default:
                document.title = d
        }
    },false);
    
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