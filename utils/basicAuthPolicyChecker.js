const bcrypt = require('bcrypt');

const User = require('../admin/models/User.js');

const basicAuthPolicyChecker = async function (req) {
  try {
    // Get Bearer Token
    const credentials = req.headers.authorization.split(' ')[1];
    
    // Decode to get user data //FIXME: I due punti possono essere nella password..
    const [username, password] = Buffer.from(credentials, 'base64').toString('ascii').split(':');

    // Get user from mongo
    const user = await User.findOne({ username: username }).exec();

    // Get credential JWT
    const basicAuthCredential = user.credentials.find(x => x.type === 'basicAuth');
    
    return bcrypt.compareSync(password, basicAuthCredential.password);
  } catch(err) {
    return false;
  }
}

module.exports = basicAuthPolicyChecker;