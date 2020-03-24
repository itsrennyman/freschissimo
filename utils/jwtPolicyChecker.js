const User = require('./admin/models/User.js');

const jwtPolicyChecker = async function (req) {
  try {
    // Get Bearer Token
    const token = req.headers.authorization.split(' ')[1];

    // Decode to get user data
    const jwtPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('ascii'));

    // Get user from mongo
    const user = await User.findOne({ username: jwtPayload.username }).exec()
  
    // Get credential JWT
    const jwtCredential = user.credentials.find(x => x.type === 'jwt');

    try {
      jwt.verify(token, jwtCredential.secret);
    } catch(e) {
      return false;
    }
  } catch(err) {
    return false;
  }
}

module.exports = jwtPolicyChecker;