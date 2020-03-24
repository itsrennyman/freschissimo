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
    User.create(req.body)
      .then(resource => res.send(resource))
      .catch(err => res.status(500).send(err))
  }

  update(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body)
      .then(() => res.send())
      .catch(err => res.status(500).send(err))
  }

}

module.exports = UserController;