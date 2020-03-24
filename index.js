const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const httpProxy = require('express-http-proxy')
const jwt = require('jsonwebtoken')

const checkPathExists = require('./utils/checkPathExists.js')
const getConfiguration = require('./utils/getConfiguration.js')
const jwtPolicyChecker = require('./utils/jwtPolicyChecker.js')

const UserController = require('./admin/controllers/UserController.js');

dotenv.config();

const gateway = express()
const admin = express()

// Configuration
admin.use(express.json());
admin.use(bodyParser.json());
admin.use(bodyParser.urlencoded({ extended: true })); 

gateway.get('/freschissimo', (req, res, next) => {
  const config = getConfiguration();

  if (!config)
    return res.status(500).send('Error during read configuration.')

  res.send(config);
})

gateway.get('*', async (req, res, next) => {
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
        // Get the pipeline which contains endpoint
        const pipeline = Object.keys(config.pipelines).find(pipelineName => {
          return config.pipelines[pipelineName].endpoints.indexOf(name) !== -1
        });

        if (!pipeline)
          return res.status(500).send('Cannot find pipeline for this endpoint');

        // Start policies check: The proxy is the last.
        for (const policy of Object.keys(config.pipelines[pipeline].policies)) {
          switch (policy) {
            case 'jwt':
              if (! await jwtPolicyChecker(req))
                return res.status(401).send('Unauthorized');
            default:
              break;
          }
        }

        // Proxy request: currently is mandatory.
        return httpProxy(config.pipelines[pipeline].policies.proxy.forwardTo)(req, res, next);
      } else {
        return res.status(405).send('Method not allowed');
      }
    }
  }

  return res.status(404).send('Not Found');
})


// Admin Side
admin.get('/users', (req, res) => new UserController().index(req, res));
admin.post('/users', (req, res) => new UserController().store(req, res));
admin.get('/users/:id', (req, res) => new UserController().show(req, res));
admin.put('/users/:id', (req, res) => new UserController().update(req, res));


// Initialize Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  // Start Gateway
  gateway.listen(3000, () => {
    console.log('Freschissimo listening on port 3000!');
  });
  // Start Admin
  admin.listen(3058, () => {
    console.log('Freschissimo Admin listening on port 3058!');
  });
}).catch(err => console.log(err));

mongoose.set('useFindAndModify', false);