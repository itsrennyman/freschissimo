const express = require('express')
const httpProxy = require('express-http-proxy')

const checkPathExists = require('./utils/checkPathExists.js')
const getConfiguration = require('./utils/getConfiguration.js')

const app = express()

// Authentication
app.use((req, res, next) => {
  // TODO: my authentication logic
  next()
})

app.get('/freschissimo', (req, res, next) => {
  const config = getConfiguration();

  if (!config)
    return res.status(500).send('Error during read configuration.')

  res.send(config);
})

app.get('*', (req, res, next) => {
  // Managed by configuration YAML
  const config = getConfiguration();

  if (!config)
    return res.status(500).send('Error during read configuration.')

  // Check url is present in endpoints
  for (const name of Object.keys(config.endpoints)) {
    const endpoint = config.endpoints[name];

    // If endpoint exists
    if (checkPathExists(endpoint, req)) {
      // If method is allowed
      if (endpoint.methods.indexOf(req.method) !== -1) {
        // Needs to get where to Proxy
        const pipeline = Object.keys(config.pipelines).find(pipelineName => {
          return config.pipelines[pipelineName].endpoints.indexOf(name) !== -1
        });

        if (!pipeline)
          return res.status(500).send('Cannot find pipeline for this endpoint');

        return httpProxy(config.pipelines[pipeline].policies.proxy.forwardTo)(req, res, next);
      } else {
        return res.status(405).send('Method not allowed');
      }
    }
  }

  return res.status(404).send('Not Found');
})

// Start
app.listen(3000, () => {
  console.log('Freschissimo listening on port 3000!');
});
