function manageData(data){
    //rawData = JSON.parse(data);
    var rawData = data;
    var domainData = [];
    var city = [];
    var network = [];
    for(var i=0;i<rawData[0].length;i++){
        domainData.push([{'name':rawData[0][i][0].name+'市'},{'name':rawData[0][i][1].name,'value':rawData[0][i][1].value}]);
    }

    for(var i=0;i<rawData[1].length;i++){
        city.push([rawData[1][i][0],rawData[1][i][1]])
    }

    for(var i=0;i<rawData[2].length;i++){
        if (rawData[2][i][0]=='') {
            network.push(["bo", rawData[2][i][1]])
        }
        else {
            network.push([rawData[2][i][0],rawData[2][i][1]])
        }
    }
    drawGeo(domainData);
    drawPie("#container",city);
    drawPie("#container1",network);

}


// $(document).ready(function(){
//
//     // drawGeo();
//     var domain = "baidu.com";
//     var detectGeo = "威海";
//     var detectNetwork = "联通";
//     var dnsGeo = "杭州";
//     var dnsNetwork = "阿里云";
//     var dnsIp = "223.5.5.5";
//
// } );

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


function drawGeo(domainData, detected) {
    var chart = echarts.init(document.getElementById('main'));
    // domainData = [
    //     [{'name':"威海市"},{'name':'上海市','value':2}],
    //     [{'name':"威海市"},{'name':'威海市','value':2}]
    // ]
    var geoCoordMap = {
        '上海市': [121.4648,31.2891],
        '东莞市': [113.8953,22.901],
        '东营市': [118.7073,37.5513],
        '中山市': [113.4229,22.478],
        '临汾市': [111.4783,36.1615],
        '临沂市': [118.3118,35.2936],
        '丹东市': [124.541,40.4242],
        '丽水市': [119.5642,28.1854],
        '乌鲁木齐市': [87.9236,43.5883],
        '佛山市': [112.8955,23.1097],
        '保定市': [115.0488,39.0948],
        '兰州市': [103.5901,36.3043],
        '包头市': [110.3467,41.4899],
        '北京市': [116.4551,40.2539],
        '北海市': [109.314,21.6211],
        '南京市': [118.8062,31.9208],
        '南宁市': [108.479,23.1152],
        '南昌市': [116.0046,28.6633],
        '南通市': [121.1023,32.1625],
        '厦门市': [118.1689,24.6478],
        '台州市': [121.1353,28.6688],
        '合肥市': [117.29,32.0581],
        '呼和浩特市': [111.4124,40.4901],
        '咸阳市': [108.4131,34.8706],
        '哈尔滨市': [127.9688,45.368],
        '唐山市': [118.4766,39.6826],
        '嘉兴市': [120.9155,30.6354],
        '大同市': [113.7854,39.8035],
        '大连市': [122.2229,39.4409],
        '天津市': [117.4219,39.4189],
        '太原市': [112.3352,37.9413],
        '威海市': [121.9482,37.1393],
        '宁波市': [121.5967,29.6466],
        '宝鸡市': [107.1826,34.3433],
        '宿迁市': [118.5535,33.7775],
        '常州市': [119.4543,31.5582],
        '广州市': [113.5107,23.2196],
        '廊坊市': [116.521,39.0509],
        '延安市': [109.1052,36.4252],
        '张家口市': [115.1477,40.8527],
        '徐州市': [117.5208,34.3268],
        '德州市': [116.6858,37.2107],
        '惠州市': [114.6204,23.1647],
        '成都市': [103.9526,30.7617],
        '扬州市': [119.4653,32.8162],
        '承德市': [117.5757,41.4075],
        '拉萨市': [91.1865,30.1465],
        '无锡市': [120.3442,31.5527],
        '日照市': [119.2786,35.5023],
        '昆明市': [102.9199,25.4663],
        '杭州市': [119.5313,29.8773],
        '枣庄市': [117.323,34.8926],
        '柳州市': [109.3799,24.9774],
        '株洲市': [113.5327,27.0319],
        '武汉市': [114.3896,30.6628],
        '汕头市': [117.1692,23.3405],
        '江门市': [112.6318,22.1484],
        '沈阳市': [123.1238,42.1216],
        '沧州市': [116.8286,38.2104],
        '河源市': [114.917,23.9722],
        '泉州市': [118.3228,25.1147],
        '泰安市': [117.0264,36.0516],
        '泰州市': [120.0586,32.5525],
        '济南市': [117.1582,36.8701],
        '济宁市': [116.8286,35.3375],
        '海口市': [110.3893,19.8516],
        '淄博市': [118.0371,36.6064],
        '淮安市': [118.927,33.4039],
        '深圳市': [114.5435,22.5439],
        '清远市': [112.9175,24.3292],
        '温州市': [120.498,27.8119],
        '渭南市': [109.7864,35.0299],
        '湖州市': [119.8608,30.7782],
        '湘潭市': [112.5439,27.7075],
        '滨州市': [117.8174,37.4963],
        '潍坊市': [119.0918,36.524],
        '烟台市': [120.7397,37.5128],
        '玉溪市': [101.9312,23.8898],
        '珠海市': [113.7305,22.1155],
        '盐城市': [120.2234,33.5577],
        '盘锦市': [121.9482,41.0449],
        '石家庄市': [114.4995,38.1006],
        '福州市': [119.4543,25.9222],
        '秦皇岛市': [119.2126,40.0232],
        '绍兴市': [120.564,29.7565],
        '聊城市': [115.9167,36.4032],
        '肇庆市': [112.1265,23.5822],
        '舟山市': [122.2559,30.2234],
        '苏州市': [120.6519,31.3989],
        '莱芜市': [117.6526,36.2714],
        '菏泽市': [115.6201,35.2057],
        '营口市': [122.4316,40.4297],
        '葫芦岛市': [120.1575,40.578],
        '衡水市': [115.8838,37.7161],
        '衢州市': [118.6853,28.8666],
        '西宁市': [101.4038,36.8207],
        '西安市': [109.1162,34.2004],
        '贵阳市': [106.6992,26.7682],
        '连云港': [119.1248,34.552],
        '邢台市': [114.8071,37.2821],
        '邯郸市': [114.4775,36.535],
        '郑州市': [113.4668,34.6234],
        '鄂尔多斯': [108.9734,39.2487],
        '重庆市': [107.7539,30.1904],
        '金华市': [120.0037,29.1028],
        '铜川市': [109.0393,35.1947],
        '银川市': [106.3586,38.1775],
        '镇江市': [119.4763,31.9702],
        '长春市': [125.8154,44.2584],
        '长沙市': [113.0823,28.2568],
        '长治市': [112.8625,36.4746],
        '阳泉市': [113.4778,38.0951],
        '青岛市': [120.4651,36.3373],
        '韶关市': [113.7964,24.7028],
        '美国': [113.7964,45.7129],
        '益阳市': [112.20,28.36],
        '香港':[115.12,21.23],
        '欧洲':[111,111],
        '澳大利亚':[110,110]
    };

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[1].name];
            var toCoord = geoCoordMap[dataItem[0].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[1].name,
                    toName: dataItem[0].name,
                    coords: [fromCoord, toCoord]
                });
            }
        }
        return res;
    };

    var color = ['#a6c84c', '#ffa022', '#46bee9'];
    var series = [];
    [['威海市', domainData]].forEach(function (item, i) {
        series.push({
            name: item[0],
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 4,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
        },
        lineStyle: {
            normal: {
                color: color[i],
                width: 0,
                curveness: 0.2
            }
        },
        data: convertData(item[1])
    },
    {
        name: item[0],  //线条
        type: 'lines',
        zlevel: 2,
        effect: {
            show: true,
            period: 4,  //动画时间
            trailLength: 0,  //尾部长度
            symbol: 'arrow',
            symbolSize: 4
        },
        lineStyle: {
            normal: {
                color: color[i],
                width: 1,
                opacity: 0.4,
                curveness: 0.2
            }
        },
        data: convertData(item[1])
    },
    {
        name: item[0],
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}'

            }
        },
        symbolSize: function (val) {
            return val[2]+3;
        },
        itemStyle: {
            normal: {
                color: color[i]
            }
        },
        data: item[1].map(function (dataItem) {
            return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])

            };
        })
    }
    );
});


option = {
    backgroundColor: '#404a59',
    tooltip : {
        trigger: 'item',
        formatter: function (params, ticket, callback) {
            return 'IP个数:'+params.value[2]
        }
    },
    legend: {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        textStyle: {
            color: '#fff'
        },
        selectedMode: 'single'
    },
    geo: {
        map: 'china',
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    series: series
};

    chart.setOption(option);
}