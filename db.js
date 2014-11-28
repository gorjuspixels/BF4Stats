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
        t.string('Name', 512);
        t.string('Rate_of_fire', 512);
        t.string('Muzzle_velocity', 512);
        t.string('Max_dist', 512);
        t.string('Bullet_drop', 512);
        t.string('Img_file_loc', 512);
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
  .then(function() {
    knex.schema.hasTable('damage').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('damage', function(t) {
          t.integer('id').references('id').inTable('weapon')
          t.string('Max_damage', 512)
          t.string('Min_damage', 512)
          t.string('Drop_off_start', 512)
          t.string('Drop_off_end', 512)
          t.string('Img_file_loc', 512)
        });
      }
    })
  })
  .then(function() {
    knex.schema.hasTable('reload').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('reload', function(t) {
          t.integer('id').references('id').inTable('weapon')
          t.string('Time_left', 512)
          t.string('Time_empty', 512)
          t.string('Time_threshold', 512)
          t.string('Mag_size', 512)
        });
      }
    })
  })
  .then(function() {
    knex.schema.hasTable('recoil').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('recoil', function(t) {
          t.integer('id').references('id').inTable('weapon')
          t.string('up', 512)
          t.string('left', 512)
          t.string('right', 512)
          t.string('dec', 512)
          t.string('First_shot_mult', 512)
        });
      }
    })
  })
  .then(function() {
    knex.schema.hasTable('spread').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('spread', function(t) {
          t.integer('id').references('id').inTable('weapon')
          t.string('Ads_nmm', 512)
          t.string('Ads_mm', 512)
          t.string('Hip_s_nmm', 512)
          t.string('Hip_c_nmm', 512)
          t.string('Hip_p_nmm', 512)
          t.string('Hip_s_mm', 512)
          t.string('Hip_c_mm', 512)
          t.string('Hip_p_mm', 512)
          t.string('Inc', 512)
          t.string('Dec', 512)
        });
      }
    })
  })
  .then(function() {
    knex.schema.hasTable('supply').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('supply', function(t) {
          t.integer('id').references('id').inTable('weapon')
          t.integer('count')
        });
      }
    })
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

var getDemoQueries = exports.getDemoQueries = function() {
  // bookshelf.knex('weapon')
  //   .join('Comp', 'Comp.cId', '=', 'Inv.cId')
  //   .where('Inv.id', 2)
  //   .select()
  //   .then(...)
}