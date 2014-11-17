var Promise = require('bluebird');
var dbConfig = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'bf4user',
    password: 'not_so_secure_pass',
    database: 'bf4',
    charset: 'utf8'
  }
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);


/********** MODELS ***********/
var Weapon = bookshelf.Model.extend({
  tableName: 'weapon'
});

var User = bookshelf.Model.extend({
  tableName: 'user'
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
          t.string('email', 100);
          t.string('password', 100);
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
    return new User(userData).save().then(function() {
      return Promise.resolve()
    })
    .catch(function(error) {
      console.log(error)
      return Promise.reject(error)
    })
  }).then(function(msg) {
    return Promise.resolve(msg)
  })
}