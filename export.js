var humi_graph = [];
var temp_graph = [];
var date_graph = [];

function exportData(con, io) {
    var new_temp;
    var new_humi;
    var date_time;
    var query = 'SELECT * FROM sensors ORDER BY ID DESC LIMIT 1';

    con.query(query, function (err, result, fields) {
        if (err) throw err;
        console.log("data selected");
        result.forEach(function (value) {
            date_time = value.Time.toString().slice(4, 24);
            new_temp = value.Temperature;
            new_humi = value.Humidity;
            newLight = value.Light;

            io.sockets.emit('server-update-data', { 
                id: value.ID,
                time: date_time,
                temp: value.Temperature,
                humi: value.Humidity,
                light: value.Light,
            })
        })

        if (humi_graph.length < 10) {
            humi_graph.push(new_humi);
        }
        else {
            for (i = 0; i < 9; i++) {
                humi_graph[i] = humi_graph[i + 1];
            }
            humi_graph[9] = new_humi;
        }

        if (temp_graph.length < 10) {
            temp_graph.push(new_temp);
        }
        else {
            for (u = 0; u < 9; u++) {
                temp_graph[u] = temp_graph[u + 1];
            }
            temp_graph[9] = new_temp;
        }

        if (date_graph.length < 10) {
            date_graph.push(date_time);
        }
        else {
            for (x = 0; x < 9; x++) {
                date_graph[x] = date_graph[x + 1];
            }
            date_graph[9] = date_time;
        }

        console.log(temp_graph)

        io.sockets.emit("server-send-humi-graph", humi_graph);
        io.sockets.emit("server-send-temp-graph", temp_graph);
        io.sockets.emit("server-send-date-graph", date_graph);
    });
};

module.exports = exportData;