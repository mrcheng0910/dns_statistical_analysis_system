/* Formatting function for row details - modify as you need */
function format (d) {
    var head_table = '<thead><tr><th>请求域名</th><th>数量</th><th>响应域名</th><th>数量</th></tr></thead>'
    var format_tb = "";
    var dict_lenght = Object.keys(d[7]).length;
    var first = [];
    var second = [];
    var third = [];
    var fourth = [];
    if (dict_lenght < Object.keys(d[8]).length){
        dict_lenght = Object.keys(d[8]).length;
    }

    for (var i in d[7]){
        first.push(i);
        second.push(d[7][i]);
    }
    for (var i in d[8]){
        third.push(i);
        fourth.push(d[8][i]);
    }
    for (var i=0;i<dict_lenght;i++){
        format_tb +=
            '<tr>'+
                '<td>'+first[i]+'</td>'+
                '<td>'+second[i]+'</td>'+
                '<td>'+third[i]+'</td>'+
                '<td>'+fourth[i]+'</td>'+
            '</tr>'
    }
    //for(var i in d[7]){
    //    format_tb +=
    //        '<tr>'+
    //            '<td>'+i+'</td>'+
    //            '<td>'+d[7][i]+'</td>'+
    //        '</tr>'
    //}
    return '<table class="table table-striped table-bordered table-hover" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            head_table + format_tb+'</table>'
}


function initDatePicker(){
     //初始化日期控件
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
}


function getData(domain,startDate,endDate){
     $.ajax({
            url: '/content/get-data',
            type: "get",
            data: {
                domain: domain,
                start: startDate,
                end: endDate,
                stamp: Math.random()   // preventing "get" method using cache send to client
            },
            timeout: 5000, //超时时间
            success: function (data) {  //成功后的处理
                var dataSet = [];
                //json格式化原始数据
                rawData = JSON.parse(data);
                for(var i=0,arrLength=rawData.length; i<arrLength; i++) {
                    val = rawData[i];
                    dataSet.push([" ",val.visit_time,val.pkt_count,val.qry_pkt,val.resp_pkt,val.qry_domain_count,val.resp_domain_count,val.qry_domains,val.resp_domains]);
                }
                drawTable(domain,dataSet);

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

function drawTable(domain,dataSet){

    //$('#dataTables-example').dataTable().fnDestroy();

    table = $('#dataTables-example').DataTable({
        responsive: true,
        "data": dataSet,
        "bDestroy": true,
        "columns": [
            {
                "class": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {"title": "访问时间" },
            {"title": "报文数量" },
            {"title": "请求报文数量" },
            //下列代码用来添加链接
            //{"title": "响应报文数量","class":'resp-content',"render": function ( data, type, row ) {
            //                                    return '<a>' + data + '</a>'
            //    }},
            {"title": "响应报文数量","class": "resp-content"},
            {"title": "请求域名数量"},
            {"title": "响应域名数量"}


        ],
        "order": [[1, 'asc']]
    });

    // 控制隐藏和显示按钮
    $('#dataTables-example tbody').on('click', 'td.details-control', function (){
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data())).show();
            tr.addClass('shown');
        }
    });

    //控制详细应答信息
    $('#dataTables-example tbody').on('click', 'td.resp-content',function(){
        var url='/content/resp?domain='+domain;

        var tr = $(this).closest('tr');
        var row = table.row(tr);
        url = url + '&visit_time='+row.data()[1]
        layer.open({
            type: 2,
            title: '应答报文详细信息',
            maxmin: true,
            shadeClose: true, //点击遮罩关闭层
            area : ['100%' , '100%'],
            //content: '/content/resp?domain='+'baidu.com'
            content: url
        });
    });


}

$(document).ready(function(){

    initDatePicker();  //初始化日期控件
    var domain = "baidu.com";
    var startDate = $("#start_date").val(); //获取初始化后页面的起始日期
    var endDate = $("#end_date").val(); //获取初始化后页面的终止日期

    getData(domain,startDate,endDate);

    $("#query").bind('click',function(){  //为查询按钮绑定查询函数
        //table.fnClearTable();
        domain = $("#domain").val();
        startDate = $("#start_date").val();
        endDate = $("#end_date").val();
        $('#dataTables-example tbody').off('click','td.details-control');  //重要，为了去掉多次bind按钮事件
        $('#dataTables-example tbody').off('click','td.resp-content');  //重要，为了去掉多次bind按钮事件
        getData(domain,startDate,endDate);
    });

} );