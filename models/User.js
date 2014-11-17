var bcrypt = require('bcrypt')
var dbConfig = require('../config/db')
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf.Model.extend({
  tableName: 'user',
  // generating a hash
  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  },

  // checking if password is valid
  validPassword: function(password) {
    return bcrypt.compareSync(password, this.attributes.local_password)
  }
});