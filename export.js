function exportData(con, io) {
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
    });
};

module.exports = exportData;