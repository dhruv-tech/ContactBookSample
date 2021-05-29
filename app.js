/*
    Sample Contact Book App v1; Written by Dhruv.
*/

const mongoose = require('mongoose');
const fastify = require('fastify')({ logger: false });
const routes = require('./routes');
const util = require('./utils/util');

require('dotenv').config();

// Basic Auth

let validate = (username, password, req, res, done) => util.auth(username, password, process.env.USR, process.env.PWD, done);
fastify.register(require('fastify-basic-auth'), { validate, realm: 'ContactBookSample' });

// DB Connection

mongoose.connect(process.env.DB_URI)
.then(() => {
    console.log(`\x1b[32m%s\x1b[32m`, `Connected to DB.`);
})
.catch((err) => {
    console.error(`\x1b[33m%s\x1b[33m`, `Could not connect to DB.\n Error: ${err}`);
    process.exit(1);
});

// Routes

routes.forEach((route) => {
    fastify.route(route);
});

// Middleware 

fastify.after(() => {
    fastify.addHook('preHandler', fastify.basicAuth);

    fastify.addHook('preHandler', (req, res, done) => {

        if (req.body) req.body = util.sanitize(req.body);
    
        if (req.params) req.params = util.sanitize(req.params);
     
        done();
    })
});

const start = async() => {

    try {
      await fastify.listen(3000);
    } catch (err) {
      fastify.log.error(err);
    }

  }

  start();