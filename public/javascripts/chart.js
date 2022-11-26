// Highcharts.addEvent(Highcharts.Point, 'click', function () {
//     if (this.series.options.className.indexOf('popup-on-click') !== -1) {
//         const chart = this.series.chart;
//         const date = Highcharts.dateFormat('%A, %b %e, %Y', this.x);
//         const text = `<b>${date}</b><br/>${this.y} ${this.series.name}`;

//         const anchorX = this.plotX + this.series.xAxis.pos;
//         const anchorY = this.plotY + this.series.yAxis.pos;
//         const align = anchorX < chart.chartWidth - 200 ? 'left' : 'right';
//         const x = align === 'left' ? anchorX + 10 : anchorX - 10;
//         const y = anchorY - 30;
//         if (!chart.sticky) {
//             chart.sticky = chart.renderer
//                 .label(text, x, y, 'callout',  anchorX, anchorY)
//                 .attr({
//                     align,
//                     fill: 'rgba(0, 0, 0, 0.75)',
//                     padding: 10,
//                     zIndex: 7 // Above series, below tooltip
//                 })
//                 .css({
//                     color: 'white'
//                 })
//                 .on('click', function () {
//                     chart.sticky = chart.sticky.destroy();
//                 })
//                 .add();
//         } else {
//             chart.sticky
//                 .attr({ align, text })
//                 .animate({ anchorX, anchorY, x, y }, { duration: 250 });
//         }
//     }
// });


Highcharts.chart('chart', {

    chart: {
        reflow: true,
        zoomType: 'xy',
        events: {
            load: function(){
                var categories = this.xAxis[0].categories;
                var series1 = this.series[0]
                var series2 = this.series[1]
                socket.on("server-update-data", function (data) {
                    var x = data.time; 
                    var y = data.temp;  
                    var z = data.humi;
                    categories.push(data.time)
                    series1.addPoint(y, false, false, false);
                    series2.addPoint(z, false, false, false);
                    chart.redraw();
                });
            }
        }
    },
    title: {
        text: 'Humidity - Temperature'
    },
    xAxis: [{
        categories: []
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        title: {
            text: 'Humidity (%)',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
    }, { // Secondary yAxis
        title: {
            text: 'Temperature (°C)',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true,
    },
    series: [{
        name: 'Humidity',
        type: 'column',
        yAxis: 1,
        data: [],
        tooltip: {
            valueSuffix: '%'
        }
    }, {
        name: 'Temperature',
        color: '#8B0000',
        type: 'column',
        data: [],
        tooltip: {
            valueSuffix: '°C'
        },
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 991.98,
            },
        }]
    }
});