const {
  Schema,
  model
} = require('mongoose');

const options = {
  versionKey: false,
  timestamps: true,
}

const schema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  credentials: Array
}, options);

const User = model('user', schema);

module.exports = User;