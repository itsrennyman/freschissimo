const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const pino = require("express-pino-logger");

const initRoutes = require("./initRoutes");
const getConfiguration = require("./utils/getConfiguration.js");
const isDatabaseProvided = require("./utils/isDatabaseProvided.js");

const UserController = require("./admin/controllers/UserController.js");

dotenv.config();

let gateway = express();
const admin = express();

// Configuration
if (process.env.NODE_ENV !== "testing") {
  gateway.use(pino());
}

gateway.use(cors());
admin.use(express.json());
admin.use(bodyParser.json());
admin.use(bodyParser.urlencoded({ extended: true }));

gateway.get("/freschissimo", (req, res) => {
  const config = getConfiguration();

  if (!config) return res.status(500).send("Error during read configuration.");

  res.send(config);
});

gateway = initRoutes(gateway);

// Admin Side
admin.get("/users", (req, res) => new UserController().index(req, res));
admin.post("/users", (req, res) => new UserController().store(req, res));
admin.get("/users/:username", (req, res) =>
  new UserController().show(req, res)
);
admin.put("/users/:username", (req, res) =>
  new UserController().update(req, res)
);
admin.post("/users/:username/credentials", (req, res) =>
  new UserController().storeUserCredential(req, res)
);
admin.put("/users/:username/credentials/:id", (req, res) =>
  new UserController().updateUserCredential(req, res)
);

// Initialize Connection only if MONGO_URL is provided.
if (isDatabaseProvided()) {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      startServices();
    })
    .catch((err) => console.log(err));

  mongoose.set("useFindAndModify", false);
} else {
  startServices();
}

function startServices() {
  // Start Gateway
  gateway.listen(3000, () => {
    console.log("Freschissimo listening on port 3000!");
  });
  // Start Admin
  admin.listen(3058, () => {
    console.log("Freschissimo Admin listening on port 3058!");
  });
}

module.exports = gateway;
