/* Formatting function for row details - modify as you need */
function format (d) {
    // `d` is the original data object for the row
    var format_tb = ""
    for(var i in d[6]){
        format_tb +=
            '<tr>'+
            '<td>'+i+'</td>'+
            '<td>'+d[6][i]+'</td>'+
            '</tr>'
    }
    return '<table class="table table-striped table-bordered table-hover" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            format_tb+'</table>'
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
                    dataSet.push([" ",val.visit_time,val.pkt_count,val.qry_pkt,val.resp_pkt,val.domain_count,val.domains]);
                }
                $('#dataTables-example').dataTable().fnDestroy();
                table = $('#dataTables-example').DataTable( {
                    responsive: true,
                    "data": dataSet,
                    //"bDestroy": true,
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
                        {"title": "响应报文数量"},
                        {"title": "域名数量"}
                    ],
                    "order": [[1, 'asc']]
                });

                //datatable.rows.add(newDataArray);
                // datatable.draw();
                // 控制隐藏和显示按钮
                $('#dataTables-example tbody').on('click', 'td.details-control', function (){
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    //alert("nihao")
                    if ( row.child.isShown() ) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        // Open this row
                        row.child( format(row.data())).show();
                        tr.addClass('shown');
                        return
                    }
                });
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
        getData(domain,startDate,endDate);
    });

} );