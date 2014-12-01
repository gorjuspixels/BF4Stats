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
  .then(db.query3)
  .then(function(weapons) {
      return queries.query3 = weapons
  })
  .then(db.query4)
  .then(function(weapons){
    return queries.query4 = weapons
  })
  .then(db.query5)
  .then(function(weapons){
    return queries.query5 = weapons
  })
  .then(db.query6)
  .then(function(weapons){
    return queries.query6 = weapons
  })
  .then(db.query7)
  .then(function(weapons){
    return queries.query7 = weapons
  })
  .then(db.query8)
  .then(function(weapons){
    return queries.query8 = weapons
  })
  .then(db.query9)
  .then(function(weapons){
    return queries.query9 = weapons
  })
  .then(db.query10)
  .then(function(weapons){
    return queries.query10 = weapons
  })

  .then(function() {
    res.render('queries', queries)
  })
});

router.get('/players', function(req, res) {
  db.getPlayerStats().then(function(playerStats) {
    res.render('online_players', {data: playerStats.toJSON()})
  })
})

module.exports = router;