var express = require('express');
var router = express.Router();
var db = require('../db')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BF4 Stats', user: req.user || null });
});

router.get('/queries', function(req, res) {
  db.query1().then(function(weapons) {
    res.render('queries', {query1: weapons})
  })
});

module.exports = router;
