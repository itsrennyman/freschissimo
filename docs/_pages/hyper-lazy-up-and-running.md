## Hyper Lazy Up And Running

This tutorial will help you set up Freschissimo in seconds.

NB: This tutorial does not include the database utilization, this is useful when your purpose is to set up a simple gateway without caring about policies. If you need something complex, please refer to the [Full Up And Running Section](_pages/full-up-and-running.md).

Clone the repository and install dependencies:

```bash
git clone https://github.com/itsrennyman/freschissimo.git
cd freschissimo && npm install
```

Start Freschissimo

```bash
node index.js
```

By starting the service, will be exposed two services:

- At localhost:3000 the Gateway endpoints
- At localhost:3058 the Admin APIs

With this no-config procedure, Freschissimo take the default configuration file stored in the config directory. That file is already configured with some Endpoint from the super [PokeAPI](https://pokeapi.co/). You can try some apis inside it. With zero configurazion needed. Cool Right?

## Explore A Minimal Configuration

Let's look at a very small example in order to start understand logic quickly!

```yaml
# Minimal Configuration for Freschissimo API Gateway

endpoints: 
  pokeApi:
    paths: 
      - '/api/v2/pokemon'
    methods: 
      - GET

pipelines:
  pokeApiService:
    endpoints:
      - pokeApi
    url: 'https://pokeapi.co'
```

This file indicates that an endpoint can be called on the path /api/v2/pokemon
and all the requests to that path will be referred to the pokeApiService which
has the url https://pokeapi.co.

Let's CURL that!

```bash
curl -L http://localhost:3000/api/v2/pokemon
```
<sub>We need to use the -L option in order to follow redirect. Cuz Freschissimo makes a redirect with no extra configuration.</sub>

And Here the result!

```javascript
{
    "count": 964,
    "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
    "previous": null,
    "results": [
        {"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"},
        {"name": "ivysaur", "url": "https://pokeapi.co/api/v2/pokemon/2/"},
        {"name": "venusaur", "url": "https://pokeapi.co/api/v2/pokemon/3/"},
        {"name": "charmander", "url": "https://pokeapi.co/api/v2/pokemon/4/"},
        {"name": "charmeleon", "url": "https://pokeapi.co/api/v2/pokemon/5/"},
        {"name": "charizard", "url": "https://pokeapi.co/api/v2/pokemon/6/"},
        {"name": "squirtle", "url": "https://pokeapi.co/api/v2/pokemon/7/"},
        {"name": "wartortle", "url": "https://pokeapi.co/api/v2/pokemon/8/"},
    ]
}
```