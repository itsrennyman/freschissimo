const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');

class UserController {

  index(req, res) {
    User.find().exec()
      .then(resource => res.send(resource))
      .catch(err => res.status(500).send(err))
  }

  show(req, res) {
    User.findOne({ username: req.params.username }).exec()
      .then(resource => res.send(resource))
      .catch(err => res.status(500).send(err))
  }

  store(req, res) {
    const payload = { 
      firstname: req.body.firstname, 
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      credentials: []
    }

    User.create(payload)
      .then(resource => res.send(resource))
      .catch(err => res.status(500).send(err))
  }

  async storeUserCredential(req, res) {
    const user = await User.findOne({ username: req.params.username }).exec();

    // Check user exists
    if (! user)
      return res.status(422).send({ message: 'User does not exists' });

    // Check missing type
    if (req.body.type === undefined) 
      return res.status(422).send({ message: 'Missing credentials type' });

    // Check already exists
    if (user.credentials.findIndex(x => x.type === req.body.type) != -1)
      return res.status(422).send({ message: 'This Credential already exists' });

    switch (req.body.type) {
      case 'jwt':
        req.body.secret = uuidv4();
        break;
      case 'basicAuth':
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        break;
      default:
        return res.status(422).send({ message: 'Invalid credentials type' });
    }

    req.body.id = uuidv4();

    await User.findOneAndUpdate({ username: req.params.username }, { credentials: [...user.credentials, req.body] })
      .then(() => res.send(req.body))
      .catch(err => res.status(500).send(err))
  }

  update(req, res) {
    const payload = { 
      firstname: req.body.firstname, 
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
    }

    User.findOneAndUpdate({ username: req.params.username }, payload)
      .then(() => res.send())
      .catch(err => res.status(500).send(err))
  }

  async updateUserCredential(req, res) {
    const user = await User.findOne({ username: req.params.username }).exec();

    // Check user exists
    if (! user)
      return res.status(422).send({ message: 'User does not exists' });

    // Check missing type
    if (req.body.type === undefined) 
      return res.status(422).send({ message: 'Missing credentials type' });

    // Check if exists
    const idIndex = user.credentials.findIndex(x => x.id === req.params.id);

    if (idIndex === -1)
      return res.status(422).send({ message: 'This Credential not exists' });

    switch (req.body.type) {
      case 'jwt': // Can update scopes
        user.credentials[idIndex].scopes = req.body.scopes;
        break;
      case 'basicAuth': // Can update password
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        break;
      default:
        return res.status(422).send({ message: 'Invalid credentials type' });
    }

    await User.findOneAndUpdate({ username: req.params.username }, { credentials: user.credentials })
      .then(() => res.send(req.body))
      .catch(err => res.status(500).send(err))
  }

}

module.exports = UserController;