(function($) {
    var _options = {};
    var _container = {};
    jQuery.fn.MyDigitClock = function(options) {
        var id = $(this).get(0).id;
        _options[id] = $.extend({}, $.fn.MyDigitClock.defaults, options);
        return this.each(function() {
            _container[id] = $(this);
            showClock(id);
        });

        function showClock(id) {
            var d = new Date;
            var h = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();
            var w = d.getDay();
            var ampm = "";
            var week = "";
            var time = ((d.getMonth()+1)<10?"0":"")+(d.getMonth()+1)+"月"+(d.getDate()<10?"0":"")+d.getDate()+"日";
            
            if (_options[id].bAmPm) {
                if (h > 12) {
                    h = h - 12;
                    ampm = " PM";
                } else {
                    ampm = " AM";
                }
            }

            if (_options[id].bWeek) {
                var weeks = new Array("周日","周一","周二","周三","周四","周五","周六");
                week = weeks[w]
            }
            var templateStr = `<p>${_options[id].timeFormat}${ampm}</p><p class="month">${time}</p><p class="week">${week}</p>`;
            templateStr = templateStr.replace("{HH}", getDD(h));
            templateStr = templateStr.replace("{MM}", getDD(m));
            templateStr = templateStr.replace("{SS}", getDD(s));
            var obj = $("#" + id);
            obj.css("fontSize", _options[id].fontSize);
            obj.css("fontFamily", _options[id].fontFamily);
            obj.css("color", _options[id].fontColor);
            obj.css("background", _options[id].background);
            obj.css("fontWeight", _options[id].fontWeight);
            //change reading
            obj.html(templateStr)
            //toggle hands
            if (_options[id].bShowHeartBeat) {
                obj.find("#ch1").fadeTo(800, 0.1);
                obj.find("#ch2").fadeTo(800, 0.1);
            }
            setTimeout(function() {
                showClock(id)
            }, 1000);
        }

        function getDD(num) {
            return (num >= 10) ? num : "0" + num;
        }

        function refreshClock() {
            setupClock();
        }
    }
    //default values
    jQuery.fn.MyDigitClock.defaults = {
        fontSize: '50px',
        fontFamily: 'Microsoft JhengHei, Century gothic, Arial',
        fontColor: '#8ce428',
        fontWeight: 'bold',
        background: '#000',
        timeFormat: '{HH}<span id="ch1">:</span>{MM}<span id="ch2">:</span>{SS}',
        bShowHeartBeat: false,
        bAmPm: false,
        bWeek: false
    };

    //formatDate
    Date.prototype.format = function (pattern) {
        /*初始化返回值字符串*/
        var returnValue = pattern;
        /*正则式pattern类型对象定义*/
        var format = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "S": this.getMilliseconds(),
            "h+": (this.getHours() % 12),
            "a": (this.getHours() / 12) <= 1 ? "AM" : "PM"
        };
        /*遍历正则式pattern类型对象构建returnValue对象*/
        for (var key in format) {
            var regExp = new RegExp("(" + key + ")");
            if (regExp.test(returnValue)) {
                var zero = "";
                for (var i = 0; i < RegExp.$1.length; i++) { zero += "0"; }
                var replacement = RegExp.$1.length == 1 ? format[key] : (zero + format[key]).substring((("" + format[key]).length));
                returnValue = returnValue.replace(RegExp.$1, replacement);
            }
        }
        return returnValue;
    };

})(jQuery);