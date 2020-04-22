## Full Up And Running

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

With no configuration, you can use Freschissimo as simple gateway for your APIs, but if you need to use some extra features like policies, keep in mind that you need to set up a database storage.

Currently Freschissimo works with MongoDB, to use the storage, just copy the *.env.example* in *.env* and fill the **MONGO_URL** with your mongo instance. 

"But i need the initial data in order to try it.."

The solution:
```bash
npm run freschissimo:initialize
```

This command will create for you a test user, with this credentials:

Username: freschissimo - Password: password

With that user now, you can use all of the Endpoints Which you have created! Check out the Configuration Reference!