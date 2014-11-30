var express = require('express')
var router = express.Router()
var Promise = require('bluebird')
var passport = require('passport')
var db = require('../db')
var User = require('../models/User')

db.createTables()

var dummyUsers = [
  {
    local_email: 'admin',
    local_password: 'no password'
  },
  {
    local_email: 'orange.tree@garden.com',
    local_password: 'Test3test'
  },
  {
    local_email: 'user',
    local_password: 'user'
  }
]
new User({ local_email: dummyUsers[0].local_email })
  .fetch()
  .then(function(user) {
    if (!user)
      db.createUsers(dummyUsers) // create dummy users if we don't already have them
  })

/* GET home page. */
router.get('/', function(req, res) {
  if (!req.user) return res.render('error', { message: 'Permission denied!', error: {status: 403}})
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

router.post('/playerstats', function(req, res) {
  db.updatePlayers(req.body).then(function(msg) {
    res.send(msg)
  }).catch(function(err) {
    console.log(err)
    res.send(err)
  })
})

router.get('/users', function(req, res) {
  db.getUsers().then(function(users) {
    res.send(users.toJSON())
  }).catch(function(err) {
    res.send(err)
  })
})

router.post('/users', function(req, res) {
  if (!req.body.password)
    return res.status(500).send('Password missing.')
  if (!req.body.email)
    return res.status(500).send('Email address missing')

  db.createUser({
    local_email: req.body.email,
    local_password: req.body.password
  }).then(function() {
    res.status(200).send()
  }).catch(function(err) {
    res.send(err)
  })
})

module.exports = router;