var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var mqtt = require('mqtt');

var indexRouter = require('./routes/index');
var exportData = require('./export');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

io.on('connection', function(socket) {
	socket.on('disconnect', function() {});

	// control led
	socket.on('led-1-change', function(data) {
		if (data == 'on') {
			console.log('Led 1 ON');
			// client.publish('led1', 'On');
		} else {
			console.log('Led 1 OFF');
			// client.publish('led1', 'Off');
		}
	})

	socket.on('led-2-change', function(data) {
		if (data == 'on') {
			console.log('Led 2 ON');
			// client.publish('led1', 'On');
		} else {
			console.log('Led 2 OFF');
			// client.publish('led1', 'Off');
		}
	})

	socket.on('led-3-change', function(data) {
		if (data == 'on') {
			console.log('Led 3 ON');
			// client.publish('led1', 'On');
		} else {
			console.log('Led 3 OFF');
			// client.publish('led1', 'Off');
		}
	})

	// send data to history page
	var sql1 = 'SELECT * FROM sensors ORDER BY ID';

	con.query(sql1, function (err, result, fields) {
		if (err) throw err;
		console.log('Data updated');
		var fullData = [];
		result.forEach(function (value) {
			var m_time = value.Time.toString().slice(4, 24);
			fullData.push({
				id: value.ID,
				time: m_time,
				temp: value.Temperature,
				humi: value.Humidity,
				light: value.Light
			});
		});
		io.sockets.emit('send-full', fullData);
	});
});

// mqtt
var options = {
	host: 'broker.emqx.io',
	port: 8883,
	protocol: 'mqtts',
	username: '',
	password: '',
};
var client = mqtt.connect(options);
var topic = 'hethongso';

client.on('connect', function() {
  	console.log('mqtt connect: ' + client.connected);
});

client.on('error', function(error) {
	console.log('mqtt false ' + error);
	process.exit(1);
});

client.subscribe(topic);

// database
var con = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'mothai34',
	database: 'hts',
});

var newTemp;
var newHumi;
var newLight;
var cnt_check = 0;

con.connect(function(err) {
	var sql = 'CREATE TABLE IF NOT EXISTS sensors (ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT, Time DATETIME NOT NULL, Temperature INT(3) NOT NULL, Humidity INT(3) NOT NULL, Light INT(5) NOT NULL)';
	
	if (err) throw err;
	console.log('database connected');
  
	con.query(sql, function (err) {
		if (err) throw err;
	});
});

client.on('message', function (topic, message, packet) {
	console.log('topic: ' + topic);
	console.log('message: ' + message);
	var objData = JSON.parse(message);
	
	if (topic == topic) {
		cnt_check = cnt_check + 1;
		newTemp = objData.Temperature;
		newHumi = objData.Humidity;
		newLight = objData.Light;
	}

	if (cnt_check == 1) {
		cnt_check = 0;
		var n = new Date();
		var month = n.getMonth() + 1;
		var Date_and_Time = n.getFullYear() + '/' + month + '/' + n.getDate() + '-' + n.getHours() + ':' + n.getMinutes() + ':' + n.getSeconds();
		var sql =
			"INSERT INTO sensors (Time, Temperature, Humidity, Light) VALUES ('" +
				Date_and_Time.toString() + "', '" + newTemp + "', '" + newHumi + "', '" + newLight + 
			"')";
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log('data inserted: ' + Date_and_Time + ' ' + newTemp + ' ' + newHumi + ' ' + newLight);
		});
		exportData(con, io);
	};
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// static files
app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
