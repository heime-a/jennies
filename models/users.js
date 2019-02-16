const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  signUpDate: {
    type: Date,
    default: Date.now(),
  },
});
// eslint-disable-next-line max-len
UserSchema.methods.generateHash = passwordIn => bcrypt.hashSync(passwordIn, bcrypt.genSaltSync(8), null);
// eslint-disable-next-line func-names
UserSchema.methods.validPassword = function (passwordIn) {
  const ret = bcrypt.compareSync(passwordIn, this.password);
  return ret;
};
module.exports = mongoose.model('User', UserSchema);
