/*
    Sample Contact Book App v1; Written by Dhruv.
*/

const mongoose = require('mongoose');
const fastify = require('./app')({ logger: false });

require('dotenv').config();

// DB Connection

mongoose.connect(process.env.DB_URI, {autoIndex: true, keepAlive: true}).then(() => {

    console.log(`\x1b[32m%s\x1b[32m`, `Connected to DB.`);

}).catch((err) => {

    console.error(`\x1b[33m%s\x1b[33m`, `Could not connect to DB.\n Error: ${err}`);
    process.exit(1);

});
  
const start = async() => {

    try {
      await fastify.listen(process.env.PORT || 3000, process.env.HOST);
      console.log(`\x1b[36m%s\x1b[36m`, `Application listening on ${fastify.server.address().port}`);
    } catch (err) {
      fastify.log.error(err);
    }
}

start();