var chart = Highcharts.chart('chart', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Đồ thị nhiệt độ - độ ẩm'
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
            text: 'Nhiệt độ (°C)',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
    }, { // Secondary yAxis
        title: {
            text: 'Độ ẩm(%)',
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
        name: 'Độ ẩm',
        type: 'column',
        yAxis: 1,
        data: [],
        tooltip: {
            valueSuffix: '%'
        }

    }, {
        name: 'Nhiệt độ',
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

socket.on("server-send-humi_graph", function (data) {
    chart.series[0].setData(data);
});

socket.on("server-send-temp_graph", function (data) {
    chart.series[1].setData(data);
});

socket.on("server-send-date_graph", function (data) {
    chart.xAxis[0].setCategories(data);
});

// ------------- RTC ------------
var timeDisplay = document.getElementById("time");

function refreshTime() {
    var dateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    var formattedString = dateString.replace(", ", " - ");
    timeDisplay.innerHTML = formattedString;
}

setInterval(refreshTime, 1000);