//初始化页面以及绑定函数
$(function () {
    //初始化页面
    current_date = new Date();
    last_date = current_date.setMonth(current_date.getMonth() - 1);
    $('#datetimepicker-start').datetimepicker({
        format: "YYYY-MM-DD",
        defaultDate: last_date,
        showTodayButton: true
    });
    $('#datetimepicker-end').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        format: "YYYY-MM-DD",
        defaultDate: new Date(),
        showTodayButton: true
    });
    $("#datetimepicker-start").on("dp.change", function (e) {
        $('#datetimepicker-end').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker-end").on("dp.change", function (e) {
        $('#datetimepicker-start').data("DateTimePicker").maxDate(e.date);
    });

    //var domain = $("#domain").val();
    var domain = "baidu.com";
    var start = $("#start_date").val(); //获取初始化后页面的起始日期
    var end = $("#end_date").val(); //获取初始化后页面的终止日期
    
    get_data(domain,start,end);  //初始化
    
    $("#query").bind('click',function(){  //为查询按钮绑定查询函数
        domain = $("#domain").val();
        start = $("#start_date").val();
        end = $("#end_date").val();
        get_data(domain,start,end);
    });
});


function init(categories,pkt_count){
    //更新数据趋势
    $("#detect_period").text('探测时间段为：'+categories[0]+'至'+categories[categories.length-1]);
     $('#container').highcharts({
         credits: {
            enabled: false
         },
        chart: {
            zoomType: 'x'
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime'
            //minRange: 14 * 24 * 3600000 // fourteen days
        },
        yAxis: {
            title: {
                text: '报文数量（个）'
            }
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: ' DNS报文数量',
            //pointInterval: 24 * 3600 * 1000,
            //pointStart: Date.UTC(2006, 0, 1),
            //data: [
            //   [Date.UTC(2010, 0, 1,12,5,6), 29.9],
            //    [Date.UTC(2010, 0, 2), 71.5],
            //    [Date.UTC(2010, 0, 3), 106.4],
            //    [Date.UTC(2010, 0, 6), 129.2],
            //    [Date.UTC(2010, 0, 7), 144.0],
            //    [Date.UTC(2010, 0, 8), 176.0]
            //
            //]
            data:pkt_count
        }]
    });
}

function get_data(domain,start,end) {
    //ajax获取最新统计数据，并更新页面
    var raw_data;
    var categories =[];
    var qry_pkt = [];
    var resp_pkt = [];
    var pkt_count = [];
    $.ajax({
            url: '/pkt/same-day',
            type: "get",
            data: {
                domain: domain,
                start: start,
                end: end,
                stamp: Math.random()   // preventing "get" method using cache send to client
            },
            timeout: 5000, //超时时间
            success: function (data) {  //成功后的处理
                //json格式化原始数据
                rawData = JSON.parse(data);
                var value;
                for(var i=0,arrLength=rawData.length; i<arrLength; i++){
                    value = rawData[i];
                    categories.push(value.visit_time);
                    // 8*60*60*1000,是转换为北京时间，单位为毫秒
                    pkt_count.push([Date.parse(value.visit_time)+(8*60*60*1000),value.qry_pkt+value.resp_pkt]);

                }
                init(categories,pkt_count);
            },
            error: function (xhr) {
                if (xhr.status == "0") {
                    alert("超时，稍后重试");
                } else {
                    alert("错误提示：" + xhr.status + " " + xhr.statusText);
                }
            } // 出错后的处理
        });
}