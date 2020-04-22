const isDatabaseProvided = function () {
  return process.env.MONGO_URL !== undefined && process.env.MONGO_URL !== "";
};

module.exports = isDatabaseProvided;
