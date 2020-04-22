var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var dotenv = require("dotenv");

var User = require("../../admin/models/User");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await makeUser();
    process.exit();
  });

async function makeUser() {
  const payload = {
    firstname: "Freschissimo",
    lastname: "Gateway",
    username: "freschissimo",
    email: "freschissimo@example.com",
    credentials: [
      {
        type: "basicAuth",
        password: bcrypt.hashSync("password", 10),
        id: "b2edb4b2-7759-46bc-ab57-4416cc4b0efc",
      },
      {
        type: "jwt",
        secret: "52dd5bd9-5995-4b60-8678-8c427c25dfa9",
        scopes: [],
        id: "31ec163f-c9c1-4887-889d-aa5dfbeb5768",
      },
    ],
  };

  var user = await User.create(payload).catch((err) =>
    console.log("An error has occurred", err)
  );

  console.log("Initialization Complete! The user created is:");
  console.log(user);
  console.log("The encrypted password is:", "password");
}
