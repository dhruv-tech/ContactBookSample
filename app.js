/*
    Sample Contact Book App v1; Written by Dhruv.
*/

const fastify = require('fastify');
const routes = require('./routes');
const util = require('./utils/util');
const auth = require('basic-auth');

const build = (opts={}) => {

    const app = fastify(opts);
    
    // Middleware

    app.addHook('onRequest', async(req, res) => {
    
        try {
            const credentials = auth(req);
            await util.auth(credentials, process.env.USR, process.env.PWD);
        } catch (error) {
            res.code(401);
            throw error;
        }

        return;
    });

    app.addHook('preHandler', (req, res, done) => {

        if (req.body) req.body = util.sanitize(req.body);

        if (req.params) req.params = util.sanitize(req.params);
        
        done();
    });

    // Routes

    routes.forEach((route) => {
        app.route(route);
    });

    return app;
}

module.exports = build;