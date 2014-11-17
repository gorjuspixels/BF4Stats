var express = require('express')
var router = express.Router()
var Promise = require('bluebird')
var passport = require('passport')
var jwt = require('jwt-simple')
var db = require('../db')

db.createTables()

var TOKEN_SECRET = 'not_secure_secret'

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/User')

passport.use(new LocalStrategy(function(email, password, done) {
  new User({
    local_email: email
  })
    .fetch()
    .then(function(user) {
      if (!user)
        return done(null, false, {
          message: 'Incorrect username.'
        });

      if (!user.validPassword(password))
        return done(null, false, {
          message: 'Incorrect password.'
        });

      return done(null, user);
    })
    .catch(function(err) {
      return done(err);
    })
}));


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



router.get('/users', function(req, res) {
  db.getUsers().then(function(users) {
    res.send(users.toJSON())
  }).catch(function(err) {
    res.send(err)
  })
})

router.post('/users', function(req, res) {
  if (!req.body.password)
    return res.status(500, 'Password missing.')
  if (!req.body.email)
    return res.status(500, 'Email address missing')

  db.createUser({
    local_email: req.body.email,
    local_password: req.body.password
  }).then(function() {
    res.status(200).send()
  }).catch(function(err) {
    res.send(err)
  })
})

router.post('/login', function(req, res, next) {
  passport.authenticate('local', { session: false }, function(err, user, info) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).json({ error: 'No user found' });
    }

    //user has authenticated correctly thus we create a JWT token 
    var token = jwt.encode({ email: user.local_email}, TOKEN_SECRET);
    res.json({ token : token });
  })(req, res, next);
})

module.exports = router;