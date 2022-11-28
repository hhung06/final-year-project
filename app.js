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

// control relay
io.on('connection', function(socket) {
	socket.on('disconnect', function() {});

	socket.on('led-1-change', function(data) {
		if (data == 'on') {
			console.log('Led 1 ON');
			client.publish('relay', 'on');
		} else {
			console.log('Led 1 OFF');
			client.publish('relay', 'off');
		}
	})
});

// mqtt
var client = mqtt.connect('mqtt://broker.emqx.io:1883', {clientID: 'ndhieu131020'});
var topic = 'ndhieu131020data';

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

con.connect(function(err) {
	var query = ` 
		CREATE TABLE IF NOT EXISTS sensors (
			ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			Time DATETIME NOT NULL,
			Temperature INT(3) NOT NULL,
			Humidity INT(3) NOT NULL,
			Light INT(5) NOT NULL
		);`
	
	if (err) throw err;
	console.log('database connected');
  
	con.query(query, function (err) {
		if (err) throw err;
	});
});

var new_temp;
var new_humi;
var new_light;
var cnt_check = 0;

client.on('message', function (topic, message, packet) {
	console.log('topic: ' + topic);
	console.log('message: ' + message);
	var objData = JSON.parse(message);
	
	if (topic == topic) {
		cnt_check = cnt_check + 1;
		new_temp = objData.Temperature;
		new_humi = objData.Humidity;
		new_light = objData.GasConcentration;
	}

	if (cnt_check == 1) {
		cnt_check = 0;
		var date = new Date();
		var month = date.getMonth() + 1;
		var date_time = date.getFullYear() + '/' + month + '/' + date.getDate() + '-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		var query =
			"INSERT INTO sensors (Time, Temperature, Humidity, Light) VALUES ('" +
				date_time.toString() + "', '" + new_temp + "', '" + new_humi + "', '" + new_light + 
			"')";
		con.query(query, function (err, result) {
			if (err) throw err;
			console.log('data inserted: ' + date_time + ' ' + new_temp + ' ' + new_humi + ' ' + new_light);
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
