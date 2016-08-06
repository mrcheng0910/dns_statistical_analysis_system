function format (d) {
    var head_table = '<thead><tr><th>请求域名</th><th>响应类型</th><th>响应内容</th><th>地理位置</th><th>运营商</th></tr></thead>'
    // dict_lenght = Object.keys(d[8]).length;
    var format_tb="";
    for (var i= 0;i<d[4].length;i++){
        var geo = d[4][i].geo;
        var network = d[4][i].network_operator;
        var dmType = d[4][i].dm_type;
        var domainName = d[4][i].domain_name;
        var dmData = d[4][i].dm_data;
        if (geo == undefined){
            geo = "";
        }
        if (network==undefined){
            network = "";
        }
        if(network == '0'){
            network = "未知"
        }
        // alert(geo+network+dmType+dmData+domainName);
        format_tb +=
            '<tr>'+
                '<td>'+domainName+'</td>'+
                '<td>'+dmType+'</td>'+
                '<td>'+dmData+'</td>'+
                '<td>'+geo+'</td>'+
                '<td>'+network+'</td>'+
            '</tr>'


    }

    return '<table class="table table-striped table-bordered table-hover" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            head_table + format_tb+'</table>'
}
function getData(domain,detected,detected_network,dns_geo,dns_network,dns){
    // alert(domain+detected+detected_network+dns_geo+dns_network+dns)
    $.ajax({
        url: '/content/get-details-data',
        type: "get",
        data: {
            domain: domain,
            detected:detected,
            detected_network:detected_network,
            dns_geo:dns_geo,
            dns_network:dns_network,
            dns:dns,
            stamp: Math.random()   // 防止get方法使用缓存
        },
        timeout: 5000, //超时时间
        success: function (data) {  //成功后的处理
            var dataSet = manageData(data);
            drawTable(dataSet);
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


function manageData(data) {
    var dataSet = [];
    var rawData = JSON.parse(data);
    var detailData = rawData[0];
    var visiTotal = detailData.visit_total;
    var domainCount = detailData.domain_count;
    for(var i=0;i<detailData.details.length;i++){
        dataSet.push([" ",detailData.details[i].qry_name,detailData.details[i].visit_count,detailData.details[i].answers.length,detailData.details[i].answers]);
    }

    var city = [];
    var network = [];

    for(i=0;i<rawData[1].length;i++){
        city.push([rawData[1][i][0],rawData[1][i][1]])
    }

    for(i=0;i<rawData[2].length;i++){
        if (rawData[2][i][0]=='0') {
            network.push(["未知", rawData[2][i][1]])
        }
        else {
            network.push([rawData[2][i][0],rawData[2][i][1]])
        }
    }

    return [dataSet,domainCount,visiTotal,city,network]
}


function drawTable(dataSet) {

    $("#domain-count").val(dataSet[1]);
    $("#visit-total").val(dataSet[2]);
    table = $('#dataTables-example').DataTable({
        responsive: true,
        "data": dataSet[0],
        "bDestroy": true,
        "columns": [
            {
                "class": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {"title": "域名"},
            {"title": "解析次数"},
            {"title": "结果数量"},
            {
                "title": "操作",
                "data":null,
                "class":'test-btn',
                "defaultContent": "<button class='btn btn-danger'>删除数据</button>"
            }
        ],
        "order": [[1, 'asc']]
    });
    // 控制隐藏和显示按钮
    $('#dataTables-example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        // alert("nj")
        var row = table.row(tr);
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
    //删除功能
    $('#dataTables-example tbody').on( 'click', 'td.test-btn', function () {
        var data = table.row( $(this).parents('tr') ).data();
        // alert("niah")

        layer.confirm(
            '<label>确认删除域名： '+data[1]+' ?</label>',
            {

              btn: ['确认','取消'] //按钮
            },
            function(){
                deleteData(data[1]);
                layer.msg('删除成功', {icon: 1});
                $('#dataTables-example tbody').off('click','td.details-control');  //重要，为了去掉多次bind按钮事件
                 $('#dataTables-example tbody').off('click','td.test-btn');  //重要，为了去掉多次bind按钮事件
            },
            function(){

              layer.msg('取消删除', {
              });
            });
    } );
    drawPie("#container",dataSet[3]);
    drawPie("#container1",dataSet[4]);
}

//删除数据
function deleteData(qry_name) {
    var domain = $("#domain").val();
    var detected = $("#detected").val();
    var detected_network = $("#detected-network").val();
    var dns_geo = $("#dns-geo").val();
    var dns_network = $("#dns-network").val();
    var dns = $("#dns").val();
    $.ajax({
            url: '/content/delete-data',
            type: "get",
            data: {
                domain: domain,
                detected:detected,
                detected_network:detected_network,
                dns_geo:dns_geo,
                dns_network:dns_network,
                dns:dns,
                qry_name:qry_name,
                stamp: Math.random()   // 防止get方法使用缓存
            },
            timeout: 5000, //超时时间
            success: function (data) {  //成功后的处理

                var dataSet = manageData(data);
                drawTable(dataSet);
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

//绘制饼图
function drawPie(container,data) {
    $(container).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}个</b>'
        },
        plotOptions: {
            pie: {
                // size: '70%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} 个',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'IP数量',
            data: data
        }]
    });
}

$(document).ready(function(){

    //初始化页面
    var domain = $("#domain").val();
    var detected = $("#detected").val();
    var detected_network = $("#detected-network").val();
    var dns_geo = $("#dns-geo").val();
    var dns_network = $("#dns-network").val();
    var dns = $("#dns").val();
    getData(domain,detected,detected_network,dns_geo,dns_network,dns);

    //为查询按钮绑定回车事件，记得在form控件里，禁止回车事件
    $(document).keydown(function(event){
        if(event.keyCode==13){
        $("#query").click();
        }
    });

    //为查询按钮绑定事件
     $("#query").click(function(){
         var domain = $("#domain").val();
         var detected = $("#detected").val();
         var detected_network = $("#detected-network").val();
         var dns_geo = $("#dns-geo").val();
         var dns_network = $("#dns-network").val();
         var dns = $("#dns").val();
         $('#dataTables-example tbody').off('click','td.details-control');  //重要，为了去掉多次bind按钮事件
         $('#dataTables-example tbody').off('click','td.test-btn');  //重要，为了去掉多次bind按钮事件
         getData(domain,detected,detected_network,dns_geo,dns_network,dns);
    });

} );

