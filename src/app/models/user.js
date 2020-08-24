// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define the schema for our user model
const userSchema = new mongoose.Schema({
  userid: String,
  password: String,
  role: String,
  name: String,
  created: Date,
  updated: Date,
});

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
