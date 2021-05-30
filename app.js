/*
    Sample Contact Book App v1; Written by Dhruv.
*/

const mongoose = require('mongoose');
const fastify = require('fastify')({ logger: true });
const routes = require('./routes');
const util = require('./utils/util');
const auth = require('basic-auth');

require('dotenv').config();


// DB Connection

mongoose.connect(process.env.DB_URI, {autoIndex: true, keepAlive: true})
.then(() => {
    console.log(`\x1b[32m%s\x1b[32m`, `Connected to DB.`);
})
.catch((err) => {
    console.error(`\x1b[33m%s\x1b[33m`, `Could not connect to DB.\n Error: ${err}`);
    process.exit(1);
});

// Middleware

fastify.addHook('onRequest', async(req, res) => {
    
    try {
        const credentials = auth(req);
        await util.auth(credentials, process.env.USR, process.env.PWD);
    } catch (error) {
        res.code(401);
        throw error;
    }

    return;
});

fastify.addHook('preHandler', (req, res, done) => {

    if (req.body) req.body = util.sanitize(req.body);

    if (req.params) req.params = util.sanitize(req.params);
    
    done();
});

// Routes

routes.forEach((route) => {
    fastify.route(route);
});
  
const start = async() => {

    try {
      await fastify.listen(3000);
    } catch (err) {
      fastify.log.error(err);
    }

  }

  start();