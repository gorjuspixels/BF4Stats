var Promise = require('bluebird');
var bcrypt = require('bcrypt')
var dbConfig = require('./config/db')

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);
var User = require('./models/User')


/********** MODELS ***********/
var Weapon = bookshelf.Model.extend({
  tableName: 'weapon'
});

exports.createTables = function() {
  knex.schema.hasTable('weapon').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('weapon', function(t) {
        t.increments('id').primary();
        t.string('model', 100);
        t.float('damage');
      });
    }
  })
  .then(function() {
    knex.schema.hasTable('user').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('user', function(t) {
          t.increments('id').primary();
          t.string('local_email', 500)
          t.string('local_password', 500)
          t.string('fb_token', 500)
          t.string('fb_id', 500)
          t.string('fb_email', 500)
          t.string('fb_name', 500)
        });
      }
    });
  })
}

exports.getWeapons = function() {
  return new Weapon().fetchAll()
    .then(function(weapons) {
      return Promise.resolve(weapons)
    }).catch(function(error) {
      console.log(error)
      return Promise.reject(error)
    });
}

exports.createWeapons = function(weapons) {

  return Promise.each(weapons, function(weapon) {
    return new Weapon(weapon).save().then(function() {
      return Promise.resolve(weapon.model, 'successfully created')
    })
    .catch(function(error) {
      console.log(error)
      return Promise.reject(error)
    })
  }).then(function(msg) {
    return Promise.resolve(msg)
  })
}


exports.getUsers = function() {
  return new User().fetchAll()
    .then(function(users) {
      return Promise.resolve(users)
    }).catch(function(error) {
      console.log(error)
      return Promise.reject(error)
    });
}

exports.createUsers = function(users) {
  return Promise.each(users, function(userData) {
    return createUser(userData)    
  }).then(function() {
    return Promise.resolve()
  })
}

var createUser = exports.createUser = function(userData) {
  var user = new User(userData)
  user.set('local_password', user.generateHash(user.get('local_password')))

  return user.save().then(function() {
    return Promise.resolve()
  })
  .catch(function(error) {
    console.log(error, error.stack)
    return Promise.reject(error)
  })
}