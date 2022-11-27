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
                    if (series1.data.length == 5) {
                        series1.data.shift()
                    }
                    if (series1.data.length == 5) {
                        series2.data.shift()
                    }
                    series1.data.push(y)
                    series2.data.push(z)
                    categories.push(data.time)
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