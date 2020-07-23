var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var dotenv = require('dotenv').config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hi.');
});

router.get('/get-toggle', function (req, res) {
  const query = "select count from toggle where ID = 1";
  connection.query(query, function (err, rows, fields) {
    if (err) {
      res.send({ queryStatus: false, message: err });
    } else {
      res.send({ queryStatus: true, count: rows[0].count });
    }
  });
});

router.get('/toggle', function (req, res) {
  const { darkMode } = req.query;

  if (darkMode) {
    //if darkMode == dark, set status = 0, otherwise 1
    const query = "update toggle set count = " + (darkMode == "true" ? "count + 1" : "count") + ", status = '" + (darkMode == "true" ? "dark" : "light") + "' where ID = 1";
    connection.query(query, function (err, rows, fields) {
      if (err) {
        res.send({ queryStatus: false, message: err });
      } else {
        res.send({ queryStatus: true });
      }
    });
  } else {
    res.send({ queryStatus: false, message: "Invalid request. Missing params" });
  }
});

module.exports = router;
