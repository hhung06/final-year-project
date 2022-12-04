var socket = io("http://localhost:3000");

//client receive data from server
socket.on("server-update-data", function(data) {
    $('#currentTemp').html(data.temp);
    $('#currentHumi').html(data.humi);
    $('#currentCH4').html(data.ch4);
    $('#currentGas').html(data.gas);
    $('#currentCO').html(data.co);
});