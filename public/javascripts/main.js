var socket = io("http://localhost:3000");
//client send data to server
socket.on("server-update-data", function(data) {
    $('#currentTemp').html(data.temp);
    $('#currentHumi').html(data.humi);
    $('#currentLight').html(data.light);
})

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

function led2() {
    var checkBox = document.getElementById("led2");
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("led-2-change", "on")
    } else {
        // alert('LED Off')
        socket.emit("led-2-change", "off")
    }
}

function led3() {
    var checkBox = document.getElementById("led3");
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("led-3-change", "on")
    } else {
        // alert('LED Off')
        socket.emit("led-3-change", "off")
    }
}
