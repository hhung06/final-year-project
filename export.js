var humi_graph = [];
var temp_graph = [];
var date_graph = [];

function exportData(con, io) {
    var m_time
    var newTemp
    var newHumi
    var m_time;
    var sql1 = 'SELECT * FROM sensors ORDER BY ID DESC LIMIT 1';

    con.query(sql1, function (err, result, fields) {
        if (err) throw err;
        console.log("data selected");
        result.forEach(function (value) {
            m_time = value.Time.toString().slice(4, 24);
            newTemp = value.Temperature;
            newHumi = value.Humidity;
            newLight = value.Light;

            io.sockets.emit('server-update-data', { 
                id: value.ID,
                time: m_time,
                temp: value.Temperature,
                humi: value.Humidity,
                light: value.Light,
            })
        })

        if (humi_graph.length < 10) {
            humi_graph.push(newHumi);
        }
        else {
            for (i = 0; i < 9; i++) {
                humi_graph[i] = humi_graph[i + 1];
            }
            humi_graph[9] = newHumi;
        }

        if (temp_graph.length < 10) {
            temp_graph.push(newTemp);
        }
        else {
            for (u = 0; u < 9; u++) {
                temp_graph[u] = temp_graph[u + 1];
            }
            temp_graph[9] = newTemp;
        }

        if (date_graph.length < 10) {
            date_graph.push(m_time);
        }
        else {
            for (x = 0; x < 9; x++) {
                date_graph[x] = date_graph[x + 1];
            }
            date_graph[9] = m_time;
        }

        console.log(temp_graph)

        io.sockets.emit("server-send-humi_graph", humi_graph);
        io.sockets.emit("server-send-temp_graph", temp_graph);
        io.sockets.emit("server-send-date_graph", date_graph);
    });
};

module.exports = exportData;