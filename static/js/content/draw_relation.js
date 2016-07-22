//初始化页面
function manageData(data){
    //rawData = JSON.parse(data);
    rawData = data;
    var nodes = [];
    var edges = [];
    for(var i=0; i<rawData[0].length; i++){
        //nodes.push(rawData[0][i])
        nodes.push({name:rawData[0][i]})

    }
    for (var i=0; i<rawData[1].length; i++){
        //alert(rawData[1][i][0]);
        edges.push( {  source: rawData[1][i][0], target: rawData[1][i][1]})
    }
    drawRelation(nodes,edges);
}

//绘制域名节点的关系图
function drawRelation(nodes,edges){

    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    var option = {
    title: {
        text: 'DNS响应结果关系图'
    },
    tooltip: {formatter:'{b}'},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series : [
        {
            type: 'graph',
            layout: 'force',
            symbolSize: 15,
            roam: true,    //动画
            draggable:true,    //节点可拖拽
            focusNodeAdjacency:true, //显示临接的点和边
            label: {
                normal: {
                    show: true,
                    position: 'right'
                    //formatter: '{b}'
                }
            },
            force:{
                initLayout:'circular',
                repulsion:350
            },

            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            lineStyle: {
                normal: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            },
            //edgeLabel: {
            //    normal: {
            //        //show:true,
            //        textStyle: {
            //            fontSize: 10
            //        },
            //        formatter:'nihao'
            //    }
            //},
            links: edges,
            data:nodes
             }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}