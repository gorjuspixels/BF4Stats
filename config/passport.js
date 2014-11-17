var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/User')

passport.use(new LocalStrategy(function(email, password, done) {
  console.log('got email', email)
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