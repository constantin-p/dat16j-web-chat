const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


let userSchema = mongoose.Schema({
  email: String,
  password: String,
});


userSchema.methods.generateHash = (input) => {
  return bcrypt.hashSync(String(input), bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function (input) {
  return bcrypt.compareSync(String(input), this.password);
};

module.exports = mongoose.model('User', userSchema);