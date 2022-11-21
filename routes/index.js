var express = require('express');
var router = express.Router();
var socket = io("http://localhost:3000");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

module.exports = router;
