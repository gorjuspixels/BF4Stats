var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var db = require('../db')

db.createTables()


/* GET home page. */
router.get('/', function(req, res) {
  res.render('../views/api');
});

router.get('/weapons', function(req, res) {
  db.getWeapons().then(function(weapons) {
    res.send(weapons.toJSON())
  }).catch(function(err) {
    res.send(err)
  })
})

router.post('/weapons', function(req, res) {
  db.createWeapons([
    {
      model: 'test 1 weapon',
      damage: 200.5
    },
    {
      model: 'test 2 weapon',
      damage: 500
    }
  ]).then(function(msg) {
    res.send(msg)
  }).catch(function(err) {
    res.send(err)
  })
})

module.exports = router;