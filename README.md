<p align="center"><img src="./logo.png" width="60%"></p>

[![StyleCI](https://github.styleci.io/repos/249683371/shield?branch=master)](https://github.styleci.io/repos/249683371)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=itsrennyman_freschissimo&metric=alert_status)](https://sonarcloud.io/dashboard?id=itsrennyman_freschissimo)
[![codebeat badge](https://codebeat.co/badges/b1ee6796-128c-4e0d-870d-26ff38d612db)](https://codebeat.co/projects/github-com-itsrennyman-freschissimo-master)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

## About Freschissimo

Need an API Gateway? Maybe you need also a simple configuration, and a log system fully integrated? Welcome in Paradise!

Based on the Rock Solid ExpressJS Router, Freschissimo allows you set up a simple gateway with very few lines of yaml configuration. Follow the instruction to get started!

### Give me a star for the project support! The badges speak for me <3

## Hyper Lazy Up And Running

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

## Concrete Up and Running

With no configuration, you can use Freschissimo as simple gateway for your APIs, but if you need to use some extra features like policies, keep in mind that you need to set up a database storage.

Currently Freschissimo works with MongoDB, to use the storage, just copy the *.env.example* in *.env* and fill the **MONGO_URL** with your mongo instance. 

*"But i need the initial data in order to try it.."*

The solution:
```bash
npm run freschissimo:initialize
```

This command will create for you a test user, with this credentials:

Username: freschissimo - Password: password

With that user now, you can use all of the APIs.

In Progress:
- Documentation
- Admin UI
- 10 Stars Reach :) (Gimme a Star in Order to Support the project)