var express = require('express');
var router = express.Router();
var db = require('../db')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BF4 Stats', user: req.user || null });
});


// Queries go here
router.get('/queries', function(req, res) {
  var queries = {}
  db.query1().then(function(weapons) {
    return queries.query1 = weapons
  })
  .then(db.query2)
  .then(function(weapons) {
      return queries.query2 = weapons
  })
  .then(function() {
    res.render('queries', queries)
  })
});

module.exports = router;
