const express = require("express");

const getConfiguration = require("./utils/getConfiguration");
const runPipeline = require("./utils/runPipeline");

const initRoutes = () => {
  let router = express.Router();

  // Managed by configuration YAML
  const config = getConfiguration();

  if (!config) return res.status(500).send("Error during read configuration.");

  for (const name of Object.keys(config.endpoints)) {
    const endpoint = config.endpoints[name];

    endpoint.methods.forEach((method) => {
      endpoint.paths.forEach((path) => {
        // Get the pipeline which contains endpoint
        const pipeline = Object.keys(config.pipelines).find((pipelineName) => {
          return config.pipelines[pipelineName].endpoints.indexOf(name) !== -1;
        });

        if (!pipeline)
          console.log(`Warning: Cannot find pipeline for endpoint: ${name}`);

        // Push routes
        router[method.toLowerCase()](path, (req, res) =>
          runPipeline(req, res, pipeline)
        );
      });
    });
  }

  return router;
};

module.exports = initRoutes;
