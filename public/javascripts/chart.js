var air = Highcharts.chart('air', {

    title: {
        text: 'Air Condition',
        align: 'center'
    },

    yAxis: {
        title: {
            text: '(ppm)'
        }
    },

    xAxis: [{
        categories: [],
        tickWidth: 1,
        tickLength: 20
    }],

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    series: [{
        name: 'CH4',
        data: [],
    }, {
        name: 'CH',
        data: [],
    }, {
        name: 'CO',
        data: [],
    }],
});

var temphumichart = Highcharts.chart('temp_humi', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Temperature - Humidity'
    },

    xAxis: [{
        categories: [],
        tickWidth: 1,
        tickLength: 20
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Temperature (°C)',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
    }, { // Secondary yAxis
        title: {
            text: 'Humidity(%)',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
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
        type: 'spline',
        data: [],
        tooltip: {
            valueSuffix: '°C'
        },
        zones: [{
            value: 10,
            color: '#ff0015'
        }, {
            value: 30,
            color: '#141107'
        }, {
            color: '#ff0015'
        }],
    }],
});

socket.on("server-send-temp-humi-graph", function (data) {
    temphumichart.series[0].setData(data.temp);
    temphumichart.series[1].setData(data.humi);
});

socket.on("server-send-air-graph", function (data) {
    var ch4 = data.ch4.map(item => + item)
    var gas = data.gas.map(item => + item)
    var co = data.co.map(item => + item)

    air.series[0].setData(ch4);
    air.series[1].setData(gas);
    air.series[2].setData(co);
});

socket.on("server-send-date-graph", function (data) {
    temphumichart.xAxis[0].setCategories(data);
    air.xAxis[0].setCategories(data);
});
