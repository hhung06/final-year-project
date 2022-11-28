var socket = io("http://localhost:3000");

//client receive data from server
socket.on("server-update-data", function(data) {
    $('#currentTemp').html(data.temp);
    $('#currentHumi').html(data.humi);
    $('#currentLight').html(data.light);
})

//client send data to server
function led1() {
    var checkBox = document.getElementById("led1");
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("led-1-change", "on")
    } else {
        // alert('LED Off')
        socket.emit("led-1-change", "off")
    }
}