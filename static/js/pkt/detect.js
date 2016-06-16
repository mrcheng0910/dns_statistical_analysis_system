//初始化页面以及绑定函数
$(function () {
    //初始化页面
    $('#datetimepicker-start').datetimepicker({
        format: "YYYY-MM-DD",
        defaultDate: new Date(),
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
    var domain = "baidu.com"
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


function init(categories,qry_pkt,resp_pkt){
    //更新数据趋势
    $("#detect_period").text('探测时间段为：'+categories[0]+'至'+categories[categories.length-1]);
    $('#container').highcharts({

        credits: {
            enabled: false,
        },
        chart: {
            type: 'column',
            zoomType: 'x'  //x轴方向缩放
        },
        title: {
            text: null
        },
        xAxis: {
            title:{
                text:'探测日期'
            },
            categories: categories,
            crosshair: true,
            tickInterval: 3
        },
        yAxis: {
            min: 0,
            title: {
                text: 'DNS报文数（个）'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            x: -5,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}个<br/>总数: {point.stackTotal}个'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: '请求包',
            data: qry_pkt
        }, {
            name: '响应包',
            data: resp_pkt
        }],
    });
}

function get_data(domain,start,end) {
    //ajax获取最新统计数据，并更新页面
    var raw_data;
    var categories =[];
    var qry_pkt = [];
    var resp_pkt = [];
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
                    qry_pkt.push(value.qry_pkt);
                    resp_pkt.push(value.resp_pkt);
                }
                init(categories,qry_pkt,resp_pkt);
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
