# Configuration Reference

All the available configuration are stored in a single YAML file. Let's see what you can do with that!

### Endpoints
Endpoints are the REST url paths enabled to receive calls from clients.
Each endpoint must have a name, one or more paths and one or more HTTP Method.

```yaml
# Endpoints

endpoints: 
  pokeApi: # Name
    paths:
      - '/api/v2/pokemon' # One or more path
    methods: 
      - GET # One or more HTTP Method
```

### Pipelines
Pipelines are containers for endpoints logic. In its most basic configuration it is possible to set a destination url for your endpoints, a redirect will then be made to that address.

```yaml
# Pipelines

pipelines:
  pokeApiService:
    endpoints:
      - pokeApi
    # So, if i call [FreschissimoUrl]/api/v2/pokemon it will be redirected to https://pokeapi.co/api/v2/pokemon
    url: 'https://pokeapi.co'
```

This the most minimal example. If you want something more complex, you need to add Pipelines Policies.

#### Pipelines Policies
Policies help you when you need, for example, to manage Basic Authentication or want to verify a JWT Token, at the moment there are three types of policies available:

- Basic Authentiation
- JWT Token
- Proxy

##### Basic Authentication
Basic authorization contains a username and password. They are joined together by a : and then base64 encoded.

A basic authorization header containing the username Mochi and password Pizza would look like this:

```bash
Authorization: Basic TW9jaGk6UGl6emEK
```

Here is an Example:

```yaml
# Basic Authentication

pipelines:
  pokeApiService:
    endpoints:
      - pokeApi
    policies:
      basicAuth: # This will check if user can basic authenticate
    url: 'https://pokeapi.co'
```

##### JWT Token
Todo Documentation

##### Proxy
Todo Documentation