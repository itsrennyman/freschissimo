const bcrypt = require('bcrypt');

const User = require('../models/User');

class UserController {

  index(req, res) {
    User.find().exec()
      .then(resource => res.send(resource))
      .catch(err => res.status(500).send(err))
  }

  show(req, res) {
    User.findById(req.params.id).exec()
      .then(resource => res.send(resource))
      .catch(err => res.status(500).send(err))
  }

  store(req, res) {
    // Check has saved credential basicAuth
    const basicAuthCredential = req.body.credentials.findIndex(x => x.type === 'basicAuth');

    if (basicAuthCredential > 0) {
      console.log(req.body.credentials[basicAuthCredential].password);
      req.body.credentials[basicAuthCredential].password = bcrypt.hashSync(req.body.credentials[basicAuthCredential].password, 10)
    }

    User.create(req.body)
      .then(resource => res.send(resource))
      .catch(err => res.status(500).send(err))
  }

  update(req, res) {
    // Check has saved credential basicAuth
    const basicAuthCredential = req.body.credentials.findIndex(x => x.type === 'basicAuth');

    if (basicAuthCredential > 0) 
      req.body.credentials[basicAuthCredential].password = bcrypt.hashSync(req.body.credentials[basicAuthCredential].password, 10)

    User.findByIdAndUpdate(req.params.id, req.body)
      .then(() => res.send())
      .catch(err => res.status(500).send(err))
  }

}

module.exports = UserController;