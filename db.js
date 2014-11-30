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

var Damage = bookshelf.Model.extend({
  tableName: 'damage'
});

var Reload = bookshelf.Model.extend({
  tableName: 'reload'
});

var Recoil = bookshelf.Model.extend({
  tableName: 'recoil'
});

var Spread = bookshelf.Model.extend({
  tableName: 'spread'
});

var Supply = bookshelf.Model.extend({
  tableName: 'supply'
});

exports.createTables = function() {
  var self = this
  var shouldCreateWeapons = false
  var tableName = 'weapon'

  knex.schema.hasTable(tableName).then(function(exists) {
    if (!exists) {
      shouldCreateWeapons = true
      return knex.schema.createTable(tableName, function(t) {
        console.log('Creating', tableName, 'table...')
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
    var tableName = 'user'
    return knex.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        return knex.schema.createTable(tableName, function(t) {
          console.log('Creating', tableName, 'table...')
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
    var tableName = 'damage'
    return knex.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        return knex.schema.createTable(tableName, function(t) {
          console.log('Creating', tableName, 'table...')
          t.increments('id').references('id').inTable('weapon')
          t.string('Max_damage', 512)
          t.string('Min_damage', 512)
          t.string('Drop_off_start', 512)
          t.string('Drop_off_end', 512)
        });
      }
    })
  })
  .then(function() {
    var tableName = 'reload'
    return knex.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        return knex.schema.createTable(tableName, function(t) {
          console.log('Creating', tableName, 'table...')
          t.increments('id').references('id').inTable('weapon')
          t.string('Time_left', 512)
          t.string('Time_empty', 512)
          t.string('Time_threshold', 512)
          t.string('Mag_size', 512)
        });
      }
    })
  })
  .then(function() {
    var tableName = 'recoil'
    return knex.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        return knex.schema.createTable(tableName, function(t) {
          console.log('Creating', tableName, 'table...')
          t.increments('id').references('id').inTable('weapon')
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
    var tableName = 'spread'
    return knex.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        return knex.schema.createTable(tableName, function(t) {
          console.log('Creating', tableName, 'table...')
          t.increments('id').references('id').inTable('weapon')
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
    var tableName = 'supply'
    return knex.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        return knex.schema.createTable(tableName, function(t) {
          console.log('Creating', tableName, 'table...')
          t.increments('id').references('id').inTable('weapon')
          t.integer('count')
        });
      }
    })
  })
  .then(function(promise) {
    if (shouldCreateWeapons)
      return self.createDefaultWeapons()
  })
}


exports.query1 = function() {
  return knex.from('weapon')
    .innerJoin('damage', 'weapon.id', 'damage.id')
    .join('reload', 'weapon.id', 'reload.id')
    .select(['Name', 'Max_damage', 'Min_damage', 'Mag_size'])
    .orderBy('Name')
    .then(function(weapons) {
      return Promise.resolve(weapons)
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

exports.createDefaultWeapons = function() {
  console.log('Creating default weapons...')
  var weaponData = require('./data.json')

  return Promise.each(weaponData, function(data) {
    return new Weapon({
      Name: data.Weapon['Name'],
      Rate_of_fire: data.Weapon['Rate_of_Fire'],
      Muzzle_velocity: data.Weapon['Muzzle_Velocity'],
      Max_dist: data.Weapon['Max_Distance'],
      Bullet_drop: data.Weapon['Bullet_Drop'],
      Img_file_loc: data.Weapon['Image_File_Location']
    }).save()
    .then(function() {
      new Damage({
            Max_damage: data.Damage['Max_Damage'],
            Min_damage: data.Damage['Min_Damage'],
            Drop_off_start: data.Damage['Drop-off_start'],
            Drop_off_end: data.Damage['Drop-off_end']
          }).save()
    })
    .then(function() {
      new Reload({
            Time_left: data.Reload['Reload_time_left'],
            Time_empty: data.Reload['Reload_time_empty'],
            Time_threshold:data.Reload['Reload_time_threshold'],
            Mag_size: data.Reload['mag_size']
          }).save()
    })
    .then(function() {
      new Recoil({
            up: data.Recoil['Recoil_Upwards'],
            left: data.Recoil['Recoil_Left'],
            right: data.Recoil['Recoil_Right'],
            dec: data.Recoil['Recoil_Decrease'],
            First_shot_mult: data.Recoil['Fst_Short_Multiplier']
          }).save()
    })
    .then(function() {
      new Spread({
            Ads_nmm: data.Spread['ADS_Spread_Not_moving_minimum'],
            Ads_mm: data.Spread['ADS_Spread_moving_minimum'],
            Hip_s_nmm: data.Spread['HIP_Spread_Stand_Not_Moving_minimum'],
            Hip_c_nmm: data.Spread['HIP_Spread_Crouch_Not_Moving_minimum'],
            Hip_p_nmm: data.Spread['HIP_Spread_Prone_Not_Moving_minimum'],
            Hip_s_mm: data.Spread['HIP_Spread_Stand_Moving_minimum'],
            Hip_c_mm: data.Spread['HIP_Spread_Crouch_Moving_minimum'],
            Hip_p_mm: data.Spread['HIP_Spread_Prone_Moving_minimum'],
            Inc: data.Spread['Spread_Increase_per_Shot'],
            Dec: data.Spread['Spread_Decrease_per_Shot']
          }).save()
    })
    .then(function() {
      var count = Math.floor(Math.random() * 500)
      new Supply({
            count: count
          }).save()
    })
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