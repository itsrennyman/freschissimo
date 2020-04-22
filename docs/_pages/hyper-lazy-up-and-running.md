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

With this no-config procedure, Freschissimo take the default configuration file stored in the config directory. That file is already configured with some Endpoint from the super [PokeAPI](https://pokeapi.co/). You can try some apis inside it. With zero configurazion needed. Cool yeah?