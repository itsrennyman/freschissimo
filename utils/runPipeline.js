const httpProxy = require("express-http-proxy");

const getConfiguration = require("./getConfiguration.js");
const jwtPolicyChecker = require("./jwtPolicyChecker.js");
const basicAuthPolicyChecker = require("./basicAuthPolicyChecker.js");

const runPipeline = async (req, res, pipeline) => {
  // Managed by configuration YAML
  const config = getConfiguration();

  console.log("Eccomi qui", pipeline, config.pipelines[pipeline].policies);

  if (!config) return res.status(500).send("Error during read configuration.");

  // Start policies check: The proxy is the last set a flag here for performance.
  let hasProxy = false;

  for (const policy of Object.keys(config.pipelines[pipeline].policies || [])) {
    switch (policy) {
      case "jwt":
        if (!(await jwtPolicyChecker(req)))
          return res.status(401).send("Unauthorized");
        break;
      case "basicAuth":
        if (!(await basicAuthPolicyChecker(req)))
          return res.status(401).send("Unauthorized");
        break;
      case "proxy":
        hasProxy = true;
        break;
      default:
        break;
    }
  }

  // Check has proxy policy:
  if (hasProxy)
    return httpProxy(config.pipelines[pipeline].policies.proxy.forwardTo)(
      req,
      res
    );

  // No policies or all checks done? Good!
  return res.redirect(`${config.pipelines[pipeline].url}${req.url}`);
};

module.exports = runPipeline;
